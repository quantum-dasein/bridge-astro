// ─── КУДА ПРИХОДЯТ ЗАЯВКИ ────────────────────────────────────────────────────
// Как и на /summer-school-georgia-2026/, заявка уходит на свою функцию
// /api/apply (см. api/apply.js), а та рассылает её в Telegram и, если задан
// FORMSPREE_ID в переменных окружения Vercel, дублирует на почту. Ни токена
// бота, ни ID формы здесь быть не должно — всё, что лежит в этом файле, видно
// любому посетителю. Если функция недоступна, заявка не теряется: открывается
// письмо на LEAD_EMAIL.
//
// Один скрипт обслуживает RU/EN/UZ: подписи и тексты статусов берутся из
// data-атрибутов формы, чтобы не плодить три почти одинаковых файла.
const APPLY_ENDPOINT = "/api/apply";
const LEAD_EMAIL = "info@bridgeconsult.uz";
// ─────────────────────────────────────────────────────────────────────────────

const form = document.querySelector("#applyForm");
const note = document.querySelector("#formNote");
const submitButton = form ? form.querySelector("button[type='submit']") : null;

// ─── Шапка: прозрачная над фотографией героя, белая после скролла ────────────
const header = document.querySelector(".site-header");
if (header) {
  const sentinel = document.querySelector(".hero");
  const setStuck = () => {
    const past = sentinel
      ? sentinel.getBoundingClientRect().bottom <= header.offsetHeight
      : window.scrollY > 40;
    header.classList.toggle("is-stuck", past);
  };
  setStuck();
  window.addEventListener("scroll", setStuck, { passive: true });
  window.addEventListener("resize", setStuck);
}

// ─── Появление блоков при скролле ───────────────────────────────────────────
// Уважаем prefers-reduced-motion: там .reveal и так видим через CSS, поэтому
// просто ничего не навешиваем. Если IntersectionObserver недоступен —
// показываем всё сразу, контент важнее анимации.
const reveals = document.querySelectorAll(".reveal");
const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reveals.length && motionOk && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
  );
  reveals.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
    io.observe(el);
  });
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
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
    trackEvent("external_click", { link_text: label, link_domain: link.hostname, link_url: link.href });
  }
});

// Письмо-запасной вариант: подписи полей берём у самих <label>, поэтому оно
// автоматически выходит на языке страницы.
function buildMailto(data) {
  const lines = [];
  for (const field of form.querySelectorAll("input[name], select[name], textarea[name]")) {
    const name = field.getAttribute("name");
    if (!name || name.startsWith("_") || name === "hp_ref") continue;
    const value = (data.get(name) || "").toString().trim();
    if (!value) continue;
    const label = field.closest("label");
    const caption = label ? label.childNodes[0].textContent.trim() : name;
    lines.push(`${caption}: ${value}`);
  }
  const subject = form.dataset.subject || "Application";
  const body = `${lines.join("\n")}\n\n${form.dataset.sentFrom || "Sent from"} ${window.location.href}`;
  return `mailto:${LEAD_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

if (form && submitButton && note) {
  const idle = submitButton.textContent;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);

    trackEvent("lead_form_submit", {
      form_id: "academy_fidic_online",
      participants: data.get("participants") || "",
      programme: data.get("programme") || ""
    });

    submitButton.disabled = true;
    submitButton.textContent = form.dataset.sending || "Sending...";
    note.textContent = form.dataset.sendingNote || "";

    try {
      const response = await fetch(APPLY_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`/api/apply вернул ${response.status}`);

      form.reset();
      trackEvent("lead_form_success", { form_id: "academy_fidic_online" });
      note.textContent = form.dataset.successNote || "";
      submitButton.textContent = form.dataset.sent || idle;
    } catch (error) {
      // Функция недоступна — заявка не должна пропасть: отдаём её почтовому клиенту.
      trackEvent("lead_form_error", { form_id: "academy_fidic_online" });
      window.location.href = buildMailto(data);
      note.textContent = (form.dataset.errorNote || "").replace("{email}", LEAD_EMAIL);
      submitButton.disabled = false;
      submitButton.textContent = idle;
    }
  });
}
