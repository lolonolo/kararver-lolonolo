document.addEventListener('DOMContentLoaded', () => {
    // --- HAMBURGER & SIDE MENU LOGIC ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sideMenu = document.getElementById('side-menu');
    hamburgerBtn.addEventListener('click', () => {
        sideMenu.classList.toggle('is-open');
    });

    // --- SİHİRBAZ MANTIĞI (SONRAKİ ADIMDA EKLENECEK) ---

    // Seçeneklere tıklandığında görsel olarak seçili hale getirme
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.option-label')) {
            // Önce tüm seçili stilleri kaldır
            document.querySelectorAll('.option-label').forEach(label => {
                label.classList.remove('selected');
            });
            // Tıklananı seçili yap
            e.target.closest('.option-label').classList.add('selected');
        }
    });

    // "Sonraki Soru" butonuna şimdilik sadece bir log yazdıralım
    const nextBtn = document.getElementById('next-btn');
    nextBtn.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="q1"]:checked');
        if (selectedOption) {
            console.log("Seçilen cevap:", selectedOption.value);
            alert("Harika! Bir sonraki adımda bu cevaba göre yeni sorular getireceğiz.");
        } else {
            alert("Lütfen bir seçenek belirleyin.");
        }
    });
});
