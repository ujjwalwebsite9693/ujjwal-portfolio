import { useEffect, useState } from 'react';
import api from '../utils/api';
import Navbar from '../components/site/Navbar';
import Hero from '../components/site/Hero';
import About from '../components/site/About';
import Skills from '../components/site/Skills';
import Timeline from '../components/site/Timeline';
import Projects from '../components/site/Projects';
import Certificates from '../components/site/Certificates';
import Youtube from '../components/site/Youtube';
import Gallery from '../components/site/Gallery';
import Contact from '../components/site/Contact';
import Footer from '../components/site/Footer';
import Preloader from '../components/shared/Preloader';
import ScrollProgress from '../components/shared/ScrollProgress';
import PageTransition from '../components/shared/PageTransition';

export default function PortfolioSite() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState({
    profile: null,
    skills: [],
    timeline: [],
    projects: [],
    certificates: [],
    youtube: null,
    gallery: [],
  });

  useEffect(() => {
    async function loadAll() {
      const start = Date.now();
      try {
        const [profileRes, skillsRes, timelineRes, projectsRes, certificatesRes, youtubeRes, galleryRes] =
          await Promise.allSettled([
            api.get('/profile'),
            api.get('/skills'),
            api.get('/timeline'),
            api.get('/projects'),
            api.get('/certificates'),
            api.get('/youtube'),
            api.get('/gallery'),
          ]);

        setData({
          profile: profileRes.status === 'fulfilled' ? profileRes.value.data : null,
          skills: skillsRes.status === 'fulfilled' ? skillsRes.value.data : [],
          timeline: timelineRes.status === 'fulfilled' ? timelineRes.value.data : [],
          projects: projectsRes.status === 'fulfilled' ? projectsRes.value.data : [],
          certificates: certificatesRes.status === 'fulfilled' ? certificatesRes.value.data : [],
          youtube: youtubeRes.status === 'fulfilled' ? youtubeRes.value.data : null,
          gallery: galleryRes.status === 'fulfilled' ? galleryRes.value.data : [],
        });
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
        setError(true);
      } finally {
        // Keep the preloader visible for a minimum time so it doesn't just flash
        const elapsed = Date.now() - start;
        const minDelay = 600;
        setTimeout(() => setLoading(false), Math.max(0, minDelay - elapsed));
      }
    }
    loadAll();
  }, []);

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', padding: '24px', textAlign: 'center' }}>
        <h2>Couldn't reach the server</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Please check that the backend API is running and VITE_API_URL is set correctly.
        </p>
      </div>
    );
  }

  return (
    <>
      <Preloader show={loading} />
      {!loading && (
        <>
          <ScrollProgress />
          <PageTransition>
            <Navbar name={data.profile?.name} />
            <Hero profile={data.profile} />
            <About profile={data.profile} />
            <Skills skills={data.skills} />
            <Timeline items={data.timeline} />
            <Projects projects={data.projects} />
            <Certificates certificates={data.certificates} />
            <Youtube data={data.youtube} />
            <Gallery images={data.gallery} />
            <Contact profile={data.profile} />
            <Footer name={data.profile?.name} />
          </PageTransition>
        </>
      )}
    </>
  );
}
