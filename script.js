const form = document.getElementById("resumeForm");
const preview = document.getElementById("preview");

form.addEventListener("submit", async function(e){
  e.preventDefault();
  const name = form.querySelectorAll("input")[0].value;
  const contact = form.querySelectorAll("input")[1].value;
  const experience = form.querySelector("textarea").value;

  preview.innerHTML = "Генерация резюме... ⏳";

  // AI генерация (OpenAI API)
  try {
    const prompt = `Составь профессиональное резюме:
Имя: ${name},
Контакт: ${contact},
Опыт и цели: ${experience}.
Сделай красиво и готово для PDF.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ТОКЕН_НАВ" // вставь свой OpenAI токен
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

    // Telegram
    const telegramMessage = `📝 Новая заявка
👤 Имя: ${name}
📩 Контакт: ${contact}
💼 Резюме: ${resumeText}`;

    fetch("https://api.telegram.org/bot8549707158:AAHZcjYx1QbfVA8rWv39WsuZeBoMDIM83M8/sendMessage", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({chat_id: "7301555090", text: telegramMessage})
    }).then(res => console.log("Telegram отправлено!"))
      .catch(err => console.error("Ошибка Telegram:", err));

  } catch (err) {
    preview.innerHTML = "Ошибка при генерации резюме.";
    console.error(err);
  }
});

// PDF download
document.getElementById("downloadPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(preview.innerText, 10, 10);
  doc.save("resume.pdf");
});
