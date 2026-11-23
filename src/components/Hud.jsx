import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Sparkles, Code2, Rocket, TreePine, Flower2, Mail,
  ChevronLeft, ChevronRight, MapPin, Phone, Linkedin, Github,
  BookOpen, Feather, Compass, Sprout,
  Quote, ArrowRight, X, Trophy, ExternalLink, Maximize2, Minimize2, Heart,
} from 'lucide-react'
import { Tag, FlowerRating } from './shared.jsx'
import Signature from './Signature.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import {
  CONTACT, ABOUT, PROJECTS,
  FOUNDATION_PROFILES, FOUNDATION_GROUPS, MILESTONES, TRIUMPHS,
  BOOK_FILTERS, BOOKS, POEM_PLACEHOLDERS, SUSTAINABILITY_NOTE, CURIOSITY_RITUAL,
} from '../data.js'

const STATIONS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: Sparkles },
  { id: 'tech', label: 'Projects', icon: Code2 },
  { id: 'product', label: 'Foundations', icon: Rocket },
  { id: 'journey', label: 'Journey', icon: TreePine },
  { id: 'sanctuary', label: 'Sanctuary', icon: Flower2 },
  { id: 'contact', label: 'Contact', icon: Mail },
]

/* ---------------- Reusable bits ---------------- */

function PanelTitle({ children, sub }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-2xl font-semibold text-heading">{children}</h2>
      {sub && <p className="mt-1 text-sm text-body/75">{sub}</p>}
    </div>
  )
}

function ProjectCard({ p }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="rounded-2xl border border-line bg-chip-bg p-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-semibold leading-tight text-heading">{p.title}</h3>
        {(p.year || p.role) && (
          <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold text-muted">
            {p.year || p.role}
          </span>
        )}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-body/80">{p.summary}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">{p.skills.map((skill) => <Tag key={skill}>{skill}</Tag>)}</div>
      {p.links?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {p.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-[10px] font-semibold text-accent transition hover:-translate-y-0.5">
              {link.label} <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ---------------- Panels ---------------- */

function AboutPanel() {
  return (
    <div>
      <PanelTitle sub="How I think, build, and show up.">About Me</PanelTitle>
      <div className="space-y-3">
        {ABOUT.paragraphs.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-body/80">{p}</p>
        ))}
      </div>
      <h4 className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-accent">How I Work</h4>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {ABOUT.workPrinciples.map((c) => (
          <div key={c.title} className="rounded-2xl border border-line bg-chip-bg p-2.5">
            <p className="text-sm font-semibold text-heading">{c.emoji} {c.title}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-body/70">{c.body}</p>
          </div>
        ))}
      </div>
      <h4 className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-accent">Off the Clock</h4>
      <ul className="mt-2 grid grid-cols-1 gap-2 text-sm text-body/80">
        {ABOUT.facts.map((fact) => (
          <li key={fact.title}>
            {fact.emoji} <strong className="text-heading">{fact.title}</strong> — {fact.body}
          </li>
        ))}
      </ul>
    </div>
  )
}

const PROJECT_FILTERS = ['All', 'Product', 'Engineering', 'AI / ML', 'Case Studies']

