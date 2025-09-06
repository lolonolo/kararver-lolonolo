document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTLER ---
    const profileScreen = document.getElementById('profile-selection-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const infoBoxEl = document.getElementById('info-box');
    const progressBar = document.getElementById('progress-bar');
    
    // --- DEĞİŞKENLER VE SORU AKIŞI ---
    let userProfile = 'lise';
    let currentQuestionNode = {};
    let userAnswers = {};

    const quizData = {
        lise: [
            { 
                id: 'start', 
                question: "Nasıl bir üniversite hayatı hedefliyorsun?", 
                key: "egitim-turu", 
                info: "💡 Örgün eğitim sosyal bir kampüs hayatı sunarken; Açıköğretim daha fazla esneklik ve disiplin gerektirir.", 
                options: [ 
                    { text: "Kampüse gidip derslere katılmak (Örgün Eğitim)", value: "orgun" }, 
                    { text: "Kendi zamanımı yöneterek, evden okumak (Açıköğretim)", value: "acikogretim" } 
                ],
                next: (answer) => answer === 'acikogretim' ? 'acikogretim_universiteleri' : 'henuz_hazir_degil' 
            },
            { 
                id: 'acikogretim_universiteleri', 
                question: "Harika! Peki hangi Açıköğretim Fakültesi ile daha çok ilgileniyorsun?", 
                key: "acikogretim-universiteleri",
                info: "💡 Her üniversitenin kendine özgü bölümleri ve sistemleri olabilir.", 
                options: [ 
                    { text: "Anadolu Üniversitesi (AÖF)", value: "anadolu" }, 
                    { text: "İstanbul Üniversitesi (AUZEF)", value: "auzef" }, 
                    { text: "Atatürk Üniversitesi (ATA-AÖF)", value: "ata-aof" } 
                ], 
                next: () => 'henuz_hazir_degil' // Bir sonraki adımda burayı dolduracağız
            },
            { 
                id: 'henuz_hazir_degil', 
                question: "Bu dal henüz yapım aşamasında!", 
                key: "bitti", 
                options: [], 
                next: () => null 
            }
        ]
    };

    // --- OLAY DİNLEYİCİLER ---
    startQuizBtn.addEventListener('click', () => {
        userProfile = document.querySelector('input[name="user_profile"]:checked').value;
        profileScreen.style.display = 'none';
        quizScreen.style.display = 'block';
        initializeWizard();
    });

    optionsContainerEl.addEventListener('click', (e) => {
        const label = e.target.closest('.option-label');
        if (label) {
            document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
            label.classList.add('selected');
            const radio = label.querySelector('input[type="radio"]');
            if (radio) { loadInfoContent(currentQuestionNode.key, radio.value); }
        }
    });

    nextBtn.addEventListener('click', () => {
        const selectedOption = optionsContainerEl.querySelector(`input[name="${currentQuestionNode.key}"]:checked`);
        if (!selectedOption) {
            alert("Lütfen bir seçenek belirleyin.");
            return;
        }
        userAnswers[currentQuestionNode.key] = selectedOption.value;
        const nextQuestionId = currentQuestionNode.next(selectedOption.value);
        showQuestionById(nextQuestionId);
    });

    // --- ANA FONKSİYONLAR ---
    function initializeWizard() {
        userAnswers = {};
        showQuestionById('start');
    }

    function showQuestionById(id) {
        currentQuestionNode = quizData[userProfile].find(q => q.id === id);
        if (!currentQuestionNode) {
            alert("Bu dalın sonuna geldik!");
            quizScreen.style.display = 'none';
            profileScreen.style.display = 'block';
            return;
        }

        questionTextEl.textContent = currentQuestionNode.question;
        optionsContainerEl.innerHTML = '';
        infoBoxEl.style.display = 'none';

        if(currentQuestionNode.options.length > 0) {
            currentQuestionNode.options.forEach(option => {
                const label = document.createElement('label');
                label.className = 'option-label';
                label.innerHTML = `<input type="radio" name="${currentQuestionNode.key}" value="${option.value}"><span>${option.text}</span>`;
                optionsContainerEl.appendChild(label);
            });
        }

        if (currentQuestionNode.info) {
            infoBoxEl.innerHTML = currentQuestionNode.info;
            infoBoxEl.style.display = 'block';
        }

        const questionIndex = quizData[userProfile].findIndex(q => q.id === id);
        const progress = ((questionIndex + 1) / quizData[userProfile].length) * 100;
        progressBar.style.width = `${progress}%`;
        nextBtn.textContent = currentQuestionNode.next(null) === null ? 'Bitir' : 'Sonraki Soru →';
    }

    async function loadInfoContent(questionKey, optionValue) {
        const filePath = `content/${questionKey}/${optionValue}/${optionValue}.html`;
        try {
            const response = await fetch(filePath);
            if (!response.ok) { throw new Error('Dosya bulunamadı.'); }
            const content = await response.text();
            infoBoxEl.innerHTML = content;
            infoBoxEl.style.display = 'block';
        } catch (error) {
            console.error("Bilgi içeriği yüklenemedi:", error);
            infoBoxEl.style.display = 'none';
        }
    }
});
