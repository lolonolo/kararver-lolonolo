document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sideMenu = document.getElementById('side-menu');
    const profileScreen = document.getElementById('profile-selection-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const profileOptionsContainer = document.getElementById('profile-options-container');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const infoBoxEl = document.getElementById('info-box');

    let userProfile = 'lise';
    let quizQuestions = [];
    let currentQuestionIndex = 0;

    const liseQuestions = [
        {
            question: "Nasıl bir üniversite hayatı hedefliyorsun?",
            key: "egitim-turu", // Alt çizgi, tire ile değiştirildi.
            info: "💡 **Pro-Tip:** Örgün eğitim, sosyal bir kampüs hayatı sunarken; Açıköğretim, çalışan veya kendi zamanını yönetmek isteyenler için büyük esneklik sağlar. İkisinin de YKS puanıyla öğrenci aldığını unutma!",
            options: [
                { text: "Kampüse gidip derslere katılmak (Örgün Eğitim)", value: "orgun" },
                { text: "Kendi zamanımı yöneterek, evden okumak (Açıköğretim)", value: "acikogretim" }
            ]
        },
    ];

    hamburgerBtn.addEventListener('click', () => sideMenu.classList.toggle('is-open'));

    startQuizBtn.addEventListener('click', () => {
        const selectedProfile = document.querySelector('input[name="user_profile"]:checked');
        if (selectedProfile) {
            userProfile = selectedProfile.value;
            profileScreen.style.display = 'none';
            quizScreen.style.display = 'block';
            initializeWizard();
        } else {
            alert("Lütfen başlamak için bir durum seçin.");
        }
    });

    optionsContainerEl.addEventListener('click', (e) => {
        const label = e.target.closest('.option-label');
        if (label) {
            document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
            label.classList.add('selected');
            const radio = label.querySelector('input[type="radio"]');
            if (radio) {
                const questionKey = quizQuestions[currentQuestionIndex].key;
                loadInfoContent(questionKey, radio.value);
            }
        }
    });

    function initializeWizard() {
        if (userProfile === 'lise') {
            quizQuestions = liseQuestions;
        } else {
            alert("Bu profil için anket yakında eklenecektir.");
            quizScreen.style.display = 'none';
            profileScreen.style.display = 'block';
            return;
        }
        currentQuestionIndex = 0;
        showQuestion();
    }

    function showQuestion() {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        questionTextEl.textContent = currentQuestion.question;
        
        optionsContainerEl.innerHTML = '';
        currentQuestion.options.forEach(option => {
            const label = document.createElement('label');
            label.className = 'option-label';
            label.innerHTML = `<input type="radio" name="q${currentQuestionIndex}" value="${option.value}"><span>${option.text}</span>`;
            optionsContainerEl.appendChild(label);
        });

        if (currentQuestion.info) {
            infoBoxEl.innerHTML = currentQuestion.info;
            infoBoxEl.style.display = 'block';
        } else {
            infoBoxEl.style.display = 'none';
        }
    }

    async function loadInfoContent(questionKey, optionValue) {
        const filePath = `content/${questionKey}/${optionValue}.html`;
        try {
            const response = await fetch(filePath);
            if (!response.ok) { throw new Error('Dosya bulunamadı.'); }
            const content = await response.text();
            infoBoxEl.innerHTML = content;
            infoBoxEl.style.display = 'block';
        } catch (error) {
            console.error("Bilgi içeriği yüklenemedi:", error);
            const currentQuestion = quizQuestions[currentQuestionIndex];
            if (currentQuestion.info) {
                 infoBoxEl.innerHTML = currentQuestion.info;
            } else {
                infoBoxEl.style.display = 'none';
            }
        }
    }
});
