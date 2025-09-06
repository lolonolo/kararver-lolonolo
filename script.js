document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTLER VE DEĞİŞKENLER ---
    const profileScreen = document.getElementById('profile-selection-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const infoBoxEl = document.getElementById('info-box');
    const progressBar = document.getElementById('progress-bar');
    let userProfile = 'lise';
    let currentQuestionNode = {};
    let userAnswers = {};

    // --- SORU VERİTABANI (contentPath özelliği eklendi) ---
    const quizData = {
        lise: [
            { 
                id: 'start', 
                question: "Nasıl bir üniversite hayatı hedefliyorsun?", 
                key: "egitim-turu", 
                contentPath: (val) => `content/egitim-turu/${val}.html`,
                next: (answer) => answer === 'acikogretim' ? 'acikogretim_universiteleri' : 'henuz_hazir_degil' 
            },
            { 
                id: 'acikogretim_universiteleri', 
                question: "Harika! Peki hangi Açıköğretim Fakültesi ile daha çok ilgileniyorsun?", 
                key: "acikogretim-universiteleri",
                contentPath: (val) => `content/acikogretim-universiteleri/${val}/${val}.html`,
                options: [ 
                    { text: "Anadolu Üniversitesi (AÖF)", value: "anadolu" }, 
                    { text: "İstanbul Üniversitesi (AUZEF)", value: "auzef" }, 
                    { text: "Atatürk Üniversitesi (ATA-AÖF)", value: "ata-aof" } 
                ], 
                next: (answer) => answer === 'auzef' ? 'auzef_bolumleri' : 'henuz_hazir_degil' 
            },
            { 
                id: 'auzef_bolumleri', 
                question: "AUZEF için hangi bölümü düşünüyorsun?", 
                key: "auzef-bolumleri",
                contentPath: (val) => `content/acikogretim-universiteleri/auzef/${val}.html`,
                info: "İlgilendiğin bölüm hakkında bilgi almak için üzerine tıkla.",
                options: [ 
                    { text: "Sosyoloji", value: "sosyoloji" },
                    { text: "Tarih", value: "tarih" },
                    { text: "Web Tasarımı ve Kodlama", value: "web-tasarimi-ve-kodlama" },
                    // ...diğer bölümler
                ], 
                next: () => null 
            },
            { id: 'henuz_hazir_degil', question: "Bu dal henüz yapım aşamasında!", key: "bitti", options: [], next: () => null }
        ]
    };
    
    // --- OLAY DİNLEYİCİLER VE ANA FONKSİYONLAR ---
    startQuizBtn.addEventListener('click', () => {
        userProfile = document.querySelector('input[name="user_profile"]:checked').value;
        profileScreen.style.display = 'none';
        quizScreen.style.display = 'block';
        initializeWizard();
    });

    function initializeWizard() {
        userAnswers = {};
        showQuestionById('start');
    }

    function showQuestionById(id) {
        currentQuestionNode = quizData[userProfile].find(q => q.id === id);
        if (!currentQuestionNode) {
            alert("Bu dalın sonuna ulaştık!");
            quizScreen.style.display = 'none';
            profileScreen.style.display = 'block';
            return;
        }

        questionTextEl.textContent = currentQuestionNode.question;
        optionsContainerEl.innerHTML = '';
        infoBoxEl.style.display = 'none';
        
        if (currentQuestionNode.info) {
            infoBoxEl.innerHTML = currentQuestionNode.info;
            infoBoxEl.style.display = 'block';
        }

        currentQuestionNode.options.forEach(option => {
            const label = document.createElement('label');
            label.className = 'option-label';
            label.innerHTML = `<input type="radio" name="${currentQuestionNode.key}" value="${option.value}"><span>${option.text}</span>`;
            optionsContainerEl.appendChild(label);
        });
        
        const questionIndex = quizData[userProfile].findIndex(q => q.id === id);
        const progress = ((questionIndex + 1) / (quizData[userProfile].length - 1)) * 100;
        progressBar.style.width = `${progress}%`;
        nextBtn.textContent = currentQuestionNode.next(null) === null ? 'Bitir' : 'Sonraki Soru →';
    }

    async function loadInfoContent(optionValue) {
        if (!currentQuestionNode.contentPath) return;

        const filePath = currentQuestionNode.contentPath(optionValue);
        try {
            const response = await fetch(filePath);
            if (!response.ok) { throw new Error(`Dosya bulunamadı: ${filePath}`); }
            const content = await response.text();
            infoBoxEl.innerHTML = content;
            infoBoxEl.style.display = 'block';
        } catch (error) {
            console.error("Bilgi içeriği yüklenemedi:", error);
            infoBoxEl.style.display = 'none';
        }
    }

    optionsContainerEl.addEventListener('click', (e) => {
        const label = e.target.closest('.option-label');
        if (label) {
            document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
            label.classList.add('selected');
            const radio = label.querySelector('input[type="radio"]');
            if (radio) { loadInfoContent(radio.value); }
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
});
