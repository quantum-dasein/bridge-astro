// ─── КУДА ПРИХОДЯТ ЗАЯВКИ ────────────────────────────────────────────────────
// Заявка уходит на свою функцию /api/apply (см. api/apply.js), а та рассылает
// её в Telegram и, если задан FORMSPREE_ID в переменных окружения Vercel,
// дублирует на почту. Ни токена бота, ни ID формы здесь быть не должно —
// всё, что лежит в этом файле, видно любому посетителю.
// Если функция недоступна, заявка не теряется: открывается письмо на LEAD_EMAIL.
const APPLY_ENDPOINT = "/api/apply";
const LEAD_EMAIL = "info@bridgeconsult.uz";
// ─────────────────────────────────────────────────────────────────────────────

const form = document.querySelector("#applyForm");
const note = document.querySelector("#formNote");
const submitButton = form ? form.querySelector("button[type='submit']") : null;

const FIELD_LABELS = {
  name: "Имя и фамилия",
  role: "Должность / организация",
  contact: "Контакт для ответа",
  programme: "На что заявка",
  participants: "Количество участников",
  cases_to_discuss: "Кейсы для обсуждения",
  message: "Комментарий"
};

function buildMailto(data) {
  const lines = Object.entries(FIELD_LABELS)
    .map(([field, label]) => [label, (data.get(field) || "").toString().trim()])
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`);

  const subject = "Заявка на Summer School Georgia 2026";
  const body = `${lines.join("\n")}\n\nОтправлено со страницы ${window.location.href}`;
  return `mailto:${LEAD_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function trackEvent(name, params = {}) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, {
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...params
  });
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href") || "";
  const label = link.textContent.trim().replace(/\s+/g, " ").slice(0, 120);

  if (href === "#apply") {
    trackEvent("cta_click", { link_text: label, cta_target: "apply" });
    return;
  }

  if (href.startsWith("mailto:")) {
    trackEvent("email_click", { link_text: label, contact_method: "email" });
    return;
  }

  if (href.startsWith("tel:")) {
    trackEvent("phone_click", { link_text: label, contact_method: "phone" });
    return;
  }

  if (href.includes("t.me/")) {
    trackEvent("telegram_click", { link_text: label, contact_method: "telegram" });
    return;
  }

  if (link.hostname && link.hostname !== window.location.hostname) {
    trackEvent("external_click", {
      link_text: label,
      link_domain: link.hostname,
      link_url: link.href
    });
  }
});

if (form && submitButton && note) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);

    trackEvent("lead_form_submit", {
      form_id: "summer_school_georgia_2026",
      participants: data.get("participants") || "",
      programme: data.get("programme") || ""
    });

    submitButton.disabled = true;
    submitButton.textContent = "Отправляем...";
    note.textContent = "Отправляем заявку.";

    try {
      const response = await fetch(APPLY_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error(`/api/apply вернул ${response.status}`);
      }

      form.reset();
      trackEvent("lead_form_success", {
        form_id: "summer_school_georgia_2026"
      });
      note.textContent = "Спасибо! Заявка отправлена. Мы свяжемся с вами.";
      submitButton.textContent = "Заявка отправлена";
    } catch (error) {
      // Функция недоступна — заявка не должна пропасть: отдаём её почтовому клиенту.
      trackEvent("lead_form_error", {
        form_id: "summer_school_georgia_2026"
      });
      window.location.href = buildMailto(data);
      note.textContent = `Не удалось отправить автоматически — откроется письмо на ${LEAD_EMAIL}, отправьте его. Или напишите нам в Телеграм.`;
      submitButton.disabled = false;
      submitButton.textContent = "Отправить заявку";
    }
  });
}
