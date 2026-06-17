import { useState, useRef, useEffect } from 'react'

function BotIcon() {
  return (
    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
      </svg>
    </div>
  )
}

function UserIcon() {
  return (
    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg">
      <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    </div>
  )
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0,1,2].map(i => (
        <span key={i} className="loading-dot w-2 h-2 rounded-full bg-indigo-400" />
      ))}
    </div>
  )
}

function StreamLog({ lines }) {
  if (!lines.length) return null
  return (
    <div className="mt-2 space-y-0.5 font-mono text-xs">
      {lines.map((line, i) => (
        <div key={i} className="agent-stream-line text-slate-400 leading-relaxed">
          {line.trim() ? (
            <span className={
              line.includes('successfully') ? 'text-emerald-400' :
              line.includes('...') || line.includes('ing') ? 'text-indigo-300' :
              'text-slate-400'
            }>
              {'▸ '}{line}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default function ChatPanel({ sandboxId }) {
  const [messages, setMessages]     = useState([
    {
      role: 'assistant',
      content: "👋 Hey! I'm your AI coding assistant. Describe what you'd like to build or modify, and I'll update the code directly in your sandbox.",
      streamLines: [],
    }
  ])
  const [input, setInput]           = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef                   = useRef(null)
  const textareaRef                 = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text || isStreaming) return

    setInput('')
    setIsStreaming(true)

    const userMsg = { role: 'user', content: text, streamLines: [] }
    const asstMsg = { role: 'assistant', content: '', streamLines: [], loading: true }

    setMessages(prev => [...prev, userMsg, asstMsg])

    try {
      const res = await fetch('/api/ai/agent/invoke', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: text, projectId: sandboxId }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let   buffer  = ''
      const streamLines = []

      let lastUpdateTime = 0
      let fullText = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        let addedLines = false
        for (const raw of lines) {
          const line = raw.trim()
          if (!line) continue
          // Strip SSE prefix if present
          const text = line.startsWith('data:') ? line.slice(5).trim() : line
          if (text) {
            // Check if it's a JSON string (like tool calls)
            if (text.startsWith('{') || text.startsWith('[')) {
               try {
                 const parsed = JSON.parse(text)
                 if (parsed.log) streamLines.push(parsed.log)
               } catch(e) {
                 fullText += text
               }
            } else {
               fullText += text
            }
            addedLines = true
          }
        }

        // Throttle React state updates to 20fps to prevent massive lag
        const now = Date.now()
        if (addedLines && (now - lastUpdateTime > 50)) {
          lastUpdateTime = now
          setMessages(prev => {
            const copy = [...prev]
            const last = { ...copy[copy.length - 1] }
            last.content = fullText
            last.streamLines = [...streamLines]
            last.loading = true
            copy[copy.length - 1] = last
            return copy
          })
        }
      }

      // Finalize
      setMessages(prev => {
        const copy = [...prev]
        const last = { ...copy[copy.length - 1] }
        last.loading = false
        last.content = fullText || '✅ Done! The sandbox files have been updated. Check the preview panel to see your changes.'
        last.streamLines = streamLines
        copy[copy.length - 1] = last
        return copy
      })
    } catch (err) {
      setMessages(prev => {
        const copy = [...prev]
        const last = { ...copy[copy.length - 1] }
        last.loading = false
        last.content = `❌ Error: ${err.message}`
        last.streamLines = []
        copy[copy.length - 1] = last
        return copy
      })
    } finally {
      setIsStreaming(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0c0c18]">

      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/5">
        <BotIcon />
        <div>
          <p className="text-sm font-semibold text-slate-100">AI Assistant</p>
          <p className="text-[11px] text-slate-500">Powered by Gemini</p>
        </div>
        {isStreaming && (
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[11px] text-indigo-300 font-medium">Working…</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scroll px-4 py-4 space-y-5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {msg.role === 'user' ? <UserIcon /> : <BotIcon />}
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'chat-bubble-user text-white rounded-tr-sm'
                  : 'chat-bubble-ai text-slate-200 rounded-tl-sm'
              }`}>
                {/* Always show content if it exists */}
                {msg.content && <div>{msg.content}</div>}
                
                {/* Show initial loading dots only if nothing has arrived yet */}
                {msg.loading && !msg.content && !msg.streamLines?.length && (
                  <LoadingDots />
                )}

                {/* Show stream logs if any exist */}
                {msg.streamLines && msg.streamLines.length > 0 && (
                  <StreamLog lines={msg.streamLines} />
                )}
                
                {/* Show trailing loading dots if we're still streaming but already have some content/logs */}
                {msg.loading && (msg.content || msg.streamLines?.length > 0) && (
                  <div className="mt-2 opacity-50"><LoadingDots /></div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-end gap-2 bg-[#13131f] border border-white/10 rounded-xl px-3 py-2 focus-within:border-indigo-500/50 transition-colors">
          <textarea
            ref={textareaRef}
            id="chat-input"
            rows={1}
            value={input}
            onChange={e => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build…"
            disabled={isStreaming}
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 resize-none outline-none min-h-[24px] max-h-[120px] leading-6 custom-scroll disabled:opacity-50"
          />
          <button
            id="send-chat-btn"
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-slate-600 text-center mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
