document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTLER VE DEĞİŞKENLER (Aynı) ---
    const profileScreen = document.getElementById('profile-selection-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const infoBoxEl = document.getElementById('info-box');
    const progressBar = document.getElementById('progress-bar');
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');
    let userProfile = 'lise';
    let professions = [];
    let quizFlow = {};
    let currentQuestionNode = {};
    let userAnswers = {};
    const quizData = { /* ... (Aynı) ... */ };

    // --- ANA FONKSİYONLAR ---
    
    // YENİ: displayResults fonksiyonu tamamen değişti
    function displayResults(results) {
        questionContainer.style.display = 'none';
        nextBtn.style.display = 'none';
        
        let resultsHTML = '<h3>Verdiğin cevaplara göre sana en uygun 3 meslek:</h3>';
        
        results.forEach(result => {
            // Uyum puanını hesaplayalım (basit bir yüzde olarak)
            const matchScore = (result.score / Object.keys(userAnswers).length * 100).toFixed(0);

            // Neden önerildiğini gösteren etiketleri bulalım
            let tagsHTML = '';
            for (const key in userAnswers) {
                if (result[key] === userAnswers[key]) {
                    // Cevap metnini bulmak için soruyu ve seçeneği bul
                    const question = quizFlow.find(q => q.key === key);
                    const option = question.options.find(o => o.value === userAnswers[key]);
                    if(option) {
                        tagsHTML += `<span class="tag">${option.text.split('(')[0].trim()}</span>`;
                    }
                }
            }

            resultsHTML += `
                <div class="result-card">
                    <h4>${result.name}</h4>
                    <div class="match-score">Sana Uyum Puanı: %${matchScore} 🟢</div>
                    <p class="description">${result.description || 'Bu meslek hakkında yakında daha fazla bilgi eklenecek.'}</p>
                    <div class="tags-title">Neden Sana Uygun?</div>
                    <div class="tags">${tagsHTML}</div>
                    <button class="primary-btn details-btn">Bu Mesleği Detaylı İncele →</button>
                </div>
            `;
        });

        resultsHTML += '<button id="restart-btn" class="secondary-btn">‹ Ankete Başa Dön</button>';
        
        resultContainer.innerHTML = resultsHTML;
        resultContainer.style.display = 'block';
        progressBar.style.width = `100%`;

        document.getElementById('restart-btn').addEventListener('click', () => {
            quizScreen.style.display = 'none';
            profileScreen.style.display = 'block';
        });
    }

    // --- GERİ KALAN TÜM KODLAR ---
    // (Aşağıdaki tam sürümde hepsi mevcut)
});

