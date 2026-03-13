import { useState } from 'react';

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('Thanks! Your message has been submitted (frontend demo).');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="page">
      <section className="content-card glass-panel">
        <h1>Contact</h1>
        <p className="lead-text">Have feedback or feature requests? Send a quick message below.</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              required
            />
          </label>

          <label>
            Message
            <textarea
              rows="5"
              value={form.message}
              onChange={(event) => updateField('message', event.target.value)}
              required
            />
          </label>

          <button type="submit" className="hero-cta">
            Submit Message
          </button>
        </form>

        {status ? <p className="status-note">{status}</p> : null}
      </section>
    </div>
  );
}

export default ContactPage;