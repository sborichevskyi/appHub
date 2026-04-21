import './Footer.scss';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__links">
        <a href="https://github.com/sborichevskyi" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/stanislav-borychevskyi-b84b16317/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="mailto:sborichevskiy74@gmail.com?subject=Hello&body=Hi%20there!">Email</a>
        <a href="https://www.instagram.com/sborichevskiy/" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://wa.me/393518151457" target="_blank" rel="noopener noreferrer">WhatsUp</a>
      </div>
      <div className="footer__copyright">
        <p>© 2026 Stanislav Borychevskyi</p>
      </div>
    </footer>
  );
};