import { FiAward, FiExternalLink } from 'react-icons/fi';
import Reveal from '../shared/Reveal';
import { StaggerGroup, StaggerItem } from '../shared/StaggerGroup';
import './Certificates.css';

export default function Certificates({ certificates }) {
  if (!certificates.length) return null;

  return (
    <section id="certificates" className="section certificates">
      <div className="container">
        <Reveal><p className="section-eyebrow">// certificates.list()</p></Reveal>
        <Reveal delay={0.08}><h2 className="section-title">My Certificates</h2></Reveal>
        <Reveal delay={0.14}><p className="section-subtitle">Courses and programs I've completed along the way.</p></Reveal>

        <StaggerGroup className="certificates__grid">
          {certificates.map((cert) => (
            <StaggerItem key={cert._id} className="card certificates__card">
              <div className="certificates__image-wrap">
                {cert.imageUrl ? (
                  <img src={cert.imageUrl} alt={cert.title} className="certificates__image" />
                ) : (
                  <div className="certificates__image certificates__image--placeholder">
                    <FiAward size={36} />
                  </div>
                )}
              </div>
              <div className="certificates__body">
                <span className="certificates__issuer">{cert.issuer}</span>
                <h3 className="certificates__title">{cert.title}</h3>
                <div className="certificates__footer">
                  <span className="certificates__year">{cert.year}</span>
                  {cert.verifyUrl && (
                    <a href={cert.verifyUrl} target="_blank" rel="noreferrer" className="certificates__verify link-underline">
                      Verify <FiExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
