document.addEventListener('DOMContentLoaded', () => {
    const quizScreen = document.getElementById('quiz-screen');
    const profileScreen = document.getElementById('profile-selection-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const infoBoxEl = document.getElementById('info-box');

    let userProfile = 'lise';
    let quizFlow = {};
    let currentQuestionNode = {};
    let userAnswers = {};

    const quizData = {
        lise: [
            { id: 'start', question: "Nasıl bir üniversite hayatı hedefliyorsun?", key: "egitim_turu", info: "💡 Örgün eğitim sosyal bir kampüs hayatı sunarken; Açıköğretim daha fazla esneklik ve disiplin gerektirir.", options: [ { text: "Kampüse gidip derslere katılmak (Örgün Eğitim)", value: "orgun" }, { text: "Kendi zamanımı yöneterek, evden okumak (Açıköğretim)", value: "acikogretim" } ], next: (answer) => answer === 'acikogretim' ? 'acikogretim_universiteleri' : 'holland_test_1' },
            { id: 'acikogretim_universiteleri', question: "Harika! Peki hangi Açıköğretim Fakültesi ile daha çok ilgileniyorsun?", key: "okul", info: "💡 Her üniversitenin kendine özgü bölümleri ve sistemleri olabilir.", options: [ { text: "Anadolu Üniversitesi (AÖF)", value: "anadolu" }, { text: "İstanbul Üniversitesi (AUZEF)", value: "auzef" }, { text: "Atatürk Üniversitesi (ATA-AÖF)", value: "ata-aof" } ], next: () => 'holland_test_1' },
            { id: 'holland_test_1', question: "Hangisi sana daha çekici geliyor?", key: "holland_1", info: "💡 Bu test, ilgi alanlarını ve kişilik tipini anlamamıza yardımcı olacak.", options: [ { text: "Bir makinenin nasıl çalıştığını anlamak.", value: "R" }, { text: "Birine sorununu çözmede yardım etmek.", value: "S" } ], next: () => null }
        ]
    };

    startQuizBtn.addEventListener('click', () => {
        userProfile = document.querySelector('input[name="user_profile"]:checked').value;
        profileScreen.style.display = 'none';
        quizScreen.style.display = 'block';
        initializeWizard();
    });

    function initializeWizard() {
        quizFlow = quizData[userProfile];
        userAnswers = {};
        showQuestionById('start');
    }

    function showQuestionById(id) {
        currentQuestionNode = quizFlow.find(q => q.id === id);
        if (!currentQuestionNode) {
            // Anket bitti, sonuçları göster
            alert("Anket bitti! Cevaplar: " + JSON.stringify(userAnswers));
            quizScreen.style.display = 'none';
            profileScreen.style.display = 'block';
            return;
        }

        questionTextEl.textContent = currentQuestionNode.question;
        optionsContainerEl.innerHTML = '';
        currentQuestionNode.options.forEach(option => {
            const label = document.createElement('label');
            label.className = 'option-label';
            label.innerHTML = `<input type="radio" name="${currentQuestionNode.key}" value="${option.value}"><span>${option.text}</span>`;
            optionsContainerEl.appendChild(label);
        });

        if (currentQuestionNode.info) {
            infoBoxEl.innerHTML = currentQuestionNode.info;
            infoBoxEl.style.display = 'block';
        } else {
            infoBoxEl.style.display = 'none';
        }

        nextBtn.textContent = currentQuestionNode.next(null) === null ? 'Sonuçları Gör ✨' : 'Sonraki Soru →';
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
            infoBoxEl.innerHTML = quizFlow.find(q => q.key === questionKey)?.info || '';
        }
    }

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
});
