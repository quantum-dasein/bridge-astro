const form = document.querySelector("#applyForm");
const note = document.querySelector("#formNote");
const submitButton = form.querySelector("button[type='submit']");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
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
    note.textContent = "Спасибо! Заявка отправлена. Мы свяжемся с вами.";
    submitButton.textContent = "Заявка отправлена";
  } catch (error) {
    note.textContent = "Не удалось отправить заявку автоматически. Напишите нам в Telegram или на email: mail@lkbelousova.ru.";
    submitButton.disabled = false;
    submitButton.textContent = "Отправить заявку";
  }
});