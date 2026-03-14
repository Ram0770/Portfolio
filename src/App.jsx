import { useEffect, useState } from "react";
import { portfolioData } from "./portfolioData";
import profileImageSrc from "./assets/profile.jpeg";

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function LinkIcon({ type }) {
  const paths = {
    linkedin:
      "M6.94 8.5H3.56V20h3.38zm.22-3.69a1.96 1.96 0 1 0-3.91 0 1.96 1.96 0 0 0 3.91 0M20.75 20v-6.29c0-3.37-1.8-4.94-4.2-4.94-1.94 0-2.8 1.07-3.28 1.82V8.5H9.9c.04 1.39 0 11.5 0 11.5h3.37v-6.42c0-.34.02-.68.12-.93.27-.68.88-1.38 1.91-1.38 1.35 0 1.89 1.03 1.89 2.54V20z",
    github:
      "M12 2C6.48 2 2 6.58 2 12.24c0 4.53 2.87 8.38 6.84 9.74.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.5.36 1.9-1.33 2.74-1.05 2.74-1.05.56 1.41.21 2.46.11 2.72.64.72 1.03 1.63 1.03 2.75 0 3.95-2.35 4.81-4.58 5.07.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.24C22 6.58 17.52 2 12 2",
    email:
      "M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m0 2v.51l-8 6.22-8-6.22V7zm0 10H4V9.97l7.39 5.75a1 1 0 0 0 1.22 0L20 9.97z",
    phone:
      "M6.62 10.79a15.5 15.5 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02z",
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="contact-icon">
      <path fill="currentColor" d={paths[type]} />
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="menu-icon">
      {open ? (
        <path
          fill="currentColor"
          d="M18.3 7.11 16.89 5.7 12 10.59 7.11 5.7 5.7 7.11 10.59 12 5.7 16.89 7.11 18.3 12 13.41 16.89 18.3 18.3 16.89 13.41 12z"
        />
      ) : (
        <path
          fill="currentColor"
          d="M4 7h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"
        />
      )}
    </svg>
  );
}

function AnimatedStat({ value, suffix = "", label, start }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!start) {
      return;
    }

    let frameId;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [start, value]);

  return (
    <article className="reveal-card interactive-card stat-card">
      <strong>
        {displayValue}
        {suffix}
      </strong>
      <span>{label}</span>
    </article>
  );
}

