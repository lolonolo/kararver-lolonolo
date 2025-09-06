document.addEventListener('DOMContentLoaded', () => {
    const profileScreen = document.getElementById('profile-selection-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const profileOptionsContainer = document.getElementById('profile-options-container');
    let userProfile = 'lise'; // Varsayılan

    if(profileOptionsContainer) {
        profileOptionsContainer.addEventListener('click', (e) => {
            const label = e.target.closest('.profile-option-label');
            if (label) {
                document.querySelectorAll('.profile-option-label').forEach(l => l.classList.remove('selected'));
                label.classList.add('selected');
            }
        });
    }

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

    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');
    
    const questionsByProfile = { /* ... Öncekiyle aynı ... */ };
    let professions = []; let quizQuestions = []; let currentQuestionIndex = 0; let userAnswers = {};

    async function initializeWizard() { /* ... Öncekiyle aynı ... */ }
    function showQuestion() { /* ... Öncekiyle aynı ... */ }
    function calculateResults() { /* ... Öncekiyle aynı ... */ }
    function displayResults(results) { /* ... Öncekiyle aynı, Başa Dön butonu dahil ... */ }

    nextBtn.addEventListener('click', () => { /* ... Öncekiyle aynı ... */ });
    optionsContainerEl.addEventListener('click', (e) => {
        const label = e.target.closest('.option-label');
        if (label) {
            document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
            label.classList.add('selected');
        }
    });
});
