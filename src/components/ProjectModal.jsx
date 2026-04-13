import { motion } from "framer-motion";

export function ProjectModal({ project, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-stone-950/86 px-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,18,15,0.98),rgba(10,10,9,0.95))] p-7 shadow-[0_40px_140px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-amber-100/70">{project.subtitle}</p>
            <h3 className="mt-3 text-3xl font-semibold text-white">{project.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white transition hover:border-white/25 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <p className="mt-6 text-base leading-8 text-stone-300">{project.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-amber-200/18 bg-amber-200/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-amber-50"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.links.live ? (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-amber-200/30 bg-amber-200 px-5 py-3 text-sm font-semibold text-stone-950"
            >
              Open live demo
            </a>
          ) : null}
          {project.links.github ? (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-white"
            >
              View GitHub
            </a>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}
