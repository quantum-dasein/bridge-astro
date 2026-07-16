// ─── КУДА ПРИХОДЯТ ЗАЯВКИ ────────────────────────────────────────────────────
// Впишите сюда ID формы Formspree, зарегистрированной на почту, которая должна
// получать заявки (formspree.io → New form → ID из ссылки formspree.io/f/XXXXXXXX).
// Пока пусто — заявка уходит письмом на LEAD_EMAIL через почтовый клиент.
// НЕ подставлять чужой ID: до 16.07.2026 здесь стоял "mqevypwj" — существующая
// форма, принадлежащая постороннему; все заявки уходили ему, а не нам.
const FORMSPREE_ID = "";
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

// Без JS форма не должна никуда уходить, поэтому action ставится здесь.
if (form && FORMSPREE_ID) {
  form.action = `https://formspree.io/f/${FORMSPREE_ID}`;
}

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

    if (!FORMSPREE_ID) {
      window.location.href = buildMailto(data);
      trackEvent("lead_form_mailto", { form_id: "summer_school_georgia_2026" });
      note.textContent = `Откроется письмо на ${LEAD_EMAIL} — отправьте его, и мы свяжемся с вами. Если письмо не открылось, напишите нам в Телеграм.`;
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Отправляем...";
    note.textContent = "Отправляем заявку на email.";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error("Formspree request failed");
      }

      form.reset();
      trackEvent("lead_form_success", {
        form_id: "summer_school_georgia_2026"
      });
      note.textContent = "Спасибо! Заявка отправлена. Мы свяжемся с вами.";
      submitButton.textContent = "Заявка отправлена";
    } catch (error) {
      trackEvent("lead_form_error", {
        form_id: "summer_school_georgia_2026"
      });
      note.textContent = `Не удалось отправить заявку автоматически. Напишите нам в Telegram или на email: ${LEAD_EMAIL}.`;
      submitButton.disabled = false;
      submitButton.textContent = "Отправить заявку";
    }
  });
}
