'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, BrainCircuit, Check, ChevronDown, CircleHelp,
  Clock3, Command, Download, Globe2, History, LayoutGrid, LockKeyhole, Menu, MonitorDown,
  MoreHorizontal, Plus, RefreshCw, Search, Send, Settings2, ShieldCheck, Sparkles, Star,
  UserRound, WifiOff, X, Zap,
} from 'lucide-react'

type Tab = {
  id: number
  title: string
  url: string
  saved?: boolean
}

type Activity = {
  title: string
  url: string
  time: string
  color: string
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const shortcuts = [
  { label: 'Figma', url: 'figma.com', color: 'bg-indigo-500', mark: 'F' },
  { label: 'Linear', url: 'linear.app', color: 'bg-violet-500', mark: 'L' },
  { label: 'Notion', url: 'notion.so', color: 'bg-slate-700', mark: 'N' },
  { label: 'GitHub', url: 'github.com', color: 'bg-slate-900', mark: 'G' },
]

const starterActivity: Activity[] = [
  { title: 'The future of calm technology', url: 'nesslabs.com', time: '12 min ago', color: 'bg-cyan-400' },
  { title: 'Enosx design system', url: 'figma.com', time: 'Yesterday', color: 'bg-violet-400' },
  { title: 'Ambient — a focus playlist', url: 'music.youtube.com', time: 'Yesterday', color: 'bg-rose-400' },
]

const aiQuickActions = ['Summarize page', 'Explain selection', 'Rewrite clearly', 'Compare tabs']

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) as T : fallback
  } catch {
    return fallback
  }
}

