import { useState, useEffect, useCallback } from 'react'

// ── File type icon map ────────────────────────────────────────────────────────
function getFileIcon(filename) {
  const ext = filename.split('.').pop()?.toLowerCase()
  const base = filename.split('/').pop()?.toLowerCase()

  if (base === 'package.json' || base === 'package-lock.json') return { icon: '📦', color: 'text-yellow-400' }
  if (base === 'dockerfile') return { icon: '🐳', color: 'text-blue-400' }
  if (base === 'readme.md') return { icon: '📖', color: 'text-slate-400' }
  if (base === 'vite.config.js' || base === 'vite.config.ts') return { icon: '⚡', color: 'text-violet-400' }
  if (base === '.gitignore' || base === '.dockerignore') return { icon: '🚫', color: 'text-slate-500' }

  const map = {
    jsx:   { icon: <JSXIcon />,  color: 'text-cyan-400' },
    tsx:   { icon: <TSXIcon />,  color: 'text-blue-400' },
    js:    { icon: <JSIcon />,   color: 'text-yellow-300' },
    ts:    { icon: <TSIcon />,   color: 'text-blue-400' },
    css:   { icon: <CSSIcon />,  color: 'text-pink-400' },
    html:  { icon: <HTMLIcon />, color: 'text-orange-400' },
    json:  { icon: '{}',         color: 'text-yellow-400' },
    md:    { icon: '📝',         color: 'text-slate-400' },
    svg:   { icon: '🎨',         color: 'text-emerald-400' },
    png:   { icon: '🖼',         color: 'text-pink-300' },
    jpg:   { icon: '🖼',         color: 'text-pink-300' },
    gif:   { icon: '🖼',         color: 'text-pink-300' },
    yml:   { icon: '⚙️',         color: 'text-slate-400' },
    yaml:  { icon: '⚙️',         color: 'text-slate-400' },
  }
  return map[ext] || { icon: '📄', color: 'text-slate-500' }
}

