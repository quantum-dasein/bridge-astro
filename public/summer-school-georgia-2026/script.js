const form = document.querySelector("#applyForm");
const note = document.querySelector("#formNote");
const submitButton = form ? form.querySelector("button[type='submit']") : null;

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
      note.textContent = "Не удалось отправить заявку автоматически. Напишите нам в Telegram или на email: mail@lkbelousova.ru.";
      submitButton.disabled = false;
      submitButton.textContent = "Отправить заявку";
    }
  });
}
