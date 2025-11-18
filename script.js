document.addEventListener("DOMContentLoaded", () => {

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

    function resetBallToEight() {
        number.textContent = "8";
        number.style.color = "#534DBD";
        number.style.fontSize = "52pt";
        number.style.display = "";
        number.style.flexDirection = "";
        number.style.justifyContent = "";
        number.style.alignItems = "";
        number.style.textAlign = "";
    }

    async function loadTranslations() {
        if (!Object.keys(translations).length) {
            try {
                const response = await fetch('translations.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                translations = await response.json();
            } catch (e) {
                console.error("Error loading translations.json:", e);
            }
        }
    }

    async function loadLang(lang) {
        await loadTranslations();

        const langData = translations[lang];
        if (!langData) return;

        currentLang = lang;
        langToggle.src = flagImages[lang];

        document.documentElement.setAttribute('lang', lang);

        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = langData[key] || key;
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            el.placeholder = langData[key] || key;
        });

        localStorage.setItem("lang", lang);
    }

    function getRandomAnswer(lang) {
        const answers = translations[lang].answers;
        const index = Math.floor(Math.random() * answers.length);
        return answers[index];
    }

    function setAnswerText(text) {
        const words = text.split(" ");
        number.innerHTML = words.join("<br>");

        Object.assign(number.style, {
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
        });

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

    function shakeAndAnswer() {
        if (!btn.disabled) {
            ball.classList.add('shake', 'glow');
            setTimeout(() => {
                ball.classList.remove('shake', 'glow');
                const answer = getRandomAnswer(currentLang);
                setAnswerText(answer);
            }, 400);
        }
    }

    input.addEventListener('input', () => {
        const hasText = input.value.trim() !== "";
        btn.disabled = !hasText;
        btn.classList.toggle('active-btn', hasText);
        input.classList.toggle('active-border', hasText);
        ball.classList.toggle('active', hasText);
        ball.classList.toggle('inactive', !hasText);

        if (!hasText) {
            resetBallToEight();
        }
    });

    btn.addEventListener('click', shakeAndAnswer);
    ball.addEventListener('click', shakeAndAnswer);

    langToggle.addEventListener("click", async () => {
        const currentIndex = languages.indexOf(currentLang);
        const nextIndex = (currentIndex + 1) % languages.length;
        const newLang = languages[nextIndex];

        await loadLang(newLang);
    });

    loadLang(currentLang);
    resetBallToEight();
});
