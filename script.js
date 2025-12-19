const form = document.getElementById("resumeForm");
const preview = document.getElementById("preview");

form.addEventListener("submit", async function(e){
  e.preventDefault();

  const name = form.querySelectorAll("input")[0].value;
  const contact = form.querySelectorAll("input")[1].value;
  const experience = form.querySelector("textarea").value;

  const prompt = `Составь профессиональное резюме для:
Имя: ${name},
Контакт: ${contact},
Опыт и цели: ${experience}.
Сделай красиво, коротко, готово для PDF, правдиво.`;

  preview.innerHTML = "Генерация резюме... ⏳";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ТОКЕН_НАВ"  // твой токен OpenAI
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
        max_tokens: 600
      })
    });

    const data = await response.json();
    const resumeText = data.choices[0].message.content;

    preview.innerHTML = `<pre>${resumeText}</pre>`;

    // Отправка Telegram
    const message = `📝 Новая заявка с сайта
👤 Имя: ${name}
📩 Контакт: ${contact}
💼 Резюме: ${resumeText}`;

    fetch("https://api.telegram.org/bot8549707158:AAHZcjYx1QbfVA8rWv39WsuZeBoMDIM83M8/sendMessage", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({chat_id: "7301555090", text: message})
    })
    .then(res => console.log("Telegram отправлено!"))
    .catch(err => console.error("Ошибка Telegram:", err));

  } catch (err) {
    preview.innerHTML = "Ошибка при генерации резюме.";
    console.error(err);
  }
});

