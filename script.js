// Bu dosya bir sonraki adımda tamamen değişecek. 
// Şimdilik sadece profil seçme ve sihirbaza geçme mantığını içeriyor.
document.addEventListener('DOMContentLoaded', () => {
    const profileScreen = document.getElementById('profile-selection-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');

    startQuizBtn.addEventListener('click', () => {
        const selectedProfile = document.querySelector('input[name="user_profile"]:checked');
        if (selectedProfile) {
            profileScreen.style.display = 'none';
            quizScreen.style.display = 'block';
            alert("Harika! Temelimiz hazır. Şimdi bir sonraki adımda bu ekranı akıllı sorularla dolduracağız.");
        } else {
            alert("Lütfen başlamak için bir durum seçin.");
        }
    });
});
