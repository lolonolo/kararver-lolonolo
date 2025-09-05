document.addEventListener('DOMContentLoaded', () => {
    // --- HAMBURGER & SIDE MENU LOGIC ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sideMenu = document.getElementById('side-menu');
    hamburgerBtn.addEventListener('click', () => {
        sideMenu.classList.toggle('is-open');
    });

    // --- SİHİRBAZ MANTIĞI ---
    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const questionContainer = document.getElementById('question-container');
    
    // Sadece menü mantığı ve görsel seçimler için temel script.
    // Bir sonraki adımda burayı asıl sihirbaz mantığı ile dolduracağız.
    if (optionsContainerEl) {
        optionsContainerEl.addEventListener('click', (e) => {
            const label = e.target.closest('.option-label');
            if (label) {
                document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
                label.classList.add('selected');
            }
        });
    }

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
