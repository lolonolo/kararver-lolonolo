document.addEventListener('DOMContentLoaded', () => {
    // --- HAMBURGER & SIDE MENU LOGIC ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sideMenu = document.getElementById('side-menu');
    hamburgerBtn.addEventListener('click', () => {
        sideMenu.classList.toggle('is-open');
    });

    // --- SİHİRBAZ GÖRSEL MANTIĞI ---
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
        optionsContainer.addEventListener('click', (e) => {
            const label = e.target.closest('.option-label');
            if (label) {
                document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
                label.classList.add('selected');
            }
        });
    }

    // "Sonraki Soru" butonu için temel işlevsellik
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const selectedOption = document.querySelector('input[name="q1"]:checked');
            if (selectedOption) {
                console.log("Seçilen cevap:", selectedOption.value);
                alert("Harika! Bir sonraki adımda bu cevaba göre sihirbazı ilerleteceğiz.");
            } else {
                alert("Lütfen bir seçenek belirleyin.");
            }
        });
    }
});
