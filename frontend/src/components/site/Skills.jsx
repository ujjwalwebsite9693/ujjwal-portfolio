import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../shared/Reveal';
import { StaggerGroup, StaggerItem } from '../shared/StaggerGroup';
import './Skills.css';

export default function Skills({ skills }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const set = new Set(skills.map((s) => s.category));
    return ['All', ...Array.from(set)];
  }, [skills]);

  const filtered = activeCategory === 'All' ? skills : skills.filter((s) => s.category === activeCategory);

  if (!skills.length) return null;

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <Reveal><p className="section-eyebrow">// skills.list()</p></Reveal>
        <Reveal delay={0.08}><h2 className="section-title">My Skills</h2></Reveal>
        <Reveal delay={0.14}><p className="section-subtitle">Technologies and tools I use to build things.</p></Reveal>

        <Reveal delay={0.18} className="skills__filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`skills__filter-btn ${activeCategory === cat ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </Reveal>

        <AnimatePresence mode="wait">
          <StaggerGroup className="skills__grid" key={activeCategory}>
            {filtered.map((skill) => (
              <StaggerItem key={skill._id} className="card skills__card">
                <div className="skills__card-top">
                  <span className="tag">{skill.category}</span>
                  <span className="skills__level">{skill.level}</span>
                </div>
                <h3 className="skills__name">{skill.name}</h3>
                {skill.description && <p className="skills__desc">{skill.description}</p>}

                <div className="skills__proficiency">
                  <div className="skills__proficiency-track">
                    <motion.div
                      className="skills__proficiency-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    />
                  </div>
                  <span className="skills__proficiency-value">{skill.proficiency}%</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </AnimatePresence>
      </div>
    </section>
  );
}
