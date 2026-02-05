const About = () => {
  return (
    <div className="page-container about-page">
      <div className="hero-section">
        <h1 className="page-title">About DesignHub</h1>
        <p className="page-subtitle">
          Bridging the gap between creative talent and meaningful design opportunities
        </p>
      </div>

      <section className="content-section">
        <div className="content-grid">
          <div className="content-card">
            <div className="card-icon">🎯</div>
            <h2>Our Mission</h2>
            <p>
              DesignHub exists to create a seamless connection between businesses seeking 
              exceptional design work and talented designers looking for their next creative 
              challenge. We believe every project deserves the perfect creative match, and 
              every designer deserves opportunities that showcase their unique skills.
            </p>
          </div>

          <div className="content-card">
            <div className="card-icon">⚡</div>
            <h2>How It Works</h2>
            <p>
              Businesses post design tasks with clear briefs, budgets, and deadlines. 
              Designers review opportunities, submit their portfolio samples, and express 
              interest with their rates and expertise. It's a transparent, efficient way 
              to match creativity with opportunity—no lengthy applications, just talent 
              and vision meeting needs.
            </p>
          </div>

          <div className="content-card">
            <div className="card-icon">💎</div>
            <h2>Why Choose Us</h2>
            <p>
              Unlike traditional freelance platforms, we focus on quality over quantity. 
              Every task is curated, every submission is reviewed, and every connection 
              is meaningful. Our streamlined process saves time for both clients and 
              designers, allowing creativity to flourish without bureaucratic overhead.
            </p>
          </div>

          <div className="content-card">
            <div className="card-icon">🚀</div>
            <h2>Our Community</h2>
            <p>
              From UI/UX specialists and brand designers to illustrators and motion 
              graphics artists, DesignHub welcomes diverse creative talents. Whether 
              you're a seasoned professional or an emerging designer, our platform 
              provides the visibility and opportunities to grow your career and 
              portfolio.
            </p>
          </div>

          <div className="content-card">
            <div className="card-icon">🤝</div>
            <h2>Built for Transparency</h2>
            <p>
              We believe in clear communication and fair practices. All project details 
              are visible upfront—scope, budget, timeline, and expectations. Designers 
              can set their own rates and choose projects that align with their 
              expertise and interests, creating win-win collaborations.
            </p>
          </div>

          <div className="content-card">
            <div className="card-icon">🌟</div>
            <h2>Join the Movement</h2>
            <p>
              DesignHub is more than a platform—it's a community dedicated to elevating 
              design work and recognizing creative talent. Whether you're posting your 
              first task or your hundredth submission, we're here to support meaningful 
              connections that lead to exceptional design outcomes.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Explore current design opportunities and connect with amazing creative talent today.</p>
        <a href="/" className="cta-button">Browse Open Tasks</a>
      </section>
    </div>
  );
};

export default About;
