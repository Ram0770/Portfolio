import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioData } from "./portfolioData";
import profileImageSrc from "./assets/profile.jpeg";
import { BackgroundScene } from "./components/BackgroundScene";
import { Navigation } from "./components/Navigation";
import { SectionHeading } from "./components/SectionHeading";

const HeroScene = lazy(() => import("./components/HeroScene").then((module) => ({ default: module.HeroScene })));
const SkillsScene = lazy(() => import("./components/SkillsScene").then((module) => ({ default: module.SkillsScene })));
const ProjectModal = lazy(() => import("./components/ProjectModal").then((module) => ({ default: module.ProjectModal })));

gsap.registerPlugin(ScrollTrigger);

function App() {
  const containerRef = useRef(null);
  const { contact, skills, projects, education, certifications, infoPoints, resume } = portfolioData;
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const profileImage = portfolioData.profileImage || profileImageSrc;

  const stats = useMemo(
    () => [
      { value: "04", label: "featured builds" },
      { value: "08", label: "verified certificates" },
      { value: "24/7", label: "learning mindset" },
    ],
    [],
  );

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[id], header[id]"));
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) {
          return;
        }
        const current = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        setActiveSection(current.target.id);
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-18% 0px -42% 0px" },
    );

    sections.forEach((section) => sectionObserver.observe(section));

    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setProgress(nextProgress);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => {
      sectionObserver.disconnect();
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [activeSection]);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".story-section").forEach((section, index) => {
        gsap.from(section, {
          opacity: 0,
          y: 72,
          duration: 1.1,
          ease: "power3.out",
          delay: index === 0 ? 0.06 : 0,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const magneticNodes = document.querySelectorAll(".magnetic-button");
    const cleanupFns = Array.from(magneticNodes).map((node) => {
      const handleMove = (event) => {
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        node.style.setProperty("--tx", `${x * 0.12}px`);
        node.style.setProperty("--ty", `${y * 0.12}px`);
      };

      const handleLeave = () => {
        node.style.setProperty("--tx", "0px");
        node.style.setProperty("--ty", "0px");
      };

      node.addEventListener("pointermove", handleMove);
      node.addEventListener("pointerleave", handleLeave);

      return () => {
        node.removeEventListener("pointermove", handleMove);
        node.removeEventListener("pointerleave", handleLeave);
      };
    });

    return () => cleanupFns.forEach((fn) => fn());
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[linear-gradient(180deg,rgba(9,8,7,0.88),rgba(7,6,5,0.95))] text-white">
      <BackgroundScene />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1 bg-white/5">
        <span
          className="block h-full origin-left bg-[linear-gradient(90deg,#f4ede1,#caa86a,#6fb3a7)] shadow-[0_0_18px_rgba(202,168,106,0.38)]"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>

      <Navigation
        activeSection={activeSection}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        name={portfolioData.name}
        role={portfolioData.role}
      />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 pb-24 pt-6 md:px-6 md:pt-28">
        <header id="home" className="story-section glass-panel relative overflow-hidden rounded-[34px] border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(202,168,106,0.15),transparent_22%),radial-gradient(circle_at_85%_10%,rgba(111,179,167,0.14),transparent_24%),radial-gradient(circle_at_60%_100%,rgba(244,237,225,0.1),transparent_28%)]" />
          <div className="relative grid gap-8 px-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:py-10">
            <div className="flex flex-col justify-between gap-8">
              <div className="space-y-5">
                <motion.span
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="inline-flex rounded-full border border-amber-200/20 bg-amber-200/8 px-4 py-2 text-xs uppercase tracking-[0.35em] text-amber-100/75"
                >
                  {portfolioData.role}
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 }}
                  className="max-w-4xl text-5xl font-semibold leading-[0.95] text-white md:text-7xl"
                >
                  <span className="bg-[linear-gradient(120deg,#ffffff_0%,#f4ede1_25%,#caa86a_56%,#ffffff_78%,#6fb3a7_100%)] bg-[length:220%_auto] bg-clip-text text-transparent [animation:shimmer_8s_linear_infinite]">
                    {portfolioData.tagline}
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.18 }}
                  className="max-w-2xl text-base leading-8 text-stone-300 md:text-lg"
                >
                  {portfolioData.about}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.28 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="#projects"
                  className="magnetic-button inline-flex items-center justify-center rounded-full border border-amber-200/30 bg-amber-200 px-6 py-3 text-sm font-semibold text-stone-950 transition duration-300 hover:shadow-[0_0_32px_rgba(202,168,106,0.25)]"
                >
                  Explore Projects
                </a>
                <a
                  href="#resume"
                  className="magnetic-button inline-flex items-center justify-center rounded-full border border-emerald-200/18 bg-emerald-200/8 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-emerald-200/35 hover:bg-emerald-200/12"
                >
                  Download Resume
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.34 }}
                className="grid gap-3 sm:grid-cols-3"
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-white/10 bg-stone-950/40 px-5 py-4 backdrop-blur">
                    <p className="text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-sm uppercase tracking-[0.28em] text-stone-400">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.05, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-amber-200/12 blur-3xl" />
              <div className="absolute -bottom-8 right-4 h-44 w-44 rounded-full bg-emerald-200/12 blur-3xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-stone-950/65 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                <Suspense fallback={<div className="h-[560px] w-full bg-stone-950/70" />}>
                  <HeroScene profileImage={profileImage} />
                </Suspense>
              </div>
            </motion.div>
          </div>
        </header>

        <section id="about" className="story-section grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-panel rounded-[30px] border border-white/10 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
            <SectionHeading eyebrow="About me" title="Developer profile with product depth" />
            <div className="mt-8 overflow-hidden rounded-[26px] border border-white/10 bg-stone-950/60 p-3">
              <img
                src={profileImage}
                alt={portfolioData.name}
                className="h-[420px] w-full rounded-[22px] object-contain object-center shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
              />
            </div>
          </div>

          <div className="grid gap-6">
            <div className="glass-panel rounded-[30px] border border-white/10 p-7">
              <SectionHeading eyebrow="Overview" title="My Information" text={portfolioData.about} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {infoPoints.map((point) => (
                <motion.article
                  key={point}
                  whileHover={{ y: -8, rotateX: 4, rotateY: -4 }}
                  transition={{ duration: 0.22 }}
                  className="group rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(244,237,225,0.07),rgba(255,255,255,0.03))] p-5 backdrop-blur-xl"
                >
                  <p className="text-sm leading-7 text-stone-300">{point}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="story-section grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-panel rounded-[30px] border border-white/10 p-7">
            <SectionHeading
              eyebrow="Skills"
              title="Technical Skills"
            />
            <div className="mt-8 h-[340px] overflow-hidden rounded-[28px] border border-white/10 bg-stone-950/70">
              <Suspense fallback={<div className="h-full w-full bg-stone-950/70" />}>
                <SkillsScene skills={skills} />
              </Suspense>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((group, index) => (
              <motion.article
                key={group.title}
                whileHover={{ y: -10, rotateX: 5, rotateY: index % 2 === 0 ? -5 : 5 }}
                transition={{ duration: 0.24 }}
                className="group rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(244,237,225,0.07),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-amber-100/70">{group.title}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-amber-200/18 bg-amber-200/10 px-4 py-2 text-sm text-amber-50"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="projects" className="story-section glass-panel rounded-[32px] border border-white/10 p-7">
          <SectionHeading eyebrow="Projects" title="Projects" />
          <div className="mt-8 grid gap-5 xl:grid-cols-2">
            {projects.map((project, index) => (
              <motion.article
                key={project.title}
                whileHover={{ y: -12, rotateX: 5, rotateY: index % 2 === 0 ? -6 : 6, scale: 1.01 }}
                transition={{ duration: 0.24 }}
                className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(22,18,15,0.96),rgba(11,10,9,0.78))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(202,168,106,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(111,179,167,0.12),transparent_26%)] opacity-80 transition duration-500 group-hover:scale-105" />
                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.28em] text-stone-400">{project.subtitle}</p>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <h3 className="text-3xl font-semibold text-white">{project.title}</h3>
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="magnetic-button rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white transition hover:border-amber-200/40 hover:bg-amber-200/12"
                    >
                      Open
                    </button>
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">{project.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-stone-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {project.links.live ? (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noreferrer"
                        className="magnetic-button rounded-full border border-amber-200/22 bg-amber-200/12 px-4 py-2 text-sm font-medium text-amber-50 transition hover:border-amber-200/50 hover:bg-amber-200/20"
                      >
                        Live demo
                      </a>
                    ) : null}
                    {project.links.github ? (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noreferrer"
                        className="magnetic-button rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/12"
                      >
                        GitHub
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="resume" className="story-section grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="glass-panel rounded-[32px] border border-white/10 p-7">
            <SectionHeading
              eyebrow="Resume"
              title="Resume"
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Format", value: "PDF download" },
                { label: "Focus", value: "Full Stack" },
                { label: "Location", value: contact.location },
              ].map((item) => (
                <div key={item.label} className="rounded-[26px] border border-white/10 bg-stone-950/50 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-stone-400">{item.label}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            whileHover={{ y: -10, rotateX: 4, rotateY: -4 }}
            transition={{ duration: 0.24 }}
            className="rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(244,237,225,0.1),rgba(111,179,167,0.08))] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl"
          >
            <p className="text-xs uppercase tracking-[0.34em] text-amber-100/70">Resume</p>
            <h3 className="mt-4 text-3xl font-semibold text-white">Resume / CV</h3>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={resume}
                target="_blank"
                rel="noreferrer"
                className="magnetic-button rounded-full border border-amber-200/30 bg-amber-200 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:shadow-[0_0_30px_rgba(202,168,106,0.24)]"
              >
                Open Resume
              </a>
              <a
                href={resume}
                download
                className="magnetic-button rounded-full border border-white/10 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/28 hover:bg-white/10"
              >
                Download PDF
              </a>
            </div>
          </motion.div>
        </section>

        <section id="education" className="story-section grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="glass-panel rounded-[30px] border border-white/10 p-7">
            <SectionHeading eyebrow="Education" title="Academic timeline and technical foundation" />
            <div className="mt-8 space-y-4">
              {education.map((item) => (
                <motion.article
                  key={`${item.title}-${item.year}`}
                  whileHover={{ x: 6 }}
                  className="rounded-[26px] border border-white/10 bg-stone-950/55 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-100/70">{item.year}</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-stone-300">{item.org}</p>
                  {item.detail ? <p className="mt-2 text-sm text-stone-400">{item.detail}</p> : null}
                </motion.article>
              ))}
            </div>
          </div>

          <div id="certifications" className="glass-panel rounded-[30px] border border-white/10 p-7">
            <SectionHeading eyebrow="Certifications" title="Certifications" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {certifications.map((item, index) => (
                <motion.article
                  key={`${item.title}-${item.year}`}
                  whileHover={{ y: -8, rotateX: 4, rotateY: index % 2 === 0 ? -4 : 4 }}
                  transition={{ duration: 0.22 }}
                  className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(244,237,225,0.07),rgba(255,255,255,0.03))] p-5"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-100/70">{item.year}</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-stone-300">{item.issuer}</p>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="magnetic-button mt-5 inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-white transition hover:border-amber-200/40 hover:bg-amber-200/14"
                    >
                      Verify certificate
                    </a>
                  ) : null}
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="story-section glass-panel rounded-[32px] border border-white/10 p-7">
          <SectionHeading eyebrow="Contact" title="Contact Information" />
          <div className="mt-8 grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Email", value: contact.email, href: `mailto:${contact.email}`, cta: "Send email" },
                { label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\s+/g, "")}`, cta: "Call now" },
                { label: "GitHub", value: "Ram0770", href: contact.github, cta: "Open GitHub" },
                { label: "LinkedIn", value: "Professional profile", href: contact.linkedin, cta: "Open LinkedIn" },
              ].map((item) => (
                <motion.article
                  key={item.label}
                  whileHover={{ y: -8 }}
                  className="rounded-[28px] border border-white/10 bg-stone-950/55 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-stone-400">{item.label}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    className="magnetic-button mt-5 inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-white transition hover:border-amber-200/40 hover:bg-amber-200/14"
                  >
                    {item.cta}
                  </a>
                </motion.article>
              ))}
            </div>

            <motion.form
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(244,237,225,0.07),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="group relative">
                  <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-stone-400">Name</span>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-white/10 bg-stone-950/60 px-4 py-3 text-white outline-none transition focus:border-amber-200/50 focus:shadow-[0_0_0_4px_rgba(202,168,106,0.12)]"
                  />
                </label>
                <label className="group relative">
                  <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-stone-400">Email</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-stone-950/60 px-4 py-3 text-white outline-none transition focus:border-amber-200/50 focus:shadow-[0_0_0_4px_rgba(202,168,106,0.12)]"
                  />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-stone-400">Message</span>
                <textarea
                  rows="7"
                  placeholder="Tell me about the role, project, or opportunity."
                  className="w-full rounded-3xl border border-white/10 bg-stone-950/60 px-4 py-4 text-white outline-none transition focus:border-amber-200/50 focus:shadow-[0_0_0_4px_rgba(202,168,106,0.12)]"
                />
              </label>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  className="magnetic-button rounded-full border border-amber-200/30 bg-amber-200 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:shadow-[0_0_32px_rgba(202,168,106,0.24)]"
                >
                  Send inquiry
                </button>
              </div>
            </motion.form>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selectedProject ? (
          <Suspense fallback={null}>
            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
          </Suspense>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default App;
