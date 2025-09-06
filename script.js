document.addEventListener('DOMContentLoaded', () => {
    // --- SABİTLER VE DEĞİŞKENLER ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sideMenu = document.getElementById('side-menu');
    const profileScreen = document.getElementById('profile-selection-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');

    let professions = [];
    let quizQuestions = [];
    let userAnswers = {};
    let userProfile = '';

    // --- VERİTABANI ---
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
    
    // --- ANA KONTROL FONKSİYONU (ROUTER) ---
    const handleLocationChange = () => {
        const params = new URLSearchParams(window.location.search);
        const questionNum = parseInt(params.get('soru'), 10);
        const profile = params.get('profil');
        const showResult = params.get('sonuc');

        userProfile = profile;
        quizQuestions = questionsByProfile[userProfile] || [];

        if (profile && questionNum > 0 && questionNum <= quizQuestions.length) {
            showQuizScreen();
            showQuestion(questionNum - 1);
        } else if (profile && showResult === 'true') {
            showQuizScreen();
            calculateResults();
        } else {
            showProfileScreen();
        }
    };

    // --- GÖRÜNÜM FONKSİYONLARI ---
    const showProfileScreen = () => {
        profileScreen.style.display = 'block';
        quizScreen.style.display = 'none';
    };
    
    const showQuizScreen = () => {
        profileScreen.style.display = 'none';
        quizScreen.style.display = 'block';
    };

    const showQuestion = (index) => {
        resultContainer.style.display = 'none';
        questionContainer.style.display = 'block';
        nextBtn.style.display = 'block';

        const currentQuestion = quizQuestions[index];
        questionTextEl.textContent = `${index + 1}. ${currentQuestion.question}`;
        
        optionsContainerEl.innerHTML = '';
        currentQuestion.options.forEach(option => {
            const label = document.createElement('label');
            label.className = 'option-label';
            label.innerHTML = `<input type="radio" name="q${index}" value="${option.value}"><span>${option.text}</span>`;
            optionsContainerEl.appendChild(label);
        });

        const progress = ((index) / quizQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;

        if (index === quizQuestions.length - 1) {
            nextBtn.textContent = 'Sonuçları Gör ✨';
        } else {
            nextBtn.textContent = 'Sonraki Soru →';
        }
    };

    const displayResults = (results) => {
        questionContainer.style.display = 'none';
        nextBtn.style.display = 'none';
        
        resultContainer.innerHTML = `<h3>Verdiğin cevaplara göre sana en uygun 3 meslek:</h3><ul class="result-list">${results.map(r => `<li>${r.name}</li>`).join('')}</ul><p class="result-info">Bu öneriler, bir başlangıç noktasıdır.</p><button id="restart-btn" class="secondary-btn">‹ Başa Dön</button>`;
        resultContainer.style.display = 'block';
        progressBar.style.width = `100%`;

        document.getElementById('restart-btn').addEventListener('click', () => {
            userAnswers = {};
            history.pushState({}, '', window.location.pathname);
            handleLocationChange();
        });
    };

    // --- HESAPLAMA FONKSİYONLARI ---
    const calculateResults = () => {
        // Cevapları URL'den almamız gerekebilir, eğer kullanıcı direkt sonuç linkine gelirse.
        // Şimdilik basit tutuyoruz ve userAnswers objesinin dolu olduğunu varsayıyoruz.
        professions.forEach(p => {
            let score = 0;
            for (const key in userAnswers) { if (p[key] === userAnswers[key]) score++; }
            p.score = score;
        });
        const sorted = professions.sort((a, b) => b.score - a.score);
        displayResults(sorted.slice(0, 3));
    };

    // --- OLAY DİNLEYİCİLER (EVENT LISTENERS) ---
    hamburgerBtn.addEventListener('click', () => sideMenu.classList.toggle('is-open'));

    startQuizBtn.addEventListener('click', () => {
        const selectedProfile = document.querySelector('input[name="user_profile"]:checked');
        if (selectedProfile) {
            userProfile = selectedProfile.value;
            quizQuestions = questionsByProfile[userProfile] || questionsByProfile['lise'];
            if (quizQuestions.length === 0) {
                alert("Bu profil için henüz anket hazırlanmamıştır.");
                return;
            }
            userAnswers = {};
            const newUrl = `?profil=${userProfile}&soru=1`;
            history.pushState({ questionIndex: 0 }, '', newUrl);
            handleLocationChange();
        }
    });

    nextBtn.addEventListener('click', () => {
        const params = new URLSearchParams(window.location.search);
        const currentQuestionIndex = parseInt(params.get('soru'), 10) - 1;

        const selectedOption = optionsContainerEl.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);
        if (!selectedOption) {
            alert("Lütfen bir seçenek belirleyin.");
            return;
        }
        
        const currentKey = quizQuestions[currentQuestionIndex].key;
        userAnswers[currentKey] = selectedOption.value;
        
        const nextQuestionIndex = currentQuestionIndex + 1;
        
        if (nextQuestionIndex < quizQuestions.length) {
            const newUrl = `?profil=${userProfile}&soru=${nextQuestionIndex + 1}`;
            history.pushState({ questionIndex: nextQuestionIndex }, '', newUrl);
            handleLocationChange();
        } else {
            const newUrl = `?profil=${userProfile}&sonuc=true`;
            history.pushState({ result: true }, '', newUrl);
            handleLocationChange();
        }
    });

    optionsContainerEl.addEventListener('click', (e) => {
        const label = e.target.closest('('.option-label');
        if (label) {
            document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
            label.classList.add('selected');
        }
    });

    window.addEventListener('popstate', handleLocationChange);

    // --- İLK YÜKLEME ---
    async function initializeApp() {
        try {
            const response = await fetch('professions.json');
            if (!response.ok) throw new Error('Network response was not ok');
            professions = await response.json();
            handleLocationChange(); // Sayfa ilk açıldığında URL'ye göre doğru ekranı göster
        } catch (error) {
            console.error("Meslek veritabanı yüklenemedi:", error);
            const mainContent = document.querySelector('.wizard-card');
            if(mainContent) mainContent.innerHTML = "<h3>Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.</h3>";
        }
    }

    initializeApp();
});
