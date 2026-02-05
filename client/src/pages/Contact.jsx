import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setStatus("success");
    setTimeout(() => {
      setStatus("");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="page-container contact-page">
      <div className="hero-section">
        <h1 className="page-title">Get in Touch</h1>
        <p className="page-subtitle">
          Have questions, feedback, or partnership inquiries? We'd love to hear from you.
        </p>
      </div>

      <div className="contact-layout">
        <section className="contact-info">
          <h2>Connect With Us</h2>
          <p className="info-intro">
            Whether you're a designer with questions about submitting work, a business 
            looking to post opportunities, or simply want to learn more about DesignHub, 
            our team is here to help.
          </p>

          <div className="info-cards">
            <div className="info-item">
              <div className="info-icon">📧</div>
              <h3>Email Support</h3>
              <p>support@designhub.com</p>
              <span className="info-detail">Response within 24 hours</span>
            </div>

            <div className="info-item">
              <div className="info-icon">💼</div>
              <h3>Business Inquiries</h3>
              <p>business@designhub.com</p>
              <span className="info-detail">Partnership opportunities</span>
            </div>

            <div className="info-item">
              <div className="info-icon">🎨</div>
              <h3>Designer Relations</h3>
              <p>designers@designhub.com</p>
              <span className="info-detail">Portfolio reviews & guidance</span>
            </div>

            <div className="info-item">
              <div className="info-icon">🌐</div>
              <h3>Social Media</h3>
              <p>@DesignHubHQ</p>
              <span className="info-detail">Follow us for updates</span>
            </div>
          </div>

          <div className="faq-preview">
            <h3>Common Questions</h3>
            <ul>
              <li>
                <strong>How do I submit my work?</strong> Browse open tasks and click 
                "Submit Your Work" on any project that interests you.
              </li>
              <li>
                <strong>Are there any fees?</strong> DesignHub is free for designers to 
                submit their work and connect with opportunities.
              </li>
              <li>
                <strong>How do payments work?</strong> All payments and agreements are 
                handled directly between clients and selected designers.
              </li>
              <li>
                <strong>Can I update my submission?</strong> Yes, you can resubmit with 
                updated portfolio samples anytime before the deadline.
              </li>
            </ul>
          </div>
        </section>

        <section className="contact-form-section">
          <div className="form-container">
            <h2>Send Us a Message</h2>
            <p>Fill out the form below and we'll get back to you as soon as possible.</p>

            {status === "success" && (
              <div className="alert alert-success">
                <strong>Message sent!</strong> We'll respond to your inquiry shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="name">Your Name</label>
              </div>

              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="email">Email Address</label>
              </div>

              <div className="input-group">
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="subject">Subject</label>
              </div>

              <div className="input-group">
                <textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder=" "
                ></textarea>
                <label htmlFor="message">Your Message</label>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
