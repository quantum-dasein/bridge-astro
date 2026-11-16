const form = document.getElementById('inquiry');
const status = document.getElementById('form-status');
const button = form.querySelector('button');
const lang = (document.documentElement.lang || 'ru').slice(0, 2);
let submissionId = crypto.randomUUID();
const allLabels = {
  ru: {
    sending: 'Отправляем…', success: 'Спасибо! Заявка принята. Мы свяжемся с вами по электронной почте.',
    error: 'Не удалось отправить заявку. Попробуйте ещё раз или напишите на bridgeconsultuzb@gmail.com.',
  },
  en: {
    sending: 'Sending…', success: 'Thank you! Your enquiry has been received. We will contact you by email.',
    error: 'Your enquiry could not be sent. Please try again or email bridgeconsultuzb@gmail.com.',
  },
  de: {
    sending: 'Wird gesendet…', success: 'Vielen Dank! Ihre Anfrage ist eingegangen. Wir melden uns per E-Mail bei Ihnen.',
    error: 'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie an bridgeconsultuzb@gmail.com.',
  },
  uz: {
    sending: 'Yuborilmoqda…', success: 'Rahmat! Arizangiz qabul qilindi. Siz bilan elektron pochta orqali bog‘lanamiz.',
    error: 'Arizani yuborib bo‘lmadi. Qaytadan urinib ko‘ring yoki bridgeconsultuzb@gmail.com manziliga yozing.',
  },
};
const labels = allLabels[lang] || allLabels.ru;
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (button.disabled || !form.reportValidity()) return;
  const originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = labels.sending;
  status.textContent = labels.sending;
  form.setAttribute('aria-busy', 'true');
  try {
    const response = await fetch('/api/germany-apply', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), submission_id: submissionId, language: lang }),
      signal: AbortSignal.timeout(20000),
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error('delivery_failed');
    form.reset();
    submissionId = crypto.randomUUID();
    status.textContent = labels.success;
  } catch {
    status.textContent = labels.error;
  } finally {
    button.disabled = false;
    button.textContent = originalLabel;
    form.removeAttribute('aria-busy');
  }
});
