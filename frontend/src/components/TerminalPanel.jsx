import { useEffect, useRef, useState } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { io } from 'socket.io-client'
import '@xterm/xterm/css/xterm.css'

export default function TerminalPanel({ sandboxId }) {
  const containerRef = useRef(null)
  const termRef      = useRef(null)
  const fitRef       = useRef(null)
  const socketRef    = useRef(null)
  const inputBufRef  = useRef('')
  const [connected, setConnected] = useState(false)
  const [error, setError]         = useState(null)

  useEffect(() => {
    if (!sandboxId || !containerRef.current) return

    // ── Build the agent host from the sandboxId ──
    const agentHost = `http://${sandboxId}.agent.localhost`

    // ── Init xterm ──
    const term = new Terminal({
      theme: {
        background:   '#0a0a0f',
        foreground:   '#e2e8f0',
        cursor:       '#818cf8',
        cursorAccent: '#0a0a0f',
        black:        '#0f172a',
        red:          '#f87171',
        green:        '#4ade80',
        yellow:       '#fbbf24',
        blue:         '#60a5fa',
        magenta:      '#c084fc',
        cyan:         '#22d3ee',
        white:        '#e2e8f0',
        brightBlack:  '#475569',
        brightRed:    '#fca5a5',
        brightGreen:  '#86efac',
        brightYellow: '#fde68a',
        brightBlue:   '#93c5fd',
        brightMagenta:'#d8b4fe',
        brightCyan:   '#67e8f9',
        brightWhite:  '#f8fafc',
      },
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
      fontSize:   13,
      lineHeight: 1.5,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 2000,
      allowTransparency: true,
    })

    const fitAddon      = new FitAddon()
    const webLinksAddon = new WebLinksAddon()
    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)
    term.open(containerRef.current)
    fitAddon.fit()

    termRef.current = term
    fitRef.current  = fitAddon

    // ── Welcome message ──
    term.writeln('\x1b[1;34m╭─────────────────────────────────────╮\x1b[0m')
    term.writeln('\x1b[1;34m│  \x1b[1;36mSandbox Terminal\x1b[0m\x1b[1;34m                     │\x1b[0m')
    term.writeln(`\x1b[1;34m│  \x1b[0m\x1b[2mSandbox: ${sandboxId.slice(0, 8)}…\x1b[0m\x1b[1;34m        │\x1b[0m`)
    term.writeln('\x1b[1;34m╰─────────────────────────────────────╯\x1b[0m')
    term.writeln('\x1b[2mConnecting to sandbox…\x1b[0m')
    term.writeln('')

    // ── Socket.IO ──
    const socket = io(agentHost, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      timeout: 10000,
    })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      setError(null)
      term.writeln('\x1b[1;32m✓ Connected to sandbox\x1b[0m\r\n')
    })

    socket.on('disconnect', () => {
      setConnected(false)
      term.writeln('\r\n\x1b[1;33m⚠ Disconnected from sandbox\x1b[0m')
    })

    socket.on('connect_error', (err) => {
      setError(`Connection failed: ${err.message}`)
      term.writeln(`\r\n\x1b[1;31m✗ Connection error: ${err.message}\x1b[0m`)
    })

    socket.on('terminal-output', (data) => {
      term.write(data)
    })

    // ── Handle keyboard input ──
    term.onData((data) => {
      // Echo locally and buffer
      if (data === '\r') {
        const cmd = inputBufRef.current
        inputBufRef.current = ''
        socket.emit('terminal-input', cmd + '\n')
      } else if (data === '\x7f') {
        // Backspace
        if (inputBufRef.current.length > 0) {
          inputBufRef.current = inputBufRef.current.slice(0, -1)
          term.write('\b \b')
        }
      } else if (data === '\x03') {
        // Ctrl+C
        inputBufRef.current = ''
        socket.emit('terminal-input', '\x03')
      } else if (data === '\x04') {
        // Ctrl+D
        socket.emit('terminal-input', '\x04')
      } else {
        inputBufRef.current += data
        term.write(data)
      }
    })

    // ── Resize observer ──
    const ro = new ResizeObserver(() => {
      try { fitAddon.fit() } catch (_) {}
    })
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      socket.disconnect()
      term.dispose()
      termRef.current = null
      socketRef.current = null
    }
  }, [sandboxId])

  function clearTerminal() {
    termRef.current?.clear()
  }

  function reconnect() {
    if (socketRef.current?.disconnected) {
      socketRef.current.connect()
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f]">
      {/* Terminal toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 flex-shrink-0">
        {/* Traffic lights */}
        <div className="flex gap-1.5 mr-2">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 flex-1">
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3" />
          </svg>
          <span className="text-xs text-slate-500 font-mono">
            bash — {sandboxId?.slice(0, 8)}…
          </span>
        </div>

        {/* Status */}
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
          connected
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : error
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            connected ? 'bg-emerald-400 animate-pulse' : error ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'
          }`} />
          {connected ? 'Connected' : error ? 'Error' : 'Connecting…'}
        </div>

        {/* Actions */}
        <div className="flex gap-1 ml-1">
          {!connected && error && (
            <button
              onClick={reconnect}
              title="Reconnect"
              className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          <button
            id="clear-terminal-btn"
            onClick={clearTerminal}
            title="Clear terminal"
            className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* xterm container */}
      <div
        ref={containerRef}
        id="terminal-container"
        className="flex-1 overflow-hidden p-2"
        style={{ minHeight: 0 }}
      />
    </div>
  )
}
