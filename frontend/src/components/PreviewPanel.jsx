import { useState, useRef } from 'react'

export default function PreviewPanel({ previewURL, sandboxId }) {
  const iframeRef      = useRef(null)
  const [loading, setLoading]  = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  function refresh() {
    setLoading(true)
    setRefreshKey(k => k + 1)
  }

  return (
    <div className="flex flex-col h-full bg-[#0c0c18]">
      {/* Browser-chrome toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 flex-shrink-0">
        {/* Traffic lights */}
        <div className="flex gap-1.5 mr-1">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>

        {/* URL bar */}
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0f] border border-white/8 rounded-lg text-xs font-mono text-slate-500 overflow-hidden">
          {/* Lock icon */}
          <svg className="w-3 h-3 flex-shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="truncate">{previewURL || 'Loading preview…'}</span>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        )}

        {/* Refresh */}
        <button
          id="preview-refresh-btn"
          onClick={refresh}
          title="Refresh preview"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Open in new tab */}
        <a
          href={previewURL}
          target="_blank"
          rel="noopener noreferrer"
          id="preview-open-tab-btn"
          title="Open in new tab"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* iFrame */}
      <div className="flex-1 relative overflow-hidden">
        {previewURL ? (
          <iframe
            key={refreshKey}
            ref={iframeRef}
            src={previewURL}
            id="preview-iframe"
            title="Sandbox Preview"
            className="w-full h-full border-0 bg-white"
            onLoad={() => setLoading(false)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-600">
            <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
            </svg>
            <p className="text-sm">No preview URL</p>
          </div>
        )}

        {/* Loading overlay */}
        {loading && previewURL && (
          <div className="absolute inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center gap-4 animate-fade-in">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-indigo-500/20 rounded-full" />
              <div className="absolute inset-0 w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-sm text-slate-500">Loading preview…</p>
          </div>
        )}
      </div>
    </div>
  )
}
