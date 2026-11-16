const form = document.getElementById('inquiry');
const status = document.getElementById('form-status');
const button = form.querySelector('button');
const english = document.documentElement.lang === 'en';
let submissionId = crypto.randomUUID();
const labels = english ? {
  sending: 'Sending…', success: 'Thank you! Your enquiry has been received. We will contact you by email.',
  error: 'Your enquiry could not be sent. Please try again or email bridgeconsultuzb@gmail.com.',
} : {
  sending: 'Отправляем…', success: 'Спасибо! Заявка принята. Мы свяжемся с вами по электронной почте.',
  error: 'Не удалось отправить заявку. Попробуйте ещё раз или напишите на bridgeconsultuzb@gmail.com.',
};
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
      body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), submission_id: submissionId, language: english ? 'en' : 'ru' }),
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
