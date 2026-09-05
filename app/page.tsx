'use client'

import { useState } from 'react'
import {
  ArrowLeft, ArrowRight, Bookmark, BrainCircuit, ChevronDown, CircleHelp, Command, Globe2,
  History, LockKeyhole, Menu, Plus, RefreshCw, Search, Send, ShieldCheck, Sparkles, Star,
  UserRound, X, Zap,
} from 'lucide-react'

const shortcuts = [
  { label: 'Figma', url: 'figma.com', color: 'bg-indigo-500', mark: 'F' },
  { label: 'Linear', url: 'linear.app', color: 'bg-violet-500', mark: 'L' },
  { label: 'Notion', url: 'notion.so', color: 'bg-slate-700', mark: 'N' },
  { label: 'GitHub', url: 'github.com', color: 'bg-slate-900', mark: 'G' },
]

const activity = [
  { title: 'The future of calm technology', url: 'nesslabs.com', time: '12 min ago', color: 'bg-cyan-400' },
  { title: 'Enosh design system', url: 'figma.com', time: 'Yesterday', color: 'bg-violet-400' },
  { title: 'Ambient — a focus playlist', url: 'music.youtube.com', time: 'Yesterday', color: 'bg-rose-400' },
]

export default function Page() {
  const [query, setQuery] = useState('')
  const [tabs, setTabs] = useState(['New tab', 'Design research', 'Focus playlist'])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [aiOpen, setAiOpen] = useState(false)
  const [privateMode, setPrivateMode] = useState(false)
  const [permission, setPermission] = useState('Selected text only')
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiMessage, setAiMessage] = useState('')

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!query.trim()) return
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer')
  }

  function askEnosh(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!aiPrompt.trim()) return
    setAiMessage(`I can help with “${aiPrompt.trim()}” using ${permission.toLowerCase()}.`)
    setAiPrompt('')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="app-shell flex min-h-screen flex-col">
        <header className="browser-chrome border-b border-border/70 bg-card/70 backdrop-blur-xl">
          <div className="flex h-11 items-center gap-2 px-3">
            <button className="brand-mark mr-2 flex size-6 shrink-0 items-center justify-center rounded-md" aria-label="Enosh home"><span className="brand-mark-inner" /></button>
            <nav className="flex min-w-0 flex-1 items-end gap-1 self-stretch" aria-label="Browser tabs">
              {tabs.map((tab, index) => <button key={`${tab}-${index}`} className={`tab group flex h-8 min-w-0 max-w-56 items-center gap-2 rounded-t-lg px-3 text-left text-xs ${index === 0 ? 'tab-active text-foreground' : 'text-muted-foreground hover:bg-accent/60'}`}><Globe2 className="size-3.5 shrink-0 text-primary" /><span className="truncate">{tab}</span><span role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); setTabs((current) => current.filter((_, i) => i !== index)) }} className="ml-auto rounded p-0.5 opacity-0 group-hover:opacity-100 hover:bg-muted" aria-label={`Close ${tab}`}><X className="size-3" /></span></button>)}
              <button className="mb-1 ml-1 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="New tab" onClick={() => setTabs((current) => [...current, 'New tab'])}><Plus className="size-4" /></button>
            </nav>
            <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Toggle sidebar" onClick={() => setSidebarOpen((open) => !open)}><Menu className="size-4" /></button>
          </div>
          <div className="flex h-12 items-center gap-2 px-3">
            <div className="flex items-center gap-0.5 text-muted-foreground">{[ArrowLeft, ArrowRight, RefreshCw].map((Icon, index) => <button key={index} className="rounded-md p-2 hover:bg-accent hover:text-foreground" aria-label={index === 0 ? 'Back' : index === 1 ? 'Forward' : 'Reload'}><Icon className="size-4" /></button>)}</div>
            <form onSubmit={submitSearch} className="address-bar flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2"><LockKeyhole className="size-3.5 shrink-0 text-primary" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Search or enter address" aria-label="Address and search" /><Command className="hidden size-3.5 text-muted-foreground sm:block" /><span className="hidden text-[10px] text-muted-foreground sm:block">K</span></form>
            <button className={`rounded-md p-2 ${privateMode ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} aria-label="Toggle private mode" onClick={() => setPrivateMode((mode) => !mode)}><ShieldCheck className="size-4" /></button>
            <button className={`rounded-md p-2 ${aiOpen ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} aria-label="Open Enosh AI" onClick={() => setAiOpen((open) => !open)}><BrainCircuit className="size-4" /></button>
            <button className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Bookmarks"><Bookmark className="size-4" /></button>
            <button className="flex size-8 items-center justify-center rounded-full border border-border/70 bg-accent text-muted-foreground hover:text-foreground" aria-label="Profile"><UserRound className="size-4" /></button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <aside className={`${sidebarOpen ? 'w-60 p-4' : 'w-0 p-0'} hidden shrink-0 overflow-hidden border-r border-border/60 bg-sidebar/50 transition-all duration-300 lg:block`} aria-label="Browser sidebar"><div className="flex min-w-52 flex-col gap-6"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Workspace</p><p className="mt-1 text-sm font-medium">Personal space</p></div><ChevronDown className="size-4 text-muted-foreground" /></div><div className="flex flex-col gap-1">{[['New tab', Sparkles], ['Bookmarks', Bookmark], ['Reading list', Star], ['History', History]].map(([item, Icon], index) => <button key={item as string} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${index === 0 ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'}`}><span className="text-primary"><Icon className="size-4" /></span>{item as string}</button>)}</div><div className="border-t border-border/60 pt-5"><p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Spaces</p><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground"><span className="size-2 rounded-full bg-cyan-400" />Deep work</button><button className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground"><span className="size-2 rounded-full bg-violet-400" />Inspiration</button></div><div className="mt-auto rounded-xl border border-primary/20 bg-primary/5 p-3"><div className="mb-2 flex items-center gap-2 text-primary"><Zap className="size-3.5" /><span className="font-mono text-[10px] uppercase tracking-wider">Enosh shield</span></div><p className="text-xs leading-relaxed text-muted-foreground">Private by design. 1,284 trackers blocked this week.</p><button className="mt-3 text-xs font-medium text-primary hover:underline">View protection report</button></div></div></aside>

          <section className="relative min-w-0 flex-1 overflow-auto"><div className="ambient-grid pointer-events-none absolute inset-0 opacity-60" /><div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 py-10 sm:px-10 lg:px-16 lg:py-16"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">Good evening, Alex</p><h1 className="mt-3 max-w-2xl text-balance text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl">Make space for <span className="text-primary">what matters.</span></h1><p className="mt-4 max-w-xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base">A quieter, faster way to explore the web. Welcome back to your private corner of the internet.</p></div><div className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3 py-1.5 text-xs text-muted-foreground sm:flex"><span className="size-1.5 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />Protected browsing on</div></div>
            <form onSubmit={submitSearch} className="hero-search group flex items-center gap-3 rounded-2xl p-2 pl-5"><Search className="size-5 text-primary" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground sm:text-lg" placeholder="Search the web, privately" aria-label="Search the web" /><button type="submit" className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:brightness-110" aria-label="Search"><ArrowRight className="size-5" /></button></form>
            <div className="flex flex-col gap-4"><div className="flex items-center justify-between"><h2 className="text-sm font-medium">Your shortcuts</h2><button className="text-xs text-muted-foreground hover:text-primary">Customize</button></div><div className="flex flex-wrap gap-3">{shortcuts.map((shortcut) => <button key={shortcut.label} className="shortcut-card flex min-w-28 flex-1 items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card"><span className={`flex size-8 items-center justify-center rounded-lg text-xs font-semibold text-primary-foreground ${shortcut.color}`}>{shortcut.mark}</span><span className="min-w-0"><span className="block truncate text-sm font-medium">{shortcut.label}</span><span className="block truncate text-[11px] text-muted-foreground">{shortcut.url}</span></span></button>)}</div></div>
            <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]"><div className="rounded-2xl border border-border/70 bg-card/55 p-5 backdrop-blur-md"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-sm font-medium">Continue exploring</h2><p className="mt-1 text-xs text-muted-foreground">Pick up where you left off</p></div><CircleHelp className="size-4 text-muted-foreground" /></div><div className="flex flex-col gap-1">{activity.map((item) => <button key={item.title} className="flex items-center gap-3 rounded-xl p-2 text-left transition hover:bg-accent/70"><span className={`size-2 rounded-full ${item.color}`} /><span className="min-w-0 flex-1"><span className="block truncate text-sm">{item.title}</span><span className="mt-1 block text-xs text-muted-foreground">{item.url}</span></span><span className="text-[11px] text-muted-foreground">{item.time}</span></button>)}</div></div><div className="privacy-card rounded-2xl border border-primary/20 bg-primary/5 p-5"><div className="flex items-center justify-between"><div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary"><ShieldCheck className="size-5" /></div><span className="font-mono text-[10px] uppercase tracking-wider text-primary">This week</span></div><p className="mt-6 text-3xl font-semibold tracking-tight">1,284</p><p className="mt-1 text-sm text-muted-foreground">trackers kept away</p><div className="mt-6 h-1 overflow-hidden rounded-full bg-primary/10"><div className="h-full w-[78%] rounded-full bg-primary" /></div><p className="mt-3 text-xs leading-relaxed text-muted-foreground">You&apos;re browsing 78% more privately than the average web session.</p></div></div>
          </div></section>

          {aiOpen && <aside className="ai-panel w-full shrink-0 border-l border-primary/20 bg-card/90 p-5 backdrop-blur-2xl sm:w-80" aria-label="Enosh AI panel"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2 text-primary"><Sparkles className="size-4" /><span className="font-mono text-[10px] uppercase tracking-[0.2em]">Enosh AI</span></div><h2 className="mt-2 text-lg font-medium">A little help, on your terms.</h2></div><button onClick={() => setAiOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Close Enosh AI"><X className="size-4" /></button></div><p className="mt-3 text-xs leading-5 text-muted-foreground">AI stays scoped to exactly what you approve. Nothing is shared by default.</p><div className="mt-6 flex flex-col gap-2"><label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground" htmlFor="permission">Context permission</label><select id="permission" value={permission} onChange={(event) => setPermission(event.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"><option>Selected text only</option><option>This page</option><option>Approved tabs</option></select></div>{aiMessage && <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs leading-5 text-muted-foreground">{aiMessage}</div>}<div className="mt-6 flex flex-wrap gap-2">{['Summarize', 'Explain this', 'Rewrite clearly', 'Compare tabs'].map((action) => <button key={action} onClick={() => setAiPrompt(action)} className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground">{action}</button>)}</div><form onSubmit={askEnosh} className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-background/70 p-2"><input value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground" placeholder="Ask Enosh anything" aria-label="Ask Enosh AI" /><button className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground" aria-label="Send to Enosh AI"><Send className="size-3.5" /></button></form><div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground"><LockKeyhole className="size-3 text-primary" />Permission is visible before every action</div></aside>}
        </div>
      </div>
    </main>
  )
}
