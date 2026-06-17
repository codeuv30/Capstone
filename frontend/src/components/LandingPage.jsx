import { useState } from 'react'

const FEATURES = [
  { icon: '⚡', label: 'Instant sandbox' },
  { icon: '🤖', label: 'AI code gen' },
  { icon: '🖥',  label: 'Live preview' },
  { icon: '💻', label: 'Full terminal' },
  { icon: '📁', label: 'File explorer' },
]

export default function LandingPage({ onSandboxCreated }) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function createSandbox() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/sandbox/start', { method: 'POST' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      onSandboxCreated({
        sandboxId:  data.sandboxId,
        previewURL: data.previewURL,
      })
    } catch (e) {
      setError(e.message || 'Failed to create sandbox')
      setLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen overflow-hidden bg-[#070710]">

      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(99,102,241,0.35) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Radial vignette over grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, #070710 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 animate-slide-up text-center px-6">

        {/* Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          AI-Powered Sandbox IDE
        </div>

        {/* Headline */}
        <div>
          <h1 className="text-6xl font-bold tracking-tight mb-4 leading-tight">
            <span className="gradient-text">Build.</span>{' '}
            <span className="text-white">Preview.</span>{' '}
            <span className="gradient-text">Ship.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
            Spin up an isolated dev environment and build your frontend with AI —
            chat, explore files, preview, and iterate in real time.
          </p>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap justify-center gap-2.5 text-sm text-slate-500 max-w-md">
          {FEATURES.map(f => (
            <span
              key={f.label}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] text-slate-400 text-xs"
            >
              <span>{f.icon}</span>
              {f.label}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <div className="relative">
          {/* Pulse rings while loading */}
          {loading && (
            <>
              <span className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping" />
              <span className="absolute inset-0 scale-110 rounded-2xl bg-indigo-500/10 animate-ping" style={{ animationDelay: '0.3s' }} />
            </>
          )}

          <button
            id="create-sandbox-btn"
            onClick={createSandbox}
            disabled={loading}
            className={`
              relative z-10 flex items-center gap-3 px-10 py-4 rounded-2xl
              text-white font-semibold text-lg
              transition-all duration-300 select-none overflow-hidden
              ${loading
                ? 'bg-indigo-700/60 cursor-wait scale-95'
                : 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_100%] hover:bg-right-center hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-95 cursor-pointer'
              }
            `}
          >
            {/* Shimmer overlay */}
            {!loading && (
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer-btn 2.5s infinite',
                }}
              />
            )}

            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Creating Sandbox…
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Launch Sandbox
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
      </div>

      {/* Bottom hint */}
      <p className="absolute bottom-8 text-slate-600 text-xs">
        Isolated environment · Powered by Docker · Instant HMR
      </p>
    </div>
  )
}
