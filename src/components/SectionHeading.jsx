import { motion } from "framer-motion";

export function SectionHeading({ eyebrow, title, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.8 }}
      className="space-y-3"
    >
      <p className="text-xs uppercase tracking-[0.35em] text-amber-100/65">{eyebrow}</p>
      <h2 className="max-w-4xl text-3xl font-semibold leading-tight text-white md:text-5xl">{title}</h2>
      {text ? <p className="max-w-3xl text-sm leading-7 text-stone-300 md:text-base">{text}</p> : null}
    </motion.div>
  );
}
