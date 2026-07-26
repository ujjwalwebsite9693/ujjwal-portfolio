import Reveal from '../shared/Reveal';
import { StaggerGroup, StaggerItem } from '../shared/StaggerGroup';
import './Gallery.css';

export default function Gallery({ images }) {
  if (!images.length) return null;

  return (
    <section id="gallery" className="section gallery">
      <div className="container">
        <Reveal><p className="section-eyebrow">// gallery.render()</p></Reveal>
        <Reveal delay={0.08}><h2 className="section-title">Gallery</h2></Reveal>

        <StaggerGroup className="gallery__grid">
          {images.map((img) => (
            <StaggerItem key={img._id} className="gallery__item">
              <img src={img.imageUrl} alt={img.caption || 'Gallery image'} />
              {img.caption && <span className="gallery__caption">{img.caption}</span>}
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
