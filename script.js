const form = document.getElementById("resumeForm");
const preview = document.getElementById("preview");
const downloadBtn = document.getElementById("downloadPDF");

// Language switch
const btnLang = document.getElementById("btn-lang");
let isEnglish = false;
btnLang.addEventListener("click", () => {
  isEnglish = !isEnglish;
  document.getElementById("hero-title").innerText = isEnglish ? "AI Resume Generator" : "AI Резюме Соз Онлайн";
  document.getElementById("hero-desc").innerText = isEnglish ? "Create a professional resume in seconds!" : "Создай профессиональное резюме за несколько секунд!";
  document.getElementById("form-title").innerText = isEnglish ? "Create Resume" : "Создать резюме";
  document.getElementById("label-name").innerText = isEnglish ? "Name:" : "Имя / Name:";
  document.getElementById("label-contact").innerText = isEnglish ? "Contact (Phone / Telegram / Email):" : "Контакт (Телефон / Telegram / Email):";
  document.getElementById("label-exp").innerText = isEnglish ? "Experience / Motivation:" : "Опыт / Мотивация / Experience / Motivation:";
  document.getElementById("submit-btn").innerText = isEnglish ? "Create Resume" : "Создать резюме / Create Resume";
  downloadBtn.innerText = isEnglish ? "Download PDF" : "Скачать PDF / Download PDF";
  btnLang.innerText = isEnglish ? "RU" : "EN";
});

// Form submit
form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const name = form.querySelectorAll("input")[0].value;
  const contact = form.querySelectorAll("input")[1].value;
  const experience = form.querySelector("textarea").value;

  preview.innerHTML = isEnglish ? "Generating resume... ⏳" : "Генерация резюме... ⏳";

  try{
    const prompt = `Write a professional resume${isEnglish?"":" на русском"} for:
Name: ${name},
Contact: ${contact},
Experience and goals: ${experience}.
Make it neat, professional, and ready for PDF.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer ТОКЕН_НАВ" // вставь свой OpenAI токен
      },
      body: JSON.stringify({
        model:"gpt-3.5-turbo",
        messages:[{role:"user", content:prompt}],
        max_tokens:600
      })
    });
    const data = await response.json();
    const resumeText = data.choices[0].message.content;
    preview.innerHTML = `<pre>${resumeText}</pre>`;

    // Telegram
    const message = `📝 New Resume Submission
👤 Name: ${name}
📩 Contact: ${contact}
💼 Resume: ${resumeText}`;
    fetch("https://api.telegram.org/bot8549707158:AAHZcjYx1QbfVA8rWv39WsuZeBoMDIM83M8/sendMessage",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({chat_id:"7301555090", text:message})
    }).then(res=>console.log("Telegram sent!")).catch(err=>console.error("Telegram error:", err));

  }catch(err){
    preview.innerHTML = isEnglish ? "Error generating resume." : "Ошибка при генерации резюме.";
    console.error(err);
  }
});

// PDF download
downloadBtn.addEventListener("click", ()=>{
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(preview.innerText, 10,10);
  doc.save("resume.pdf");
});
