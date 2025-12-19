const form = document.querySelector("form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = form.querySelectorAll("input")[0].value;
  const contact = form.querySelectorAll("input")[1].value;
  const position = form.querySelector("textarea").value;

  const message = `
📝 Новая заявка с сайта
👤 Имя: ${name}
📩 Контакт: ${contact}
💼 Должность: ${position}
`;

  fetch("https://api.telegram.org/bot8549707158:AAEti3VxFm1fW0x9pmgacNcUfeDWbnXsMJE/sendMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: "7301555090",
      text: message,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Заявка отправлена! Я скоро свяжусь с вами 😊");
        form.reset();
      } else {
        alert("Ошибка отправки. Попробуйте позже.");
      }
    })
    .catch(() => {
      alert("Ошибка соединения.");
    });
});