export default function Page() {
  const [query, setQuery] = useState('')
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, title: 'New tab', url: 'enosh://newtab' },
    { id: 2, title: 'Design research', url: 'figma.com' },
    { id: 3, title: 'Focus playlist', url: 'music.youtube.com' },
  ])
  const [activeTab, setActiveTab] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [aiOpen, setAiOpen] = useState(false)
  const [privateMode, setPrivateMode] = useState(false)
  const [permission, setPermission] = useState('Selected text only')
  const [aiMode, setAiMode] = useState('Local AI')
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiMessage, setAiMessage] = useState('')
  const [activePanel, setActivePanel] = useState<'newtab' | 'bookmarks' | 'reading' | 'history'>('newtab')
  const [online, setOnline] = useState(true)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [bookmarks, setBookmarks] = useState<Activity[]>(() => readStored('enosh-bookmarks', []))
  const [readingList, setReadingList] = useState<Activity[]>(() => readStored('enosh-reading-list', []))
  const [activity, setActivity] = useState<Activity[]>(() => readStored('enosh-history', starterActivity))
  const [toast, setToast] = useState('')
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0]
  const isBookmarked = Boolean(currentTab && bookmarks.some((item) => item.url === currentTab.url))

  useEffect(() => {
    setOnline(navigator.onLine)
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    const onInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    }
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    window.addEventListener('beforeinstallprompt', onInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches)
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => undefined)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('beforeinstallprompt', onInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('enosh-bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  useEffect(() => {
    window.localStorage.setItem('enosh-reading-list', JSON.stringify(readingList))
  }, [readingList])

  useEffect(() => {
    window.localStorage.setItem('enosh-history', JSON.stringify(activity))
  }, [activity])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const pageGreeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  function addTab() {
    const id = Date.now()
    setTabs((current) => [...current, { id, title: 'New tab', url: 'enosh://newtab' }])
    setActiveTab(id)
    setActivePanel('newtab')
  }

  function closeTab(id: number) {
    setTabs((current) => {
      if (current.length === 1) return current
      const next = current.filter((tab) => tab.id !== id)
      if (id === activeTab) setActiveTab(next[Math.max(0, next.length - 1)].id)
      return next
    })
  }

  function navigate(rawValue: string) {
    const value = rawValue.trim()
    if (!value) return
    const looksLikeUrl = /^(https?:\/\/|[\w-]+\.[\w-]+)/i.test(value)
    const url = looksLikeUrl ? (value.startsWith('http') ? value : `https://${value}`) : `https://www.google.com/search?q=${encodeURIComponent(value)}`
    const title = looksLikeUrl ? value.replace(/^https?:\/\//, '').split('/')[0] : value
    setTabs((current) => current.map((tab) => tab.id === activeTab ? { ...tab, title: title.slice(0, 28), url } : tab))
    setQuery('')
    setActivePanel('newtab')
    const item: Activity = { title: title.slice(0, 48), url: url.replace(/^https?:\/\//, ''), time: 'Just now', color: 'bg-primary' }
    setActivity((current) => [item, ...current.filter((entry) => entry.url !== item.url)].slice(0, 8))
    setToast(online ? `Opened ${title}` : 'Offline mode: saved locally for later')
    if (online && !value.startsWith('enosh://')) window.open(url, '_blank', 'noopener,noreferrer')
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(query)
  }

  function handleBack() {
    if (window.history.length > 1) window.history.back()
    else setToast('No previous page in this session')
  }

  function handleForward() {
    window.history.forward()
    setToast('Forward navigation requested')
  }

  function toggleBookmark() {
    if (!currentTab) return
    const item: Activity = { title: currentTab.title, url: currentTab.url, time: 'Saved now', color: 'bg-primary' }
    setBookmarks((current) => isBookmarked ? current.filter((entry) => entry.url !== item.url) : [item, ...current])
    setToast(isBookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks')
  }

  function saveReadingItem(item: Activity) {
    setReadingList((current) => current.some((entry) => entry.url === item.url) ? current : [item, ...current])
    setToast('Saved to reading list')
  }

  function openActivity(item: Activity) {
    navigate(item.url)
  }

  function askEnosh(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!aiPrompt.trim() || aiMode === 'No AI') return
    const prompt = aiPrompt.trim()
    const modeCopy = aiMode === 'Local AI' ? 'your device' : aiMode.toLowerCase()
    setAiMessage(`Enosx AI is ready to ${prompt.toLowerCase()} using ${permission.toLowerCase()} in ${modeCopy}. This offline-safe demo keeps the request local until you connect a model.`)
    setAiPrompt('')
  }

  function chooseQuickAction(action: string) {
    setAiPrompt(action)
    setAiOpen(true)
  }

  async function installApp() {
    if (installPrompt) {
      await installPrompt.prompt()
      const result = await installPrompt.userChoice
      if (result.outcome === 'accepted') setToast('Enosx Browser was added to your apps')
      setInstallPrompt(null)
      return
    }
    setToast(isInstalled ? 'Enosx Browser is already installed' : 'Use your browser menu and choose Install Enosx Browser')
  }

  const panelItems = [
    { id: 'newtab' as const, label: 'New tab', icon: Sparkles },
    { id: 'bookmarks' as const, label: 'Bookmarks', icon: Bookmark },
    { id: 'reading' as const, label: 'Reading list', icon: Star },
    { id: 'history' as const, label: 'History', icon: History },
  ]

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="app-shell flex min-h-screen flex-col">
        <header className="browser-chrome border-b border-border/70 bg-card/70 backdrop-blur-xl">
          <div className="flex h-11 items-center gap-2 px-3">
            <button className="brand-mark mr-2 flex size-6 shrink-0 items-center justify-center rounded-md" aria-label="Enosh home" onClick={() => { setActivePanel('newtab'); setActiveTab(tabs[0].id) }}><span className="brand-mark-inner" /></button>
            <nav className="flex min-w-0 flex-1 items-end gap-1 self-stretch" aria-label="Browser tabs">
              {tabs.map((tab) => <button key={tab.id} onClick={() => { setActiveTab(tab.id); setActivePanel('newtab') }} className={`tab group flex h-8 min-w-0 max-w-56 items-center gap-2 rounded-t-lg px-3 text-left text-xs ${tab.id === activeTab ? 'tab-active text-foreground' : 'text-muted-foreground hover:bg-accent/60'}`}><Globe2 className="size-3.5 shrink-0 text-primary" /><span className="truncate">{tab.title}</span><span role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); closeTab(tab.id) }} className="ml-auto rounded p-0.5 opacity-0 group-hover:opacity-100 hover:bg-muted" aria-label={`Close ${tab.title}`}><X className="size-3" /></span></button>)}
              <button className="mb-1 ml-1 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="New tab" onClick={addTab}><Plus className="size-4" /></button>
            </nav>
            <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Toggle sidebar" onClick={() => setSidebarOpen((open) => !open)}><Menu className="size-4" /></button>
          </div>
          <div className="flex h-12 items-center gap-2 px-3">
            <div className="flex items-center gap-0.5 text-muted-foreground"><button onClick={handleBack} className="rounded-md p-2 hover:bg-accent hover:text-foreground" aria-label="Back"><ArrowLeft className="size-4" /></button><button onClick={handleForward} className="rounded-md p-2 hover:bg-accent hover:text-foreground" aria-label="Forward"><ArrowRight className="size-4" /></button><button onClick={() => window.location.reload()} className="rounded-md p-2 hover:bg-accent hover:text-foreground" aria-label="Reload"><RefreshCw className="size-4" /></button></div>
            <form onSubmit={submitSearch} className="address-bar flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2"><LockKeyhole className="size-3.5 shrink-0 text-primary" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder={currentTab?.url ?? 'Search or enter address'} aria-label="Address and search" /><Command className="hidden size-3.5 text-muted-foreground sm:block" /><span className="hidden text-[10px] text-muted-foreground sm:block">K</span></form>
            <button className={`rounded-md p-2 ${privateMode ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} aria-label="Toggle private mode" onClick={() => { setPrivateMode((mode) => !mode); setToast(privateMode ? 'Private mode disabled' : 'Private mode enabled') }}><ShieldCheck className="size-4" /></button>
            <button className={`rounded-md p-2 ${aiOpen ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} aria-label="Open Enosh AI" onClick={() => setAiOpen((open) => !open)}><BrainCircuit className="size-4" /></button>
            <button className={`rounded-md p-2 ${isBookmarked ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} aria-label="Bookmark current page" onClick={toggleBookmark}>{isBookmarked ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}</button>
            <button className="flex size-8 items-center justify-center rounded-full border border-border/70 bg-accent text-muted-foreground hover:text-foreground" aria-label="Profile"><UserRound className="size-4" /></button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <aside className={`${sidebarOpen ? 'w-60 p-4' : 'w-0 p-0'} hidden shrink-0 overflow-hidden border-r border-border/60 bg-sidebar/50 transition-all duration-300 lg:block`} aria-label="Browser sidebar"><div className="flex min-w-52 flex-col gap-6"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Workspace</p><p className="mt-1 text-sm font-medium">Personal space</p></div><ChevronDown className="size-4 text-muted-foreground" /></div><div className="flex flex-col gap-1">{panelItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setActivePanel(id)} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${activePanel === id ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'}`}><span className="text-primary"><Icon className="size-4" /></span>{label}<span className="ml-auto text-[10px] text-muted-foreground">{id === 'bookmarks' ? bookmarks.length : id === 'reading' ? readingList.length : id === 'history' ? activity.length : ''}</span></button>)}</div><div className="border-t border-border/60 pt-5"><p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Spaces</p><button onClick={() => setToast('Deep work space selected')} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground"><span className="size-2 rounded-full bg-cyan-400" />Deep work</button><button onClick={() => setToast('Inspiration space selected')} className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground"><span className="size-2 rounded-full bg-violet-400" />Inspiration</button></div><div className="mt-auto rounded-xl border border-primary/20 bg-primary/5 p-3"><div className="mb-2 flex items-center gap-2 text-primary"><Zap className="size-3.5" /><span className="font-mono text-[10px] uppercase tracking-wider">Enosh shield</span></div><p className="text-xs leading-relaxed text-muted-foreground">Private by design. 1,284 trackers blocked this week.</p><button onClick={() => setToast('Protection report is stored locally in this offline build')} className="mt-3 text-xs font-medium text-primary hover:underline">View protection report</button></div></div></aside>

          <section className="relative min-w-0 flex-1 overflow-auto"><div className="ambient-grid pointer-events-none absolute inset-0 opacity-60" /><div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 py-10 sm:px-10 lg:px-16 lg:py-16">
            <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">{pageGreeting}, Alex</p><h1 className="mt-3 max-w-2xl text-balance text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl">Make space for <span className="text-primary">what matters.</span></h1><p className="mt-4 max-w-xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base">A quieter, faster way to explore the web. Enosx works offline and keeps your browser state on this device.</p></div><div className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs sm:flex ${online ? 'border-primary/20 bg-primary/5 text-muted-foreground' : 'border-amber-400/30 bg-amber-400/5 text-amber-200'}`}><span className={`size-1.5 rounded-full ${online ? 'bg-primary shadow-[0_0_12px_hsl(var(--primary))]' : 'bg-amber-300'}`} />{online ? 'Protected browsing on' : 'Offline mode enabled'}</div></div>

            <form onSubmit={submitSearch} className="hero-search group flex items-center gap-3 rounded-2xl p-2 pl-5"><Search className="size-5 text-primary" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground sm:text-lg" placeholder="Search the web, privately" aria-label="Search the web" /><button type="submit" className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:brightness-110" aria-label="Search"><ArrowRight className="size-5" /></button></form>

            {activePanel === 'newtab' && <>
              <div className="flex flex-col gap-4"><div className="flex items-center justify-between"><h2 className="text-sm font-medium">Your shortcuts</h2><button onClick={() => setToast('Shortcut customization is ready for the next workspace release')} className="text-xs text-muted-foreground hover:text-primary">Customize</button></div><div className="flex flex-wrap gap-3">{shortcuts.map((shortcut) => <button key={shortcut.label} onClick={() => navigate(shortcut.url)} className="shortcut-card flex min-w-28 flex-1 items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card"><span className={`flex size-8 items-center justify-center rounded-lg text-xs font-semibold text-primary-foreground ${shortcut.color}`}>{shortcut.mark}</span><span className="min-w-0"><span className="block truncate text-sm font-medium">{shortcut.label}</span><span className="block truncate text-[11px] text-muted-foreground">{shortcut.url}</span></span></button>)}</div></div>
              <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]"><div className="rounded-2xl border border-border/70 bg-card/55 p-5 backdrop-blur-md"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-sm font-medium">Continue exploring</h2><p className="mt-1 text-xs text-muted-foreground">Pick up where you left off</p></div><CircleHelp className="size-4 text-muted-foreground" /></div><div className="flex flex-col gap-1">{activity.slice(0, 5).map((item) => <div key={`${item.title}-${item.url}`} className="flex items-center gap-3 rounded-xl p-2 text-left transition hover:bg-accent/70"><button onClick={() => openActivity(item)} className="flex min-w-0 flex-1 items-center gap-3 text-left"><span className={`size-2 rounded-full ${item.color}`} /><span className="min-w-0 flex-1"><span className="block truncate text-sm">{item.title}</span><span className="mt-1 block text-xs text-muted-foreground">{item.url}</span></span><span className="text-[11px] text-muted-foreground">{item.time}</span></button><button onClick={() => saveReadingItem(item)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-primary" aria-label={`Save ${item.title} to reading list`}><Star className="size-3.5" /></button></div>)}</div></div><div className="privacy-card rounded-2xl border border-primary/20 bg-primary/5 p-5"><div className="flex items-center justify-between"><div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary"><ShieldCheck className="size-5" /></div><span className="font-mono text-[10px] uppercase tracking-wider text-primary">This week</span></div><p className="mt-6 text-3xl font-semibold tracking-tight">1,284</p><p className="mt-1 text-sm text-muted-foreground">trackers kept away</p><div className="mt-6 h-1 overflow-hidden rounded-full bg-primary/10"><div className="h-full w-[78%] rounded-full bg-primary" /></div><p className="mt-3 text-xs leading-relaxed text-muted-foreground">You&apos;re browsing 78% more privately than the average web session.</p></div></div>
              <div className="grid gap-3 sm:grid-cols-2"><button onClick={installApp} className="install-card flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary/8 p-4 text-left transition hover:border-primary/60 hover:bg-primary/12"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary"><MonitorDown className="size-5" /></span><span className="min-w-0"><span className="block text-sm font-medium">{isInstalled ? 'Enosx is installed' : 'Install Enosx Browser'}</span><span className="mt-1 block text-xs text-muted-foreground">Use it like a private desktop app, even offline.</span></span></button><button onClick={() => { setAiOpen(true); setAiPrompt('Summarize my current workspace') }} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-4 text-left transition hover:border-primary/50"><span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary"><Sparkles className="size-5" /></span><span className="min-w-0"><span className="block text-sm font-medium">Ask Enosx AI</span><span className="mt-1 block text-xs text-muted-foreground">Local-first help with clear permissions.</span></span></button></div>
            </>}

            {activePanel !== 'newtab' && <div className="rounded-2xl border border-border/70 bg-card/55 p-5 backdrop-blur-md"><div className="mb-5 flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Personal space</p><h2 className="mt-2 text-2xl font-medium">{panelItems.find((item) => item.id === activePanel)?.label}</h2></div><MoreHorizontal className="size-4 text-muted-foreground" /></div>{(activePanel === 'bookmarks' ? bookmarks : activePanel === 'reading' ? readingList : activity).length === 0 ? <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Nothing saved here yet. Your data stays on this device.</div> : <div className="grid gap-2">{(activePanel === 'bookmarks' ? bookmarks : activePanel === 'reading' ? readingList : activity).map((item) => <div key={`${item.title}-${item.url}`} className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/30 p-3"><span className={`size-2 rounded-full ${item.color}`} /><button onClick={() => openActivity(item)} className="min-w-0 flex-1 text-left"><span className="block truncate text-sm font-medium">{item.title}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{item.url}</span></button><span className="text-xs text-muted-foreground">{item.time}</span><button onClick={() => setToast('Item kept locally')} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-primary" aria-label="Keep item"><Check className="size-3.5" /></button></div>)}</div>}</div>}
          </div></section>

          {aiOpen && <aside className="ai-panel w-full shrink-0 border-l border-primary/20 bg-card/90 p-5 backdrop-blur-2xl sm:w-80" aria-label="Enosh AI panel"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2 text-primary"><Sparkles className="size-4" /><span className="font-mono text-[10px] uppercase tracking-[0.2em]">Enosh AI</span></div><h2 className="mt-2 text-lg font-medium">A little help, on your terms.</h2></div><button onClick={() => setAiOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Close Enosh AI"><X className="size-4" /></button></div><p className="mt-3 text-xs leading-5 text-muted-foreground">AI stays scoped to exactly what you approve. The local mode works without an internet connection.</p><div className="mt-6 grid gap-3"><div><label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground" htmlFor="permission">Context permission</label><select id="permission" value={permission} onChange={(event) => setPermission(event.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"><option>Selected text only</option><option>This page</option><option>Approved tabs</option><option>Current workspace</option></select></div><div><label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground" htmlFor="ai-mode">Processing mode</label><select id="ai-mode" value={aiMode} onChange={(event) => setAiMode(event.target.value)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"><option>Local AI</option><option>Hybrid AI</option><option>Private Cloud AI</option><option>No AI</option></select></div></div>{aiMessage && <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs leading-5 text-muted-foreground">{aiMessage}</div>}<div className="mt-6 flex flex-wrap gap-2">{aiQuickActions.map((action) => <button key={action} onClick={() => chooseQuickAction(action)} className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground">{action}</button>)}</div><form onSubmit={askEnosh} className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-background/70 p-2"><input value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground" placeholder={aiMode === 'No AI' ? 'AI is disabled' : 'Ask Enosh anything'} aria-label="Ask Enosh AI" disabled={aiMode === 'No AI'} /><button className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send to Enosh AI" disabled={aiMode === 'No AI'}><Send className="size-3.5" /></button></form><div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground"><LockKeyhole className="size-3 text-primary" />Permission is visible before every action</div></aside>}
        </div>

        <footer className="flex items-center justify-between border-t border-border/60 bg-card/50 px-4 py-2 text-[11px] text-muted-foreground"><div className="flex items-center gap-2">{online ? <Globe2 className="size-3 text-primary" /> : <WifiOff className="size-3 text-amber-300" />}<span>{online ? 'Online · Enosx state is synced locally' : 'Offline · browsing shell and saved data available'}</span></div><div className="hidden items-center gap-4 sm:flex"><span>Private mode {privateMode ? 'on' : 'off'}</span><button onClick={() => setToast('Settings are stored locally in this build')} className="flex items-center gap-1 hover:text-foreground"><Settings2 className="size-3" />Settings</button><Download className="size-3" /></div></footer>
      </div>
      {toast && <div role="status" className="fixed bottom-12 left-1/2 z-50 -translate-x-1/2 rounded-full border border-primary/25 bg-card px-4 py-2 text-xs text-foreground shadow-2xl">{toast}</div>}
    </main>
  )
}
