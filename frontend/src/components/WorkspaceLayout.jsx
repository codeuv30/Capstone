import { useState, useRef, useCallback } from 'react'
import ChatPanel     from './ChatPanel'
import TerminalPanel from './TerminalPanel'
import PreviewPanel  from './PreviewPanel'
import FilesSidebar  from './FilesSidebar'

// ── Left-edge drag (dragging right = wider) ───────────────────────────────────
function useHorizDrag(initial, min, max) {
  const [size, setSize] = useState(initial)
  const dragging = useRef(false)

  const onMouseDown = useCallback((e) => {
    e.preventDefault()
    dragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    function onMove(ev) {
      if (!dragging.current) return
      setSize(s => Math.max(min, Math.min(max, s + ev.movementX)))
    }
    function onUp() {
      dragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [min, max])

  return [size, onMouseDown]
}

// ── Right-edge drag (dragging left = wider) ───────────────────────────────────
function useInvertedHorizDrag(initial, min, max) {
  const [size, setSize] = useState(initial)
  const dragging = useRef(false)

  const onMouseDown = useCallback((e) => {
    e.preventDefault()
    dragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    function onMove(ev) {
      if (!dragging.current) return
      setSize(s => Math.max(min, Math.min(max, s - ev.movementX)))
    }
    function onUp() {
      dragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [min, max])

  return [size, onMouseDown]
}

// ── Vertical drag (dragging up = taller terminal) ─────────────────────────────
function useVertDrag(initial, min, max) {
  const [size, setSize] = useState(initial)
  const dragging = useRef(false)

  const onMouseDown = useCallback((e) => {
    e.preventDefault()
    dragging.current = true
    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'

    function onMove(ev) {
      if (!dragging.current) return
      setSize(s => Math.max(min, Math.min(max, s - ev.movementY)))
    }
    function onUp() {
      dragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [min, max])

  return [size, onMouseDown]
}

// ── Activity Bar ──────────────────────────────────────────────────────────────
function ActivityBar({ active, onChange }) {
  const items = [
    {
      id: 'files',
      label: 'Explorer',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7a2 2 0 012-2h5.586a1 1 0 01.707.293L13 7h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
        </svg>
      ),
    },
    {
      id: 'chat',
      label: 'AI Chat',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="flex flex-col items-center gap-1 py-3 w-12 bg-[#08080f] border-r border-white/5 flex-shrink-0">
      {/* Logo mark */}
      <div className="w-8 h-8 mb-3 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg flex-shrink-0">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>

      {items.map(item => (
        <button
          key={item.id}
          id={`activity-${item.id}`}
          title={item.label}
          onClick={() => onChange(item.id === active ? null : item.id)}
          className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all group ${
            active === item.id
              ? 'bg-indigo-500/20 text-indigo-400'
              : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'
          }`}
        >
          {active === item.id && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-indigo-400" />
          )}
          <div className="w-5 h-5">{item.icon}</div>
          {/* Tooltip */}
          <span className="absolute left-11 px-2 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl border border-white/10">
            {item.label}
          </span>
        </button>
      ))}

      {/* Bottom: settings */}
      <div className="mt-auto">
        <button
          title="Settings"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 hover:text-slate-400 hover:bg-white/5 transition-all group relative"
        >
          <div className="w-5 h-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </div>
          <span className="absolute left-11 px-2 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl border border-white/10">
            Settings
          </span>
        </button>
      </div>
    </div>
  )
}

// ── Status Bar ────────────────────────────────────────────────────────────────
function StatusBar({ sandboxId }) {
  return (
    <div className="flex items-center gap-4 px-4 py-1 bg-indigo-600 text-indigo-100 text-[11px] flex-shrink-0 select-none">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
        <span>Sandbox Active</span>
      </div>
      <span className="text-indigo-400">·</span>
      <span className="font-mono text-indigo-200 truncate max-w-[240px]">{sandboxId}</span>
      <div className="ml-auto flex items-center gap-3 text-indigo-300">
        <span>React + Vite</span>
        <span>·</span>
        <span>HMR Enabled</span>
      </div>
    </div>
  )
}

// ── Main Workspace ────────────────────────────────────────────────────────────
export default function WorkspaceLayout({ sandbox }) {
  const { sandboxId, previewURL } = sandbox

  // 'files' | 'chat' | null  (null = left sidebar collapsed)
  const [activePanel, setActivePanel] = useState('files')
  // 'both' | 'preview' | 'terminal'
  const [centerMode,  setCenterMode]  = useState('both')

  const [leftWidth,  onLeftResize]  = useHorizDrag(240, 160, 480)
  const [chatWidth,  onChatResize]  = useInvertedHorizDrag(340, 260, 560)
  const [termHeight, onTermResize]  = useVertDrag(220, 100, 520)

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0a0f]">

      {/* ── Header ── */}
      <header className="flex items-center gap-3 px-4 py-2.5 bg-[#08080f] border-b border-white/5 flex-shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-200">DevSandbox</span>
        </div>

        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Sandbox ID pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/[0.08] rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-400">{sandboxId.slice(0, 8)}…</span>
        </div>

        {/* Center-mode switcher */}
        <div className="flex items-center gap-1 ml-4 bg-white/5 border border-white/[0.08] rounded-lg p-0.5">
          {[
            { id: 'both',     label: 'Split' },
            { id: 'preview',  label: 'Preview' },
            { id: 'terminal', label: 'Terminal' },
          ].map(m => (
            <button
              key={m.id}
              id={`view-mode-${m.id}`}
              onClick={() => setCenterMode(m.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                centerMode === m.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={previewURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/[0.08] text-[11px] text-slate-400 hover:text-slate-200 hover:bg-white/8 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open in tab
          </a>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* Activity bar */}
        <ActivityBar active={activePanel} onChange={setActivePanel} />

        {/* ── Left sidebar (Files or Chat via activity bar) ── */}
        {activePanel !== null && (
          <>
            <div
              style={{ width: leftWidth, minWidth: 160, maxWidth: 480 }}
              className="flex-shrink-0 flex flex-col overflow-hidden border-r border-white/5"
            >
              {activePanel === 'files' && <FilesSidebar sandboxId={sandboxId} />}
              {activePanel === 'chat'  && <ChatPanel    sandboxId={sandboxId} />}
            </div>

            {/* Left resize handle */}
            <div
              className="resize-handle w-1 bg-white/[0.03] hover:bg-indigo-500/40 transition-colors flex-shrink-0"
              onMouseDown={onLeftResize}
            />
          </>
        )}

        {/* ── Center: Preview (top) + Terminal (bottom) ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Preview */}
          <div
            className={`${centerMode === 'terminal' ? 'hidden' : 'flex'} flex-col overflow-hidden min-h-0`}
            style={{
              flex: centerMode === 'both' ? `1 1 auto` : '1 1 100%',
              minHeight: centerMode === 'both' ? 80 : undefined,
            }}
          >
            <PreviewPanel previewURL={previewURL} sandboxId={sandboxId} />
          </div>

          {/* Vertical drag handle */}
          {centerMode === 'both' && (
            <div
              className="flex-shrink-0 h-[5px] bg-white/[0.02] hover:bg-indigo-500/30 transition-colors cursor-row-resize group flex items-center justify-center"
              onMouseDown={onTermResize}
            >
              <div className="w-10 h-0.5 rounded-full bg-white/10 group-hover:bg-indigo-400/60 transition-colors" />
            </div>
          )}

          {/* Terminal */}
          <div
            className={`${centerMode === 'preview' ? 'hidden' : 'flex'} flex-col overflow-hidden flex-shrink-0`}
            style={
              centerMode === 'both'
                ? { height: termHeight, minHeight: 100 }
                : { flex: '1 1 100%' }
            }
          >
            <TerminalPanel sandboxId={sandboxId} />
          </div>
        </div>

        {/* ── Right resize handle (for chat panel) ── */}
        <div
          className="resize-handle w-1 bg-white/[0.03] hover:bg-indigo-500/40 transition-colors flex-shrink-0"
          onMouseDown={onChatResize}
        />

        {/* ── Chat Panel (always on right) ── */}
        <div
          style={{ width: chatWidth, minWidth: 260, maxWidth: 560 }}
          className="flex-shrink-0 flex flex-col overflow-hidden border-l border-white/5"
        >
          <ChatPanel sandboxId={sandboxId} />
        </div>

      </div>

      {/* ── Status bar ── */}
      <StatusBar sandboxId={sandboxId} />
    </div>
  )
}
