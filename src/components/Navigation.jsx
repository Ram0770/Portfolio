import { motion } from "framer-motion";

const navItems = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certificates" },
];

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      {open ? (
        <path
          fill="currentColor"
          d="M18.3 7.11 16.89 5.7 12 10.59 7.11 5.7 5.7 7.11 10.59 12 5.7 16.89 7.11 18.3 12 13.41 16.89 18.3 18.3 16.89 13.41 12z"
        />
      ) : (
        <path fill="currentColor" d="M4 7h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
      )}
    </svg>
  );
}

export function Navigation({ activeSection, menuOpen, setMenuOpen, name, role }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="sticky top-4 z-[60] mx-auto mt-4 w-[min(1280px,calc(100%-1rem))] px-2 md:top-5 md:w-[min(1280px,calc(100%-2rem))]"
    >
      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,18,16,0.82),rgba(10,10,9,0.72))] px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:px-6">
        <div className="flex items-center justify-between gap-4">
          <a href="#home" className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,#f4ede1,#caa86a)] text-sm font-semibold text-stone-950">
              RK
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400">{role}</p>
            </div>
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <MenuIcon open={menuOpen} />
          </button>

          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative rounded-full px-4 py-2 text-sm transition ${
                  activeSection === item.id ? "text-white" : "text-stone-400 hover:text-white"
                }`}
              >
                {activeSection === item.id ? (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-full border border-amber-200/25 bg-amber-200/10"
                    transition={{ type: "spring", bounce: 0.22, duration: 0.55 }}
                  />
                ) : null}
                <span className="relative z-10">{item.label}</span>
              </a>
            ))}
            <a
              href="#contact"
              className="magnetic-button ml-2 rounded-full border border-amber-200/35 bg-amber-200 px-5 py-2 text-sm font-semibold text-stone-950 transition hover:shadow-[0_0_26px_rgba(202,168,106,0.24)]"
            >
              Contact
            </a>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: menuOpen ? "auto" : 0,
            opacity: menuOpen ? 1 : 0,
            marginTop: menuOpen ? 16 : 0,
          }}
          className="overflow-hidden md:hidden"
        >
          <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`rounded-2xl px-4 py-3 text-sm transition ${
                  activeSection === item.id
                    ? "border border-amber-200/25 bg-amber-200/10 text-white"
                    : "border border-transparent bg-white/4 text-stone-300"
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className="rounded-2xl border border-amber-200/25 bg-amber-200 px-4 py-3 text-center text-sm font-semibold text-stone-950"
            >
              Contact
            </a>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
