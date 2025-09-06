document.addEventListener('DOMContentLoaded', () => {
    // --- HAMBURGER & SIDE MENU LOGIC ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sideMenu = document.getElementById('side-menu');
    if (hamburgerBtn && sideMenu) {
        hamburgerBtn.addEventListener('click', () => {
            sideMenu.classList.toggle('is-open');
        });
    }

    // --- SİHİRBAZ BAŞLANGIÇ EKRANI MANTIĞI ---
    const profileScreen = document.getElementById('profile-selection-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    let userProfile = '';

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
            const selectedProfile = document.querySelector('input[name="user_profile"]:checked');
            if (selectedProfile) {
                userProfile = selectedProfile.value;
                console.log("Kullanıcı profili seçildi:", userProfile);

                if(profileScreen) profileScreen.style.display = 'none';
                if(quizScreen) quizScreen.style.display = 'block';

                initializeWizard();
            }
        });
    }
    
    // --- SİHİRBAZIN KENDİSİ ---
    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');

    // Bu fonksiyon sadece sihirbaz başladığında çağrılacak
    function initializeWizard() {
        // Burada, seçilen profile göre farklı soru setleri ve meslek listeleri yüklenebilir.
        // Bu bir sonraki adımımız olacak. Şimdilik varsayılanı kullanıyoruz.
        console.log(`Sihirbaz '${userProfile}' profili için başlatılıyor...`);
        // Asıl sihirbaz mantığını burada başlatabiliriz.
        // Örneğin: showQuestion(0);
    }
});
