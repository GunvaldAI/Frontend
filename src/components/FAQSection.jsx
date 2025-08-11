import React from 'react';

/**
 * FAQSection component
 *
 * Renders a list of frequently asked questions using native HTML
 * <details>/<summary> elements for built‑in toggling. Each FAQ item
 * should have a `question` and an `answer`. If no FAQs are provided,
 * a sensible default list is used. Tailwind classes style the
 * component consistently.
 *
 * Props:
 * - heading: section heading
 * - faqs: array of { question, answer }
 */
function FAQSection({
  heading = 'Usein kysytyt kysymykset',
  faqs = [
    {
      question: 'Miten Gunvald toimii?',
      answer:
        'Gunvald käyttää tekoälyä luodakseen sinulle viikkosuunnitelmia ja valmiita postauksia, jotka voidaan ajastaa sosiaaliseen mediaan.',
    },
    {
      question: 'Voinko muokata brändiäni?',
      answer:
        'Kyllä. Voit määrittää yrityksen nimen, toimialan, kohderyhmät, äänen sävyn, värit ja logon.',
    },
    {
      question: 'Mitä kanavia tuette?',
      answer:
        'Tavoitteenamme on tukea kaikkia suosittuja sosiaalisen median kanavia kuten Facebook, Instagram ja TikTok. Alkuun saatavilla on kuitenkin rajattu valikoima.',
    },
  ],
}) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {heading}
        </h3>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="bg-white rounded-lg shadow p-4 cursor-pointer"
            >
              <summary className="font-semibold text-gray-800">
                {faq.question}
              </summary>
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;