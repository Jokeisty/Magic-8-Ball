const input = document.querySelector('.form');
const btn = document.querySelector('.btn');
const ball = document.querySelector('.ball-main');
const number = document.querySelector('.number');
const langToggle = document.getElementById("lang-toggle");

let translations = {};
const languages = ["de", "en", "ru"];
const flagImages = {
    de: "flags/de.svg",
    en: "flags/en.svg",
    ru: "flags/ru.svg"
};

let currentLang = localStorage.getItem("lang") || "de";
langToggle.src = flagImages[currentLang];

// Загрузка переводов
async function loadTranslations() {
    if (!Object.keys(translations).length) {
        const response = await fetch("/lang.json");
        translations = await response.json();
    }
}

// Применение языка
async function loadLang(lang) {
    await loadTranslations();

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = translations[lang][key] || key;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        el.placeholder = translations[lang][key] || key;
    });

    localStorage.setItem("lang", lang);
}

// Получение случайного ответа на выбранном языке
function getRandomAnswer() {
    const lang = currentLang;
    const answers = translations[lang].answers;
    const index = Math.floor(Math.random() * answers.length);
    return answers[index];
}

// Отображение текста в шаре
function setAnswerText(text) {
    const words = text.split(" ");
    number.innerHTML = words.join("<br>");
    number.style.color = "white";
    number.style.display = "flex";
    number.style.flexDirection = "column";
    number.style.justifyContent = "center";
    number.style.alignItems = "center";
    number.style.textAlign = "center";

    let fontSize = 24;
    number.style.fontSize = fontSize + "px";
    const parent = number.parentElement;
    const maxWidth = parent.clientWidth * 0.7;
    const maxHeight = parent.clientHeight * 0.7;

    while ((number.scrollWidth > maxWidth || number.scrollHeight > maxHeight) && fontSize > 8) {
        fontSize -= 1;
        number.style.fontSize = fontSize + "px";
    }
}

// Анимация шара
function shakeAndAnswer() {
    if (!btn.disabled) {
        ball.classList.add('shake', 'glow');
        setTimeout(() => {
            ball.classList.remove('shake', 'glow');
            const answer = getRandomAnswer();
            setAnswerText(answer);
        }, 400);
    }
}

// События для инпута и кнопки
input.addEventListener('input', () => {
    const hasText = input.value.trim() !== "";
    btn.disabled = !hasText;
    btn.classList.toggle('active-btn', hasText);
    input.classList.toggle('active-border', hasText);
    ball.classList.toggle('active', hasText);
    ball.classList.toggle('inactive', !hasText);

    if (!hasText) number.textContent = "8";
});

btn.addEventListener('click', shakeAndAnswer);
ball.addEventListener('click', shakeAndAnswer);

// Переключение языка через флаг
langToggle.addEventListener("click", async () => {
    const currentIndex = languages.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % languages.length;
    currentLang = languages[nextIndex];
    langToggle.src = flagImages[currentLang];
    await loadLang(currentLang);
});

// Начальная загрузка языка
loadLang(currentLang);
