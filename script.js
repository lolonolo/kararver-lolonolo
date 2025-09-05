document.addEventListener('DOMContentLoaded', () => {
    // --- HAMBURGER & SIDE MENU LOGIC ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sideMenu = document.getElementById('side-menu');
    hamburgerBtn.addEventListener('click', () => {
        sideMenu.classList.toggle('is-open');
    });

    // --- SİHİRBAZ VERİTABANI ---

    // Sihirbazda sorulacak sorular
    const quizQuestions = [
        {
            question: "En başarılı olduğun ders grubu hangisi?",
            key: "puan_turu",
            options: [
                { text: "Matematik, Fizik (Sayısal)", value: "sayisal" },
                { text: "Edebiyat, Tarih (Sözel)", value: "sozel" },
                { text: "Matematik, Edebiyat (Eşit Ağırlık)", value: "esit_agirlik" },
                { text: "İngilizce, Almanca (Dil)", value: "dil" }
            ]
        },
        {
            question: "Nasıl bir çalışma ortamını tercih edersin?",
            key: "calisma_ortami",
            options: [
                { text: "İnsanlarla sürekli iletişim halinde, dinamik bir ortam.", value: "insan_odakli" },
                { text: "Kendi başıma odaklanabileceğim, sakin bir ofis.", value: "ofis" },
                { text: "Atölye, laboratuvar veya stüdyo gibi teknik bir ortam.", value: "teknik" },
                { text: "Masa başında değil, dışarıda, sahada olacağım bir ortam.", value: "saha" }
            ]
        },
        {
            question: "Bir sorunu çözerken hangi yönün daha ağır basar?",
            key: "yaklasim_tarzi",
            options: [
                { text: "Analitik düşünür, verileri ve mantığı kullanırım.", value: "analitik" },
                { text: "Yaratıcılığımı ve hayal gücümü kullanırım.", value: "yaratici" },
                { text: "Empati kurar, insan odaklı çözümler üretirim.", value: "empati" }
            ]
        }
    ];

    // Meslekler ve etiketleri (Başlangıç için küçük bir set)
    const professions = [
        { name: "Yazılım Geliştirici", puan_turu: "sayisal", calisma_ortami: "ofis", yaklasim_tarzi: "analitik" },
        { name: "Doktor", puan_turu: "sayisal", calisma_ortami: "insan_odakli", yaklasim_tarzi: "analitik" },
        { name: "Avukat", puan_turu: "esit_agirlik", calisma_ortami: "insan_odakli", yaklasim_tarzi: "empati" },
        { name: "Grafik Tasarımcı", puan_turu: "esit_agirlik", calisma_ortami: "teknik", yaklasim_tarzi: "yaratici" },
        { name: "Psikolog", puan_turu: "esit_agirlik", calisma_ortami: "insan_odakli", yaklasim_tarzi: "empati" },
        { name: "Tarihçi / Arkeolog", puan_turu: "sozel", calisma_ortami: "saha", yaklasim_tarzi: "analitik" },
        { name: "Reklamcı", puan_turu: "sozel", calisma_ortami: "insan_odakli", yaklasim_tarzi: "yaratici" },
        { name: "Mütercim-Tercüman", puan_turu: "dil", calisma_ortami: "ofis", yaklasim_tarzi: "analitik" }
    ];

    // --- SİHİRBAZ MANTIĞI ---
    let currentQuestionIndex = 0;
    const userAnswers = {};

    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');

    function showQuestion() {
        // Geçmiş seçimleri temizle
        document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));

        const currentQuestion = quizQuestions[currentQuestionIndex];
        questionTextEl.textContent = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;
        
        optionsContainerEl.innerHTML = ''; // Önceki seçenekleri temizle
        currentQuestion.options.forEach(option => {
            const label = document.createElement('label');
            label.className = 'option-label';
            label.innerHTML = `
                <input type="radio" name="q${currentQuestionIndex}" value="${option.value}">
                <span>${option.text}</span>
            `;
            optionsContainerEl.appendChild(label);
        });

        // İlerleme çubuğunu güncelle
        const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;

        // Son soruysa buton metnini değiştir
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

        // Meslekleri skora göre büyükten küçüğe sırala
        const sortedProfessions = professions.sort((a, b) => b.score - a.score);
        displayResults(sortedProfessions.slice(0, 3)); // En iyi 3 sonucu göster
    }
    
    function displayResults(results) {
        questionContainer.style.display = 'none';
        nextBtn.style.display = 'none';
        
        resultContainer.innerHTML = '<h3>Verdiğin cevaplara göre sana en uygun 3 meslek:</h3>';
        const resultList = document.createElement('ul');
        resultList.className = 'result-list'; // CSS'te stil vermek için
        results.forEach(result => {
            const listItem = document.createElement('li');
            listItem.textContent = result.name;
            resultList.appendChild(listItem);
        });
        resultContainer.appendChild(resultList);
        resultContainer.style.display = 'block';

        progressBar.style.width = `100%`;
        progressBar.style.backgroundColor = '#4caf50'; // Yeşil renk
    }


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

    // İlk soruyu göstererek sihirbazı başlat
    showQuestion();
});
