document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTLER ---
    const profileScreen = document.getElementById('profile-selection-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const profileOptionsContainer = document.getElementById('profile-options-container');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const infoBoxEl = document.getElementById('info-box');

    // --- DEĞİŞKENLER VE VERİTABANI ---
    let userProfile = 'lise';
    let quizQuestions = [];
    let currentQuestionIndex = 0;

    // Lise öğrencisi için yeni, bilgilendirici sorular
    const liseQuestions = [
        {
            question: "Nasıl bir üniversite hayatı hedefliyorsun?",
            key: "egitim_turu",
            info: "💡 **Pro-Tip:** Örgün eğitim, sosyal bir kampüs hayatı sunarken; Açıköğretim, çalışan veya kendi zamanını yönetmek isteyenler için büyük esneklik sağlar. İkisi de YKS puanıyla öğrenci alır.",
            options: [
                { text: "Kampüse gidip derslere katılmak (Örgün Eğitim)", value: "orgun" },
                { text: "Kendi zamanımı yöneterek, evden okumak (Açıköğretim)", value: "acikogretim" }
            ]
        },
        // Bir sonraki adımda Holland Testi soruları buraya gelecek
    ];

    // --- OLAY DİNLEYİCİLER ---
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

    // --- ANA FONKSİYONLAR ---
    function initializeWizard() {
        // Seçilen profile göre doğru soru setini yükle (şimdilik sadece 'lise' var)
        if (userProfile === 'lise') {
            quizQuestions = liseQuestions;
        } else {
            // Diğer profiller için de benzer soru setleri oluşturulacak
            alert("Bu profil için anket yakında eklenecektir.");
            quizScreen.style.display = 'none';
            profileScreen.style.display = 'block';
            return;
        }
        currentQuestionIndex = 0;
        showQuestion();
    }

    function showQuestion() {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        questionTextEl.textContent = currentQuestion.question;
        
        optionsContainerEl.innerHTML = ''; // Önceki seçenekleri temizle
        currentQuestion.options.forEach(option => {
            const label = document.createElement('label');
            label.className = 'option-label';
            label.innerHTML = `<input type="radio" name="q${currentQuestionIndex}" value="${option.value}"><span>${option.text}</span>`;
            optionsContainerEl.appendChild(label);
        });

        // Bilgi kutusunu doldur ve göster
        if (currentQuestion.info) {
            infoBoxEl.innerHTML = currentQuestion.info;
            infoBoxEl.style.display = 'block';
        } else {
            infoBoxEl.style.display = 'none';
        }
    }

    // Seçeneklere tıklandığında görsel olarak seçili hale getirme
    optionsContainerEl.addEventListener('click', (e) => {
        const label = e.target.closest('.option-label');
        if (label) {
            document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
            label.classList.add('selected');
        }
    });

});
