import { FiUser, FiCalendar, FiClock, FiBriefcase, FiGlobe } from 'react-icons/fi';
import Reveal from '../shared/Reveal';
import { StaggerGroup, StaggerItem } from '../shared/StaggerGroup';
import './About.css';

const InfoRow = ({ icon, label, value }) => (
  <StaggerItem className="about__info-row">
    <span className="about__info-icon">{icon}</span>
    <span className="about__info-label">{label}</span>
    <span className="about__info-value">{value}</span>
  </StaggerItem>
);

export default function About({ profile }) {
  if (!profile) return null;

  return (
    <section id="about" className="section about">
      <div className="container">
        <Reveal><p className="section-eyebrow">// about-me.about()</p></Reveal>
        <Reveal delay={0.08}><h2 className="section-title">About Me</h2></Reveal>

        <div className="about__grid">
          <Reveal direction="left" delay={0.1} className="about__image-wrap">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="about__image" />
            ) : (
              <div className="about__image about__image--placeholder">
                <FiUser size={64} />
              </div>
            )}
            <div className="about__image-accent" />
          </Reveal>

          <Reveal direction="right" delay={0.15} className="about__content">
            <h3 className="about__heading">My name is {profile.name}</h3>
            <p className="about__bio">{profile.bio}</p>

            <StaggerGroup className="about__info-grid">
              <InfoRow icon={<FiCalendar />} label="Age" value={profile.age} />
              <InfoRow icon={<FiCalendar />} label="Birthday" value={profile.birthday} />
              <InfoRow icon={<FiClock />} label="Experience" value={profile.experience} />
              <InfoRow icon={<FiBriefcase />} label="Freelance" value={profile.freelance} />
              <InfoRow icon={<FiGlobe />} label="Languages" value={profile.languages} />
            </StaggerGroup>

            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-primary about__resume-btn">
                Download Resume
              </a>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
