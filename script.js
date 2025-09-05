document.addEventListener('DOMContentLoaded', () => {
    // --- HAMBURGER & SIDE MENU LOGIC ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sideMenu = document.getElementById('side-menu');
    hamburgerBtn.addEventListener('click', () => {
        sideMenu.classList.toggle('is-open');
    });

    // --- SİHİRBAZ VERİTABANI ---
    const quizQuestions = [
        // ... (sorular aynı kalacak) ...
    ];
    let professions = [];

    // --- SİHİRBAZ MANTIĞI ---
    let currentQuestionIndex = 0;
    let userAnswers = {}; // userAnswers'ı burada tanımla

    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');

    async function initializeWizard() {
        try {
            const response = await fetch('professions.json');
            professions = await response.json();
            showQuestion();
        } catch (error) {
            console.error("Meslek veritabanı yüklenemedi:", error);
            questionContainer.innerHTML = "<h3>Veriler yüklenirken bir hata oluştu.</h3>";
        }
    }

    function showQuestion() {
        resultContainer.style.display = 'none'; // Sonuçları gizle
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

        const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.style.backgroundColor = '#ffab40'; // Rengi normale döndür

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
    
    // GÜNCELLENDİ - Başa Dön Butonu Eklendi
    function displayResults(results) {
        questionContainer.style.display = 'none';
        nextBtn.style.display = 'none';
        
        resultContainer.innerHTML = `
            <h3>Verdiğin cevaplara göre sana en uygun 3 meslek:</h3>
            <ul class="result-list">
                ${results.map(result => `<li>${result.name}</li>`).join('')}
            </ul>
            <p class="result-info">Bu öneriler, bir başlangıç noktasıdır. Meslekleri daha detaylı araştırmayı unutma!</p>
            <button id="restart-btn" class="secondary-btn">‹ Tekrar Dene</button>
        `;
        resultContainer.style.display = 'block';

        progressBar.style.width = `100%`;
        progressBar.style.backgroundColor = '#4caf50';

        // Başa dön butonuna olay dinleyici ekle
        document.getElementById('restart-btn').addEventListener('click', () => {
            currentQuestionIndex = 0;
            userAnswers = {};
            showQuestion();
        });
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

    initializeWizard();
});