function App() {
  const { contact, skills, projects, education, certifications, infoPoints } = portfolioData;
  const profileImage = portfolioData.profileImage || profileImageSrc;
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [statsStarted, setStatsStarted] = useState(false);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) {
          return;
        }

        const mostVisible = visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        setActiveSection(mostVisible.target.id);
      },
      {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: "-20% 0px -35% 0px",
      },
    );

    const revealNodes = document.querySelectorAll(".reveal-card");
    const interactiveNodes = document.querySelectorAll(".interactive-card");
    const sectionNodes = document.querySelectorAll("section[id], header[id]");

    revealNodes.forEach((node) => revealObserver.observe(node));
    sectionNodes.forEach((node) => sectionObserver.observe(node));

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    const cleanupFns = Array.from(interactiveNodes).map((node) => {
      const handleMove = (event) => {
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -8;
        const rotateY = ((x / rect.width) - 0.5) * 10;

        node.style.setProperty("--rotate-x", `${rotateX.toFixed(2)}deg`);
        node.style.setProperty("--rotate-y", `${rotateY.toFixed(2)}deg`);
        node.classList.add("is-active");
      };

      const handleLeave = () => {
        node.style.setProperty("--rotate-x", "0deg");
        node.style.setProperty("--rotate-y", "0deg");
        node.classList.remove("is-active");
      };

      node.addEventListener("pointermove", handleMove);
      node.addEventListener("pointerleave", handleLeave);

      return () => {
        node.removeEventListener("pointermove", handleMove);
        node.removeEventListener("pointerleave", handleLeave);
      };
    });

    const magneticNodes = document.querySelectorAll(".magnetic-button");
    const magneticCleanupFns = Array.from(magneticNodes).map((node) => {
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

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => {
      cleanupFns.forEach((fn) => fn());
      magneticCleanupFns.forEach((fn) => fn());
      revealObserver.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("scroll", updateScrollProgress);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "about" && !statsStarted) {
      setStatsStarted(true);
    }
  }, [activeSection, statsStarted]);

  const navLinkClass = (section) => `nav-link ${activeSection === section ? "is-current" : ""}`;

  return (
    <div className="page-shell">
      <div className="scroll-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${scrollProgress / 100})` }} />
      </div>
      <nav className="topbar">
        <div className="topbar-inner">
          <a href="#home" className="brand">
            <span className="brand-mark">RK</span>
            <div>
              <p>{portfolioData.name}</p>
              <span>{portfolioData.role}</span>
            </div>
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <MenuIcon open={menuOpen} />
          </button>
          <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
            <a href="#about" className={navLinkClass("about")}>
              About
            </a>
            <a href="#projects" className={navLinkClass("projects")}>
              Projects
            </a>
            <a href="#education" className={navLinkClass("education")}>
              Education
            </a>
            <a href="#certifications" className={navLinkClass("certifications")}>
              Certificates
            </a>
            <a href="#contact" className={`nav-cta ${activeSection === "contact" ? "is-current" : ""}`}>
              Contact
            </a>
          </div>
        </div>
      </nav>

      <header className="hero reveal-card hero-reveal" id="home">
        <div className="hero-orb hero-orb-left" aria-hidden="true" />
        <div className="hero-orb hero-orb-right" aria-hidden="true" />
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Available for developer roles</p>
            <h1 className="hero-title">{portfolioData.tagline}</h1>
            <p className="hero-text">{portfolioData.about}</p>

            <div className="hero-actions">
              <a href="#projects" className="primary-btn magnetic-button">
                View Projects
              </a>
            </div>

            <div className="hero-meta">
              <span>{contact.location}</span>
              <span>{contact.phone}</span>
              <span>{contact.email}</span>
            </div>
          </div>

          <aside className="hero-card reveal-card interactive-card hero-aside-reveal">
            <div className="profile-visual">
              {profileImage ? (
                <img src={profileImage} alt={portfolioData.name} className="profile-image" />
              ) : (
                <div className="profile-placeholder" aria-label="Profile placeholder">
                  <strong>RK</strong>
                  <span>Profile Image</span>
                </div>
              )}
            </div>
            <p className="card-label">Core Focus</p>
            <ul>
              {portfolioData.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="contact-grid">
              <a href={contact.linkedin} target="_blank" rel="noreferrer">
                <LinkIcon type="linkedin" />
                LinkedIn
              </a>
              <a href={contact.github} target="_blank" rel="noreferrer">
                <LinkIcon type="github" />
                GitHub
              </a>
              <a href={`mailto:${contact.email}`}>
                <LinkIcon type="email" />
                Email
              </a>
              <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>
                <LinkIcon type="phone" />
                Call
              </a>
            </div>
          </aside>
        </div>
      </header>

      <main>
        <section className="content-section reveal-card reveal-from-left" id="about">
          <SectionTitle
            eyebrow="About"
            title="My information"
          />
          <div className="about-layout">
            <article className="about-card reveal-card interactive-card">
              <h3>Profile Summary</h3>
              <p>{portfolioData.about}</p>
            </article>
            <article className="about-card reveal-card interactive-card">
              <h3>Key Information</h3>
              <ul className="info-list">
                {infoPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
          <div className="stats-grid">
            <AnimatedStat value={4} suffix="+" label="featured projects" start={statsStarted} />
            <AnimatedStat value={5} suffix="+" label="core frontend and backend technologies" start={statsStarted} />
            <AnimatedStat value={2026} label="latest certification year currently listed" start={statsStarted} />
          </div>
        </section>

        <section className="content-section reveal-card reveal-from-right" id="skills">
          <SectionTitle
            eyebrow="Skills"
            title="Frontend, backend, and product engineering foundations"
          />
          <div className="skills-grid">
            {skills.map((group) => (
              <article className="skill-card reveal-card interactive-card" key={group.title}>
                <h3>{group.title}</h3>
                <div className="chip-wrap">
                  {group.items.map((item) => (
                    <span className="chip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section reveal-card reveal-pop" id="projects">
          <SectionTitle
            eyebrow="Projects"
            title="Selected work across full-stack apps and AI-enabled systems"
          />
          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card reveal-card interactive-card" key={project.title}>
                <p className="project-subtitle">{project.subtitle}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="chip-wrap">
                  {project.stack.map((item) => (
                    <span className="chip chip-dark" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
                <div className="project-links">
                  {project.links.live ? (
                    <a href={project.links.live} target="_blank" rel="noreferrer">
                      Live Demo
                    </a>
                  ) : null}
                  {project.links.github ? (
                    <a href={project.links.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section reveal-card reveal-from-left" id="education">
          <SectionTitle eyebrow="Education" title="Academic and industry learning path" />
          <div className="timeline">
            {education.map((item) => (
              <article className="timeline-card reveal-card interactive-card" key={`${item.title}-${item.year}`}>
                <span>{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.org}</p>
                {item.detail ? <small>{item.detail}</small> : null}
              </article>
            ))}
          </div>
        </section>

        <section className="content-section reveal-card reveal-pop" id="certifications">
          <SectionTitle
            eyebrow="Certifications"
            title="Certificates and verification links"
          />
          <div className="certificate-grid">
            {certifications.map((item) => (
              <article className="timeline-card certificate-card reveal-card interactive-card" key={`${item.title}-${item.year}`}>
                <span>{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.issuer}</p>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer" className="certificate-link magnetic-button">
                    View Certificate
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="content-section reveal-card reveal-from-right" id="contact">
          <SectionTitle
            eyebrow="Contact"
            title="Contact information"
            text="Use any of the links below to reach out for jobs, freelance work, or project discussions."
          />
          <div className="contact-section-grid">
            <article className="contact-card reveal-card interactive-card">
              <span className="contact-label">Mobile</span>
              <h3>{contact.phone}</h3>
              <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="magnetic-button">Call now</a>
            </article>
            <article className="contact-card reveal-card interactive-card">
              <span className="contact-label">Email</span>
              <h3>{contact.email}</h3>
              <a href={`mailto:${contact.email}`} className="magnetic-button">Send email</a>
            </article>
            <article className="contact-card reveal-card interactive-card">
              <span className="contact-label">GitHub</span>
              <h3>Ram0770</h3>
              <a href={contact.github} target="_blank" rel="noreferrer" className="magnetic-button">
                Open GitHub
              </a>
            </article>
            <article className="contact-card reveal-card interactive-card">
              <span className="contact-label">LinkedIn</span>
              <h3>Professional Profile</h3>
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className="magnetic-button">
                Open LinkedIn
              </a>
            </article>
            <article className="contact-card reveal-card interactive-card">
              <span className="contact-label">Location</span>
              <h3>{contact.location}</h3>
              <a href={contact.portfolio} target="_blank" rel="noreferrer" className="magnetic-button">
                View portfolio link
              </a>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
