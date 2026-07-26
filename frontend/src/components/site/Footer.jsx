import Reveal from '../shared/Reveal';
import './Footer.css';

export default function Footer({ name }) {
  return (
    <Reveal as="footer" className="footer" duration={0.5}>
      <div className="container footer__inner">
        <p>© {new Date().getFullYear()} {name || 'Ujjwal Mehta'} — All Rights Reserved</p>
        <p className="footer__made">
          Made with <span className="footer__heart">♥</span> by <strong>{name || 'Ujjwal Mehta'}</strong>
        </p>
      </div>
    </Reveal>
  );
}
