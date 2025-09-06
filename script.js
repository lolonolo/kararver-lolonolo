document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTLER ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sideMenu = document.getElementById('side-menu');
    const profileScreen = document.getElementById('profile-selection-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const profileOptionsContainer = document.getElementById('profile-options-container');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');

    // --- DEĞİŞKENLER VE VERİTABANI ---
    let userProfile = 'lise'; // Varsayılan
    let professions = [];
    let quizQuestions = [];
    let currentQuestionIndex = 0;
    let userAnswers = {};

    const questionsByProfile = {
        lise: [
            { question: "En başarılı olduğun ders grubu hangisi?", key: "puan_turu", options: [ { text: "Matematik, Fizik (Sayısal)", value: "sayisal" }, { text: "Edebiyat, Tarih (Sözel)", value: "sozel" }, { text: "Matematik, Edebiyat (Eşit Ağırlık)", value: "esit_agirlik" }, { text: "İngilizce, Almanca (Dil)", value: "dil" } ] },
            { question: "Nasıl bir çalışma ortamını tercih edersin?", key: "calisma_ortami", options: [ { text: "İnsanlarla sürekli iletişim halinde, dinamik bir ortam.", value: "insan_odakli" }, { text: "Kendi başıma odaklanabileceğim, sakin bir ofis.", value: "ofis" }, { text: "Atölye, laboratuvar veya stüdyo gibi teknik bir ortam.", value: "teknik" }, { text: "Masa başında değil, dışarıda, sahada olacağım bir ortam.", value: "saha" } ] },
            { question: "Bir sorunu çözerken hangi yönün daha ağır basar?", key: "yaklasim_tarzi", options: [ { text: "Analitik düşünür, verileri ve mantığı kullanırım.", value: "analitik" }, { text: "Yaratıcılığımı ve hayal gücümü kullanırım.", value: "yaratici" }, { text: "Empati kurar, insan odaklı çözümler üretirim.", value: "empati" } ] }
        ],
        universite: [
            { question: "Mevcut bölümünün en çok hangi yönünü sevmiyorsun?", key: "sevmedigin_yon", options: [ { text: "Dersler çok teorik, pratiğe yönelik değil.", value: "teorik" }, { text: "İş imkanlarının kısıtlı olduğunu düşünüyorum.", value: "is_garantisi" }, { text: "İlgi alanlarıma tam olarak hitap etmiyor.", value: "ilgisiz" }, { text: "Bölümümden memnunum, sadece kariyerimi planlamak istiyorum.", value: "memnunum" } ] },
            { question: "Gelecekte kendini nerede görmek istersin?", key: "gelecek_hedefi", options: [ { text: "Akademide kalıp araştırmacı olmak.", value: "akademi" }, { text: "Büyük ve kurumsal bir şirkette çalışmak.", value: "sirket" }, { text: "Kendi işimi kurmak / Freelance çalışmak.", value: "serbest" }, { text: "Kamu kurumlarında (devlet) çalışmak.", value: "kamu" } ] }
        ],
        mezun: []
    };

    // --- OLAY DİNLEYİCİLER (EVENT LISTENERS) ---
    hamburgerBtn.addEventListener('click', () => sideMenu.classList.toggle('is-open'));

    profileOptionsContainer.addEventListener('click', (e) => {
        const label = e.target.closest('.profile-option-label');
        if (label) {
            document.querySelectorAll('.profile-option-label').forEach(l => l.classList.remove('selected'));
            label.classList.add('selected');
        }
    });

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

    nextBtn.addEventListener('click', () => {
        const selectedOption = optionsContainerEl.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);
        if (!selectedOption) {
            alert("Lütfen bir seçenek belirleyin.");
            return;
        }
        const currentKey = quizQuestions[currentQuestionIndex].key;
        userAnswers[currentKey] = selectedOption.value;
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion();
        } else {
            calculateResults();
        }
    });

    optionsContainerEl.addEventListener('click', (e) => {
        const label = e.target.closest('.option-label');
        if (label) {
            document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
            label.classList.add('selected');
        }
    });

    // --- ANA FONKSİYONLAR ---
    async function initializeWizard() {
        try {
            const response = await fetch('professions.json');
            professions = await response.json();
            quizQuestions = questionsByProfile[userProfile] || questionsByProfile['lise'];

            if (quizQuestions.length === 0) {
                alert("Bu profil için henüz anket hazırlanmamıştır.");
                quizScreen.style.display = 'none';
                profileScreen.style.display = 'block';
                return;
            }
            currentQuestionIndex = 0;
            userAnswers = {};
            showQuestion();
        } catch (error) {
            console.error("Meslek veritabanı yüklenemedi:", error);
            questionContainer.innerHTML = "<h3>Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</h3>";
        }
    }

    function showQuestion() {
        resultContainer.style.display = 'none';
        questionContainer.style.display = 'block';
        nextBtn.style.display = 'block';
        const currentQuestion = quizQuestions[currentQuestionIndex];
        questionTextEl.textContent = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;
        optionsContainerEl.innerHTML = '';
        currentQuestion.options.forEach(option => {
            const label = document.createElement('label');
            label.className = 'option-label';
            label.innerHTML = `<input type="radio" name="q${currentQuestionIndex}" value="${option.value}"><span>${option.text}</span>`;
            optionsContainerEl.appendChild(label);
        });
        const progress = ((currentQuestionIndex) / quizQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
        if (currentQuestionIndex === quizQuestions.length - 1) {
            nextBtn.textContent = 'Sonuçları Gör ✨';
        } else {
            nextBtn.textContent = 'Sonraki Soru →';
        }
    }

    function calculateResults() {
        professions.forEach(profession => {
            let score = 0;
            for (const key in userAnswers) {
                if (profession[key] === userAnswers[key]) {
                    score++;
                }
            }
            profession.score = score;
        });
        const sortedProfessions = professions.sort((a, b) => b.score - a.score);
        displayResults(sortedProfessions.slice(0, 3));
    }
    
    function displayResults(results) {
        questionContainer.style.display = 'none';
        nextBtn.style.display = 'none';
        resultContainer.innerHTML = `<h3>Verdiğin cevaplara göre sana en uygun 3 meslek:</h3><ul class="result-list">${results.map(r => `<li>${r.name}</li>`).join('')}</ul><p class="result-info">Bu öneriler, bir başlangıç noktasıdır.</p><button id="restart-btn" class="secondary-btn">‹ Başa Dön</button>`;
        resultContainer.style.display = 'block';
        progressBar.style.width = `100%`;
        document.getElementById('restart-btn').addEventListener('click', () => {
            quizScreen.style.display = 'none';
            profileScreen.style.display = 'block';
        });
    }
});
