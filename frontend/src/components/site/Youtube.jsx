import { motion } from 'framer-motion';
import { FiYoutube, FiPlay } from 'react-icons/fi';
import Reveal from '../shared/Reveal';
import { StaggerGroup, StaggerItem } from '../shared/StaggerGroup';
import './Youtube.css';

function VideoCard({ video }) {
  return (
    <StaggerItem
      as="a"
      href={`https://www.youtube.com/watch?v=${video.videoId}`}
      target="_blank"
      rel="noreferrer"
      className="card youtube__video-card"
    >
      <div className="youtube__thumb-wrap">
        <img src={video.thumbnailUrl} alt={video.title} className="youtube__thumb" />
        <span className="youtube__play-overlay">
          <FiPlay />
        </span>
      </div>
      <div className="youtube__video-body">
        <h4 className="youtube__video-title">{video.title}</h4>
      </div>
    </StaggerItem>
  );
}

export default function Youtube({ data }) {
  if (!data) return null;

  const { pinned = [], auto = [], channelUrl, channelName } = data;
  const videos = [...pinned, ...auto].slice(0, 8);

  return (
    <section id="youtube" className="section youtube">
      <div className="container">
        <Reveal><p className="section-eyebrow">// youtube.channel()</p></Reveal>
        <Reveal delay={0.08}><h2 className="section-title">YouTube</h2></Reveal>
        <Reveal delay={0.14}><p className="section-subtitle">Coding tutorials, tips, and project walkthroughs on my channel.</p></Reveal>

        <Reveal delay={0.2} className="youtube__channel-card">
          <motion.div
            className="youtube__channel-icon"
            initial={{ scale: 0.8, rotate: -10 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
          >
            <FiYoutube />
          </motion.div>
          <div className="youtube__channel-info">
            <h3>{channelName || "Ujjwal's Code"}</h3>
            <p>{data.channelHandle || '@Ujjwalmehta1'} — Coding • Tips • Projects</p>
          </div>
          <a
            href={`${channelUrl}?sub_confirmation=1`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary youtube__subscribe-btn"
          >
            Subscribe
          </a>
          <a href={channelUrl} target="_blank" rel="noreferrer" className="btn btn-outline youtube__view-btn">
            View Channel
          </a>
        </Reveal>

        {videos.length > 0 ? (
          <StaggerGroup className="youtube__videos-grid">
            {videos.map((video) => (
              <VideoCard key={video.videoId} video={video} />
            ))}
          </StaggerGroup>
        ) : (
          <Reveal>
            <p className="youtube__empty">
              Videos will appear here once added — check back soon or visit the channel directly.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
