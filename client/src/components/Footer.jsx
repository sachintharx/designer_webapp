const Footer = () => {
  return (
    <footer className="footer footer-modern">
      <div className="footer-inner">
        <div className="footer-col">
          <img src="/logo.png" alt="DesignHub" className="footer-logo" />
          <p className="footer-tag">© 2026 DesignHub — Where creativity meets opportunity.</p>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <p>support@designhub.com</p>
          <p>business@designhub.com</p>
          <p className="muted">Response within 24 hours</p>
        </div>

        {/* Follow section removed as requested */}
      </div>

      <div className="footer-bottom">
        <p className="small muted">DesignHub is a matching platform for design projects. All trademarks are the property of their respective owners.</p>
      </div>
    </footer>
  );
};

export default Footer;
