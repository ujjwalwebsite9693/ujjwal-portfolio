import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDownload } from 'react-icons/fi';
import './Hero.css';

export default function Hero({ profile }) {
  const roles = profile?.roles?.length ? profile.roles : ['Developer', 'Creator', 'Editor'];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex % roles.length];
    const speed = isDeleting ? 45 : 90;
    const pauseAtFull = 1400;
    const pauseAtEmpty = 300;

    let timeout;
    if (!isDeleting && displayText === current) {
      timeout = setTimeout(() => setIsDeleting(true), pauseAtFull);
    } else if (isDeleting && displayText === '') {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((i) => i + 1);
      }, pauseAtEmpty);
    } else {
      timeout = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
        );
      }, speed);
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex, roles]);

  return (
    <section id="home" className="hero">
      <div className="container hero__inner">
        <motion.div
          className="hero__content"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="section-eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            // available for freelance
          </motion.p>
          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Hi, I'm <span className="hero__name">{profile?.name || 'Ujjwal Mehta'}</span>
          </motion.h1>
          <p className="hero__role">
            <span className="hero__role-text">{displayText}</span>
            <span className="hero__cursor">|</span>
          </p>
          <motion.p
            className="hero__tagline"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {profile?.tagline || 'Building modern designs & digital experiences.'}
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <a href="#contact" className="btn btn-primary">
              Contact Me <FiArrowRight />
            </a>
            {profile?.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                <FiDownload /> Resume
              </a>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.9, rotate: 4 }}
          animate={{ opacity: 1, scale: 1, rotate: 1.5 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="code-window">
            <div className="code-window__bar">
              <span className="code-dot code-dot--red" />
              <span className="code-dot code-dot--amber" />
              <span className="code-dot code-dot--green" />
              <span className="code-window__title">about-me.js</span>
            </div>
            <div className="code-window__body">
              <p><span className="code-kw">const</span> <span className="code-var">developer</span> = {'{'}</p>
              <p className="code-indent"><span className="code-key">name:</span> <span className="code-str">'{profile?.name || 'Ujjwal Mehta'}'</span>,</p>
              <p className="code-indent"><span className="code-key">role:</span> <span className="code-str">'{roles[0]}'</span>,</p>
              <p className="code-indent"><span className="code-key">stack:</span> [<span className="code-str">'HTML'</span>, <span className="code-str">'CSS'</span>,<span className="code-str">'JS'</span>,<span className="code-str">'React'</span>, <span className="code-str">'Node.js'</span>,<span className="code-str">'PHP'</span>,<span className="code-str">'MYSQL'</span>,<span className="code-str">'PYTHON'</span>,]</p>
              <p className="code-indent"><span className="code-key">channel:</span> <span className="code-str">"Ujjwal's Code"</span>,</p>
              <p className="code-indent"><span className="code-key">available:</span> <span className="code-bool">true</span>,</p>
              <p>{'};'}</p>
              <p className="code-comment">// let's build something great</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="hero__scroll-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