// KARIŞIKLIĞI ÖNLEMEK İÇİN TAM DOSYAYI BURAYA YAPIŞTIRIYORUM
document.addEventListener('DOMContentLoaded', () => {
    const profileScreen = document.getElementById('profile-selection-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const infoBoxEl = document.getElementById('info-box');
    const progressBar = document.getElementById('progress-bar');
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');
    let userProfile = 'lise';
    let professions = [];
    let quizFlow = {};
    let currentQuestionNode = {};
    let userAnswers = {};

    const quizData = {
        lise: [
            { id: 'start', question: "Nasıl bir üniversite hayatı hedefliyorsun?", key: "egitim-turu", info: "💡 Seçimin, sana önereceğimiz mesleklerin eğitim türünü etkileyecek.", options: [ { text: "Kampüse gidip derslere katılmak (Örgün Eğitim)", value: "orgun" }, { text: "Kendi zamanımı yöneterek, evden okumak (Açıköğretim)", value: "acikogretim" } ], next: () => 'holland_test_1' },
            { id: 'holland_test_1', question: "Hangisi sana daha çekici geliyor?", key: "holland_1", info: "💡 Bu test, ilgi alanlarını ve kişilik tipini anlamamıza yardımcı olacak.", options: [ { text: "Bir makinenin nasıl çalıştığını anlamak.", value: "R" }, { text: "Birine sorununu çözmede yardım etmek.", value: "S" } ], next: () => 'holland_test_2' },
            { id: 'holland_test_2', question: "Nasıl bir görevi tercih edersin?", key: "holland_2", info: "💡 Farklı görevler, farklı yetenekler gerektirir.", options: [ { text: "Verileri analiz edip bir problemi çözmek.", value: "I" }, { text: "Yaratıcılığımı kullanarak özgün bir şey tasarlamak.", value: "A" } ], next: () => 'holland_test_3' },
            { id: 'holland_test_3', question: "Hangi rol sana daha uygun?", key: "holland_3", info: "💡 Liderlik mi, düzen mi? Bu, kariyer yolunu belirlemede önemli bir adımdır.", options: [ { text: "Bir ekibi yönetmek ve hedeflere ulaştırmak.", value: "E" }, { text: "Belirli kurallara göre verileri düzenlemek ve organize etmek.", value: "C" } ], next: () => null }
        ]
    };

    async function initializeApp() {
        try {
            const response = await fetch('professions.json');
            professions = await response.json();
            profileScreen.style.display = 'block';
            quizScreen.style.display = 'none';
        } catch (error) {
            console.error("Meslek veritabanı yüklenemedi:", error);
            document.querySelector('.wizard-card').innerHTML = "<h3>Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.</h3>";
        }
    }

    function initializeWizard() {
        quizFlow = quizData[userProfile] || quizData['lise'];
        userAnswers = {};
        showQuestionById('start');
    }

    function showQuestionById(id) {
        currentQuestionNode = quizFlow.find(q => q.id === id);
        if (!currentQuestionNode) {
            calculateResults();
            return;
        }
        resultContainer.style.display = 'none';
        questionContainer.style.display = 'block';
        nextBtn.style.display = 'block';
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
        const questionIndex = quizFlow.findIndex(q => q.id === id);
        const progress = ((questionIndex) / quizFlow.length) * 100;
        progressBar.style.width = `${progress}%`;
        nextBtn.textContent = currentQuestionNode.next(null) === null ? 'Sonuçları Gör ✨' : 'Sonraki Soru →';
    }

    function calculateResults() {
        let hollandAnswers = [userAnswers.holland_1, userAnswers.holland_2, userAnswers.holland_3].filter(Boolean);
        professions.forEach(profession => {
            let score = 0;
            hollandAnswers.forEach(answerCode => {
                if (profession.holland_codes && profession.holland_codes.includes(answerCode)) {
                    score += 1;
                }
            });
            profession.score = score;
        });
        const sortedProfessions = professions.sort((a, b) => b.score - a.score);
        displayResults(sortedProfessions.slice(0, 3));
    }

    function displayResults(results) {
        questionContainer.style.display = 'none';
        nextBtn.style.display = 'none';
        let resultsHTML = '<h3>Verdiğin cevaplara göre sana en uygun 3 meslek:</h3>';
        results.forEach(result => {
            const totalQuestions = Object.keys(userAnswers).length;
            const matchScore = totalQuestions > 0 ? (result.score / totalQuestions * 100).toFixed(0) : 0;
            let tagsHTML = '';
            for (const key in userAnswers) {
                const question = quizFlow.find(q => q.key === key);
                if (question && question.options) {
                    const option = question.options.find(o => o.value === userAnswers[key]);
                    if(option && result.holland_codes && result.holland_codes.includes(userAnswers[key])) { // Basit bir eşleşme kontrolü
                        tagsHTML += `<span class="tag">${option.text.split('(')[0].trim()}</span>`;
                    }
                }
            }
            resultsHTML += `
                <div class="result-card">
                    <h4>${result.name}</h4>
                    <div class="match-score">Sana Uyum Puanı: %${matchScore} 🟢</div>
                    <p class="description">${result.description || 'Bu meslek hakkında yakında daha fazla bilgi eklenecek.'}</p>
                    ${tagsHTML ? '<div class="tags-title">Neden Sana Uygun?</div><div class="tags">' + tagsHTML + '</div>' : ''}
                    <button class="primary-btn details-btn">Bu Mesleği Detaylı İncele →</button>
                </div>
            `;
        });
        resultsHTML += '<button id="restart-btn" class="secondary-btn">‹ Ankete Başa Dön</button>';
        resultContainer.innerHTML = resultsHTML;
        resultContainer.style.display = 'block';
        progressBar.style.width = `100%`;
        document.getElementById('restart-btn').addEventListener('click', () => {
            quizScreen.style.display = 'none';
            profileScreen.style.display = 'block';
        });
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
            infoBoxEl.innerHTML = currentQuestionNode.info || '';
        }
    }

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
            if (radio && currentQuestionNode.key) {
                 loadInfoContent(currentQuestionNode.key, radio.value);
            }
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

    initializeApp();
});
