import { useState } from 'react';

const faqItems = [
  {
    question: 'Is this password generator safe?',
    answer: 'Yes. Passwords are generated in your browser and are not sent to external servers by this frontend tool.'
  },
  {
    question: 'Are passwords stored?',
    answer: 'Generated passwords are stored only in your local browser history list if you use the history feature.'
  },
  {
    question: 'How are passwords generated?',
    answer: 'The app combines selected character sets and randomly picks characters until your target length is reached.'
  },
  {
    question: 'Can I use this on mobile?',
    answer: 'Yes. The UI is fully responsive for desktop, tablet, and mobile screens.'
  }
];

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="page">
      <section className="content-card glass-panel">
        <h1>Frequently Asked Questions</h1>
        <div className="faq-list">
          {faqItems.map((item, index) => (
            <article key={item.question} className="faq-item">
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
                aria-expanded={openIndex === index}
              >
                <span>{item.question}</span>
                <span>{openIndex === index ? '-' : '+'}</span>
              </button>
              {openIndex === index ? <p>{item.answer}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default FAQPage;