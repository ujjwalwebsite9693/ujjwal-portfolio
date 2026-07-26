import { FiGithub, FiExternalLink, FiCode } from 'react-icons/fi';
import Reveal from '../shared/Reveal';
import { StaggerGroup, StaggerItem } from '../shared/StaggerGroup';
import './Projects.css';

export default function Projects({ projects }) {
  if (!projects.length) return null;

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <Reveal><p className="section-eyebrow">// projects.featured()</p></Reveal>
        <Reveal delay={0.08}><h2 className="section-title">Featured Projects</h2></Reveal>
        <Reveal delay={0.14}><p className="section-subtitle">Some things I've built or worked on recently.</p></Reveal>

        <StaggerGroup className="projects__grid">
          {projects.map((project) => (
            <StaggerItem key={project._id} className="card projects__card">
              <div className="projects__image-wrap">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="projects__image" />
                ) : (
                  <div className="projects__image projects__image--placeholder">
                    <FiCode size={40} />
                  </div>
                )}
              </div>

              <div className="projects__body">
                <h3 className="projects__title">{project.title}</h3>
                <p className="projects__desc">{project.description}</p>

                {project.tags?.length > 0 && (
                  <div className="projects__tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="projects__links">
                  {project.codeUrl && (
                    <a href={project.codeUrl} target="_blank" rel="noreferrer" className="btn btn-outline projects__link-btn">
                      <FiGithub /> Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary projects__link-btn">
                      <FiExternalLink /> Live Demo
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