function JSXIcon() {
  return (
    <span className="text-[9px] font-bold font-mono leading-none px-0.5 py-0 rounded bg-cyan-500/20 text-cyan-400">JSX</span>
  )
}
function TSXIcon() {
  return <span className="text-[9px] font-bold font-mono leading-none px-0.5 py-0 rounded bg-blue-500/20 text-blue-400">TSX</span>
}
function JSIcon() {
  return <span className="text-[9px] font-bold font-mono leading-none px-0.5 py-0 rounded bg-yellow-500/20 text-yellow-300">JS</span>
}
function TSIcon() {
  return <span className="text-[9px] font-bold font-mono leading-none px-0.5 py-0 rounded bg-blue-500/20 text-blue-400">TS</span>
}
function CSSIcon() {
  return <span className="text-[9px] font-bold font-mono leading-none px-0.5 py-0 rounded bg-pink-500/20 text-pink-400">CSS</span>
}
function HTMLIcon() {
  return <span className="text-[9px] font-bold font-mono leading-none px-0.5 py-0 rounded bg-orange-500/20 text-orange-400">HTML</span>
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="px-3 py-2 space-y-2">
      {[100, 80, 90, 70, 85, 60, 75].map((w, i) => (
        <div
          key={i}
          className="h-4 rounded skeleton-shimmer"
          style={{ width: `${w}%`, animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </div>
  )
}

// ── Code viewer modal ─────────────────────────────────────────────────────────
function CodeViewer({ file, content, onClose }) {
  const lines = content.split('\n')
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[80vh] rounded-2xl border border-white/10 bg-[#0c0c18] flex flex-col shadow-2xl animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 flex-shrink-0">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs font-mono text-slate-400 flex-1 truncate">{file}</span>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Code body */}
        <div className="overflow-auto custom-scroll flex-1 p-4">
          <table className="w-full text-xs font-mono leading-5">
            <tbody>
              {lines.map((line, i) => (
                <tr key={i} className="hover:bg-white/[0.02] group">
                  <td className="select-none text-right pr-4 text-slate-600 group-hover:text-slate-500 w-8 flex-shrink-0 align-top">
                    {i + 1}
                  </td>
                  <td className="text-slate-300 whitespace-pre break-all align-top">{line || ' '}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center px-4 py-2 border-t border-white/5 text-[10px] text-slate-600 flex-shrink-0">
          <span>{lines.length} lines</span>
          <span className="mx-2">·</span>
          <span>{content.length} bytes</span>
          <span className="ml-auto text-indigo-400/60">read-only</span>
        </div>
      </div>
    </div>
  )
}

// ── Build tree structure from flat file list ──────────────────────────────────
function buildTree(files) {
  const root = {}
  for (const file of files) {
    const parts = file.split('/')
    let node = root
    for (let i = 0; i < parts.length - 1; i++) {
      const dir = parts[i]
      if (!node[dir]) node[dir] = { __isDir: true, __children: {} }
      node = node[dir].__children
    }
    const name = parts[parts.length - 1]
    node[name] = { __isDir: false, __path: file }
  }
  return root
}

// ── Tree node renderer ────────────────────────────────────────────────────────
function TreeNode({ name, node, depth, onFileClick, loadingFile }) {
  const [open, setOpen] = useState(depth < 2)

  if (node.__isDir) {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors group"
          style={{ paddingLeft: `${8 + depth * 12}px` }}
        >
          <svg
            className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''} text-slate-600`}
            fill="currentColor" viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M7.293 4.707a1 1 0 010 1.414L3.414 10l3.879 3.879a1 1 0 01-1.414 1.414l-4.586-4.586a1 1 0 010-1.414L5.879 4.707a1 1 0 011.414 0z" clipRule="evenodd" transform="rotate(90 10 10)" />
          </svg>
          <svg className={`w-3.5 h-3.5 flex-shrink-0 ${open ? 'text-indigo-400' : 'text-slate-500'}`} fill="currentColor" viewBox="0 0 20 20">
            {open
              ? <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              : <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
            }
          </svg>
          <span className="text-xs truncate">{name}</span>
        </button>
        {open && (
          <div>
            {Object.entries(node.__children)
              .sort(([,a],[,b]) => {
                if (a.__isDir && !b.__isDir) return -1
                if (!a.__isDir && b.__isDir) return 1
                return 0
              })
              .map(([childName, childNode]) => (
                <TreeNode
                  key={childName}
                  name={childName}
                  node={childNode}
                  depth={depth + 1}
                  onFileClick={onFileClick}
                  loadingFile={loadingFile}
                />
              ))
            }
          </div>
        )}
      </div>
    )
  }

  // File node
  const { icon, color } = getFileIcon(name)
  const isLoading = loadingFile === node.__path

  return (
    <button
      onClick={() => onFileClick(node.__path)}
      className="w-full flex items-center gap-2 px-2 py-0.5 rounded hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors group"
      style={{ paddingLeft: `${8 + depth * 12}px` }}
    >
      {isLoading ? (
        <span className="w-3 h-3 rounded-full border border-indigo-400 border-t-transparent animate-spin flex-shrink-0" />
      ) : (
        <span className={`flex-shrink-0 flex items-center ${color} text-[11px] leading-none`}>{icon}</span>
      )}
      <span className="text-xs truncate flex-1 text-left group-hover:text-slate-100">{name}</span>
    </button>
  )
}

// ── Main FilesSidebar ─────────────────────────────────────────────────────────
export default function FilesSidebar({ sandboxId }) {
  const [files, setFiles]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [search, setSearch]     = useState('')
  const [viewer, setViewer]     = useState(null)   // { file, content }
  const [loadingFile, setLoadingFile] = useState(null)

  const agentBase = `http://${sandboxId}.agent.localhost`

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${agentBase}/list-files`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setFiles(data.files || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [agentBase])

  useEffect(() => { fetchFiles() }, [fetchFiles])

  async function handleFileClick(filePath) {
    setLoadingFile(filePath)
    try {
      const res = await fetch(`${agentBase}/read-file?files=${encodeURIComponent(filePath)}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      // The API returns { files: [{ "/path": "content" }] }
      const fileEntry = data.files?.[0]
      if (fileEntry) {
        const content = Object.values(fileEntry)[0]
        if (typeof content === 'string' && !content.startsWith('Eror') && !content.startsWith('Error')) {
          setViewer({ file: filePath, content })
        }
      }
    } catch (e) {
      // silently fail for binary files
    } finally {
      setLoadingFile(null)
    }
  }

  const filtered = search
    ? files.filter(f => f.toLowerCase().includes(search.toLowerCase()))
    : files

  const tree = buildTree(filtered)

  const fileCount = files.length

  return (
    <>
      <div className="flex flex-col h-full bg-[#0c0c18] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h5.586a1 1 0 01.707.293L13 7h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Explorer</span>
          </div>
          <div className="flex items-center gap-1">
            {!loading && (
              <span className="text-[10px] text-slate-600">{fileCount} files</span>
            )}
            <button
              onClick={fetchFiles}
              title="Refresh files"
              disabled={loading}
              className="p-1 rounded text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors disabled:opacity-30"
            >
              <svg className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-2 py-1.5 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5 focus-within:border-indigo-500/30 transition-colors">
            <svg className="w-3 h-3 text-slate-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="file-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search files…"
              className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-600 outline-none min-w-0"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-600 hover:text-slate-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* File tree */}
        <div className="flex-1 overflow-y-auto custom-scroll py-1">
          {loading ? (
            <Skeleton />
          ) : error ? (
            <div className="px-3 py-4 text-center">
              <p className="text-xs text-red-400 mb-2">{error}</p>
              <button
                onClick={fetchFiles}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-6">
              {search ? 'No matching files' : 'No files found'}
            </p>
          ) : (
            <div className="px-1">
              {Object.entries(tree)
                .sort(([,a],[,b]) => {
                  if (a.__isDir && !b.__isDir) return -1
                  if (!a.__isDir && b.__isDir) return 1
                  return 0
                })
                .map(([name, node]) => (
                  <TreeNode
                    key={name}
                    name={name}
                    node={node}
                    depth={0}
                    onFileClick={handleFileClick}
                    loadingFile={loadingFile}
                  />
                ))
              }
            </div>
          )}
        </div>
      </div>

      {/* Code viewer modal */}
      {viewer && (
        <CodeViewer
          file={viewer.file}
          content={viewer.content}
          onClose={() => setViewer(null)}
        />
      )}
    </>
  )
}