function ProjectsPanel() {
  const [filter, setFilter] = useState('All')
  const projects = filter === 'All' ? PROJECTS : PROJECTS.filter((project) => project.categories.includes(filter))

  return (
    <div>
      <PanelTitle sub="Interdisciplinary builds, ML experiments, and product teardowns.">Projects</PanelTitle>
      <div className="mb-3 flex flex-wrap gap-2">
        {PROJECT_FILTERS.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === item ? 'bg-accent text-white' : 'border border-line bg-chip-bg text-accent'}`}
          >
            {item}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={filter} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-2.5">
          {projects.map((p) => <ProjectCard key={p.title} p={p} />)}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function FoundationsPanel() {
  return (
    <div>
      <PanelTitle sub="My profiles, coursework, and the toolkit behind the builds.">Foundations</PanelTitle>
      <div className="mb-5 flex flex-wrap gap-2">
        {FOUNDATION_PROFILES.map((profile) => (
          <a
            key={profile.label}
            href={profile.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-chip-bg px-3 py-1.5 text-xs font-semibold text-accent transition hover:-translate-y-0.5 hover:bg-surface"
          >
            {profile.label} <ExternalLink className="h-3 w-3" />
          </a>
        ))}
      </div>
      <h4 className="text-[11px] font-semibold uppercase tracking-widest text-accent">Coursework &amp; Toolkit</h4>
      <div className="mt-2 space-y-2.5">
        {FOUNDATION_GROUPS.map((group) => (
          <div key={group.title} className="rounded-2xl border border-line bg-chip-bg p-3">
            <h3 className="mb-2 text-sm font-semibold text-heading">{group.title}</h3>
            <div className="flex flex-wrap gap-1.5">
              {group.skills.map((skill) => <Tag key={skill}>{skill}</Tag>)}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-2xl border border-line bg-chip-bg p-3 text-xs leading-relaxed text-body/75">
        📝 Too lazy to list every single topic I learned under these right now—syllabus breakdowns coming soon (probably).
      </p>
    </div>
  )
}

/* Journey as a clean 2D vertical timeline */
function JourneyPanel() {
  return (
    <div>
      <PanelTitle sub="Where I've been, what I've led, and a few podiums along the way.">Journey</PanelTitle>
      <div className="relative pl-6">
        <div className="absolute bottom-2 left-[9px] top-2 w-0.5 rounded-full bg-gradient-to-b from-accent via-accent-2 to-accent opacity-50" />
        <div className="space-y-3">
          {MILESTONES.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="relative">
              <span className="absolute -left-[26px] flex h-5 w-5 items-center justify-center rounded-full border border-line bg-surface-solid text-[10px] shadow-soft">{m.icon}</span>
              <div className="rounded-2xl border border-line bg-chip-bg p-3">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-chip-text">{m.date}</span>
                <h3 className="font-display text-sm font-semibold text-heading">{m.title}</h3>
                <p className="text-xs leading-snug text-body/75">{m.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <h4 className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent"><Trophy className="h-3.5 w-3.5" /> Trail Triumphs</h4>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {TRIUMPHS.map((t, i) => (
          <div key={i} className="rounded-2xl border border-line bg-chip-bg p-2.5 text-center">
            <div className="text-2xl">{t.medal}</div>
            <p className="mt-1 text-xs font-bold leading-tight text-heading">{t.title}</p>
            <p className="text-[10px] text-muted">{t.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SanctuaryPanel({ tab = 'books', setTab = () => {}, onExpand }) {
  const TABS = [
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'poetry', label: 'Poetry', icon: Feather },
    { id: 'sustainability', label: 'Eco', icon: Sprout },
    { id: 'curiosities', label: 'Curiosities', icon: Compass },
  ]
  const pick = (id) => { setTab(id); onExpand?.() }
  const [filter, setFilter] = useState(BOOK_FILTERS[0])
  const [poem, setPoem] = useState(null)
  const [rec, setRec] = useState({ title: '', author: '', note: '' })
  const sendRec = () => {
    if (!rec.title.trim()) return
    const subject = encodeURIComponent(`Book recommendation for Sneha: ${rec.title}`)
    const body = encodeURIComponent(
      `Hi Sneha,\n\nI think you'd love this book:\n\nTitle: ${rec.title}\nAuthor: ${rec.author || '—'}\n\nWhy: ${rec.note || '—'}`,
    )
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`
  }

  return (
    <div>
      <PanelTitle sub="Where I rest, read, and wander off-script.">Personal Sanctuary</PanelTitle>
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => pick(t.id)} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${tab === t.id ? 'bg-accent text-white' : 'border border-line bg-chip-bg text-accent'}`}>
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'books' && (
          <div>
            <p className="mb-3 text-sm leading-relaxed text-body/80">
              Big believer in physical paperbacks, dog-eared pages, and annotated margins.
            </p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {BOOK_FILTERS.map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${filter === f ? 'bg-accent text-white' : 'border border-line bg-chip-bg text-accent'}`}>{f}</button>
              ))}
            </div>
            <div className="space-y-2">
              {BOOKS.filter((b) => b.category === filter).map((b) => (
                <div key={b.title} className="flex gap-3 rounded-2xl border border-line bg-chip-bg p-2.5">
                  <div className="flex h-16 w-11 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-lilac to-blush dark:from-indigo dark:to-forest"><BookOpen className="h-5 w-5 text-accent" /></div>
                  <div className="min-w-0">
                    <h4 className="font-display text-sm font-semibold leading-tight text-heading">{b.title}</h4>
                    <p className="text-xs text-accent">{b.author}</p>
                    {b.rating > 0 ? (
                      <div className="mt-1"><FlowerRating rating={b.rating} /></div>
                    ) : (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent"><BookOpen className="h-3 w-3" /> On my nightstand</span>
                    )}
                    {b.lines?.map((l, i) => (
                      <p key={i} className="mt-1 flex gap-1 text-[11px] italic leading-snug text-body/70"><Quote className="mt-0.5 h-3 w-3 shrink-0 text-accent/60" />{l}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Recommend a book to Sneha */}
            <div className="mt-4 rounded-2xl border border-line bg-chip-bg p-3">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-heading"><Heart className="h-4 w-4 text-accent" /> Recommend a book to me</p>
              <p className="mt-0.5 text-[11px] text-muted">I’m always taking suggestions — send one my way ✨</p>
              <div className="mt-2 space-y-2">
                <input value={rec.title} onChange={(e) => setRec({ ...rec, title: e.target.value })} placeholder="Book title"
                  className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-xs text-body outline-none placeholder:text-muted focus:border-accent" />
                <input value={rec.author} onChange={(e) => setRec({ ...rec, author: e.target.value })} placeholder="Author (optional)"
                  className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-xs text-body outline-none placeholder:text-muted focus:border-accent" />
                <textarea value={rec.note} onChange={(e) => setRec({ ...rec, note: e.target.value })} placeholder="Why should I read it?" rows={2}
                  className="w-full resize-none rounded-xl border border-line bg-surface px-3 py-2 text-xs text-body outline-none placeholder:text-muted focus:border-accent" />
                <button onClick={sendRec} disabled={!rec.title.trim()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white shadow-glow transition hover:-translate-y-0.5 disabled:opacity-40">
                  <ArrowRight className="h-3.5 w-3.5" /> Send recommendation
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'poetry' && (
          <div className="grid gap-2">
            {POEM_PLACEHOLDERS.map((p, i) => (
              <button key={i} onClick={() => setPoem(p)} className="rounded-2xl border border-line bg-chip-bg p-3 text-left transition hover:-translate-y-0.5">
                <Feather className="mb-1 h-4 w-4 text-accent" />
                <h4 className="font-display text-base font-semibold text-heading">{p.title}</h4>
                <p className="mt-1 line-clamp-2 whitespace-pre-line text-xs italic text-body/70">{p.excerpt}</p>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent">Read more <ArrowRight className="h-3 w-3" /></span>
              </button>
            ))}
          </div>
        )}

        {tab === 'sustainability' && (
          <p className="text-sm leading-relaxed text-body/80">{SUSTAINABILITY_NOTE}</p>
        )}

        {tab === 'curiosities' && (
          <div className="rounded-2xl border border-line bg-chip-bg p-4">
            <Compass className="mb-2 h-5 w-5 text-accent" />
            <h4 className="font-display text-base font-semibold text-heading">{CURIOSITY_RITUAL.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-body/80">{CURIOSITY_RITUAL.body}</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {poem && (
          <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPoem(null)} />
            <motion.div initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }} className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto scrollbar-soft rounded-3xl border border-line bg-surface-solid p-8 shadow-glow">
              <Flower2 className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 text-accent/15" />
              <button onClick={() => setPoem(null)} className="absolute right-4 top-4 rounded-full border border-line bg-surface p-2 text-accent" aria-label="Close"><X className="h-4 w-4" /></button>
              <Feather className="mb-3 h-6 w-6 text-accent" />
              <h3 className="font-display text-2xl font-semibold text-heading">{poem.title}</h3>
              <p className="mt-4 whitespace-pre-line font-display text-base italic leading-relaxed text-body/85">{poem.body}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ContactPanel() {
  const socials = [
    { href: CONTACT.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { href: CONTACT.leetcode, icon: Code2, label: 'LeetCode' },
    { href: CONTACT.github, icon: Github, label: 'GitHub' },
  ]
  return (
    <div>
      <PanelTitle sub="Let’s build something lovely together.">Get in Touch</PanelTitle>
      <p className="text-sm leading-relaxed text-body/80">
        Whether you want to discuss AI product strategy, debate a book, share poetry, or play a quick
        badminton match — my inbox is always open.
      </p>
      <a href={`mailto:${CONTACT.email}`} className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-accent-strong">
        <Mail className="h-4 w-4" /> Say Hello
      </a>
      <div className="mt-4 flex flex-col gap-1.5 text-sm text-body/80">
        <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> {CONTACT.location}</span>
        <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center gap-2 hover:text-accent"><Phone className="h-4 w-4 text-accent" /> {CONTACT.phone}</a>
        <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 hover:text-accent"><Mail className="h-4 w-4 text-accent" /> {CONTACT.email}</a>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line bg-chip-bg px-4 py-2 text-sm font-medium text-accent transition hover:-translate-y-0.5">
            <s.icon className="h-4 w-4" /> {s.label} <ExternalLink className="h-3 w-3" />
          </a>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted">© {new Date().getFullYear()} Sneha Raj · Crafted with 🌿, poetry &amp; a little badminton.</p>
    </div>
  )
}

// Home (index 0) intentionally has no panel — the landing is the scene alone.
const PANELS = [null, AboutPanel, ProjectsPanel, FoundationsPanel, JourneyPanel, SanctuaryPanel, ContactPanel]

/* ---------------- HUD shell ---------------- */

export default function Hud({ station, setStation }) {
  const Panel = PANELS[station]
  const [expanded, setExpanded] = useState(false)
  const [sancTab, setSancTab] = useState('books')
  const navTo = (i) => { setExpanded(false); setStation(i) }
  const go = (dir) => { setExpanded(false); setStation((s) => Math.min(STATIONS.length - 1, Math.max(0, s + dir))) }
  // Panels receive these; only the Sanctuary panel uses them (tabs auto-open the reader).
  const panelProps = { tab: sancTab, setTab: setSancTab, onExpand: () => setExpanded(true) }

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {/* Top bar: signature + nav */}
      <div className="pointer-events-auto fixed inset-x-0 top-0">
        <div className="mx-auto mt-2 flex w-[calc(100%-1rem)] max-w-6xl items-center justify-between gap-3 rounded-3xl border border-line glass px-3 py-2 shadow-soft sm:mt-3 sm:px-4">
          <Signature className="shrink-0" />
          <nav className="flex max-w-full items-center gap-0.5 overflow-x-auto scrollbar-soft">
            {STATIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => navTo(i)}
                title={s.label}
                className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition ${station === i ? 'text-white' : 'text-body/70 hover:text-accent'}`}
              >
                {station === i && <motion.span layoutId="hud-pill" className="absolute inset-0 -z-10 rounded-full bg-accent shadow-glow" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <s.icon className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">{s.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content panel — large right-side column on desktop, bottom sheet on mobile.
          The Expand button opens a full-screen glass reader. */}
      <AnimatePresence mode="wait">
        {Panel && !expanded && (
          <motion.aside
            key={station}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto fixed bottom-0 left-0 right-0 top-auto max-h-[56dvh] touch-pan-y overflow-y-auto overscroll-contain scrollbar-soft rounded-t-3xl border-t border-line glass px-5 pb-36 pt-11 shadow-glow md:bottom-5 md:left-auto md:right-4 md:top-auto md:max-h-[52vh] md:w-[19rem] md:rounded-3xl md:border md:px-5 md:pb-5 md:pt-11"
          >
            <button
              onClick={() => setExpanded(true)}
              title="Expand to full screen"
              className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-line bg-chip-bg px-3 py-1.5 text-[11px] font-semibold text-accent shadow-sm transition hover:-translate-y-0.5 hover:bg-surface"
            >
              <Maximize2 className="h-3.5 w-3.5" /> Expand
            </button>
            <Panel {...panelProps} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Full-screen glass reader */}
      <AnimatePresence>
        {Panel && expanded && (
          <motion.div
            className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setExpanded(false)} />
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 240, damping: 26 }}
              className="relative z-10 flex h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-line glass shadow-glow"
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-3">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
                  <Flower2 className="h-3.5 w-3.5" /> {STATIONS[station].label}
                </span>
                <button
                  onClick={() => setExpanded(false)}
                  title="Close"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-chip-bg px-3 py-1.5 text-[11px] font-semibold text-accent transition hover:bg-surface"
                >
                  <Minimize2 className="h-3.5 w-3.5" /> Close
                </button>
              </div>
              <div className="mx-auto w-full max-w-3xl flex-1 touch-pan-y overflow-y-auto overscroll-contain scrollbar-soft px-6 py-6 sm:px-10">
                <Panel {...panelProps} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prev / Next */}
      <div className="pointer-events-auto fixed bottom-24 left-1/2 flex -translate-x-1/2 items-center gap-3 md:bottom-6 md:left-6 md:translate-x-0">
        <button onClick={() => go(-1)} disabled={station === 0} className="flex h-10 w-10 items-center justify-center rounded-full border border-line glass text-accent shadow-soft transition hover:-translate-y-0.5 disabled:opacity-30" aria-label="Previous">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-xs font-semibold text-body/70">{station + 1} / {STATIONS.length}</span>
        <button onClick={() => go(1)} disabled={station === STATIONS.length - 1} className="flex h-10 w-10 items-center justify-center rounded-full border border-line glass text-accent shadow-soft transition hover:-translate-y-0.5 disabled:opacity-30" aria-label="Next">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="pointer-events-auto"><ThemeToggle /></div>
    </div>
  )
}
