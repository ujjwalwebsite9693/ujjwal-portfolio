import Reveal from '../shared/Reveal';
import { StaggerGroup, StaggerItem } from '../shared/StaggerGroup';
import './Timeline.css';

function TimelineColumn({ title, items, direction }) {
  if (!items.length) return null;
  return (
    <Reveal direction={direction} className="timeline__col">
      <h3 className="timeline__col-title">{title}</h3>
      <StaggerGroup className="timeline__list" amount={0.1}>
        {items.map((item) => (
          <StaggerItem key={item._id} className="timeline__item">
            <div className="timeline__dot" />
            <span className="timeline__period">{item.period}</span>
            <h4 className="timeline__item-title">{item.title}</h4>
            <p className="timeline__org">{item.organization}</p>
            {item.description && <p className="timeline__desc">{item.description}</p>}
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Reveal>
  );
}

export default function Timeline({ items }) {
  if (!items.length) return null;

  const education = items.filter((i) => i.type === 'education');
  const experience = items.filter((i) => i.type === 'experience');

  return (
    <section id="timeline" className="section timeline">
      <div className="container">
        <Reveal><p className="section-eyebrow">// timeline.render()</p></Reveal>
        <Reveal delay={0.08}><h2 className="section-title">Education &amp; Experience</h2></Reveal>
        <Reveal delay={0.14}><p className="section-subtitle">A quick look at where I've studied and what I've worked on.</p></Reveal>

        <div className="timeline__grid">
          <TimelineColumn title="Education" items={education} direction="left" />
          <TimelineColumn title="Experience" items={experience} direction="right" />
        </div>
      </div>
    </section>
  );
}
