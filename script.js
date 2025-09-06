document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTLER ---
    const profileScreen = document.getElementById('profile-selection-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const infoBoxEl = document.getElementById('info-box');
    const progressBar = document.getElementById('progress-bar');
    
    // --- DEĞİŞKENLER VE SORU AKIŞI ---
    let userProfile = 'lise';
    let currentQuestionNode = {};
    let userAnswers = {};

    const quizData = {
        lise: [
            { 
                id: 'start', 
                question: "Nasıl bir üniversite hayatı hedefliyorsun?", 
                key: "egitim-turu",
                info: "💡 Örgün eğitim sosyal bir kampüs hayatı sunarken; Açıköğretim daha fazla esneklik ve disiplin gerektirir.",
                options: [ 
                    { text: "Kampüse gidip derslere katılmak (Örgün Eğitim)", value: "orgun" }, 
                    { text: "Kendi zamanımı yöneterek, evden okumak (Açıköğretim)", value: "acikogretim" } 
                ],
                next: (answer) => answer === 'acikogretim' ? 'acikogretim_universiteleri' : 'henuz_hazir_degil' 
            },
            { 
                id: 'acikogretim_universiteleri', 
                question: "Harika! Peki hangi Açıköğretim Fakültesi ile daha çok ilgileniyorsun?", 
                key: "acikogretim-universiteleri",
                info: "💡 Her üniversitenin kendine özgü bölümleri ve sistemleri olabilir.",
                options: [ 
                    { text: "Anadolu Üniversitesi (AÖF)", value: "anadolu" }, 
                    { text: "İstanbul Üniversitesi (AUZEF)", value: "auzef" }, 
                    { text: "Atatürk Üniversitesi (ATA-AÖF)", value: "ata-aof" } 
                ], 
                next: (answer) => answer === 'auzef' ? 'auzef_bolumleri' : 'henuz_hazir_degil'
            },
            { 
                id: 'auzef_bolumleri', 
                question: "AUZEF için hangi bölümü düşünüyorsun?", 
                key: "auzef",
                info: "İlgilendiğin bölüm hakkında bilgi almak için üzerine tıkla.",
                options: [
                    { text: "Acil Durum Ve Afet Yönetimi (ÖnLisans)", value: "acil-durum-ve-afet-yonetimi" },
                    { text: "Adalet", value: "adalet" },
                    { text: "Bankacılık Ve Sigortacılık", value: "bankacilik-ve-sigortacilik" },
                    { text: "Bilgisayar Programcılığı", value: "bilgisayar-programciligi" },
                    { text: "Coğrafya", value: "cografya" },
                    { text: "Çocuk Gelişimi Lisans", value: "cocukgelisimi" },
                    { text: "Çocuk Gelişimi Ön Lisans", value: "cocuk-gelisimi-on-lisans" },
                    { text: "E-Ticaret ve Pazarlama", value: "e-ticaret-ve-pazarlama" },
                    { text: "Egzersiz Ve Spor Bilimleri", value: "egzersiz-ve-spor-bilimleri" },
                    { text: "Felsefe", value: "felsefe-lisans" },
                    { text: "Grafik Tasarımı Ön Lisans", value: "auzef-grafik-tasarimi-on-lisans" },
                    { text: "Hukuk Büro Yönetimi Ve Sekreterliği", value: "hukuk-buro-yonetimi-ve-sekreterligi" },
                    { text: "İktisat", value: "iktisat-acikogretim" },
                    { text: "İlahiyat Önlisans", value: "ilahiyat-onlisans" },
                    { text: "İnsan Kaynakları Yönetimi Lisans", value: "insan-kaynaklari-yonetimi-lisans" },
                    { text: "İş Sağlığı Ve Güvenliği (Lisans)", value: "is-sagligi-ve-guvenligi-lisans" },
                    { text: "İş Sağlığı Ve Güvenliği (Ön Lisans)", value: "is-sagligi-ve-guvenligi-on-lisans" },
                    { text: "İşletme", value: "isletme" },
                    { text: "İşletme Yönetimi Önlisans", value: "isletme-yonetimi-onlisans" },
                    { text: "Kültürel Miras Ve Turizm (Önlisans)", value: "kulturel-miras-ve-turizm" },
                    { text: "Laborant Ve Veteriner Sağlık", value: "laborant-ve-veteriner-saglik" },
                    { text: "Marka İletişimi", value: "auzef-marka-iletisimi" },
                    { text: "Rekreasyon Lisans", value: "rekreasyon-lisans" },
                    { text: "Sağlık Kurumları İşletmeciliği", value: "saglik-kurumlari-isletmeciligi" },
                    { text: "Siyaset Bilimi Ve Kamu Yönetimi", value: "siyaset-bilimi-ve-kamu-yonetimi" },
                    { text: "Siyaset Bilimi Ve Uluslararası İlişkiler", value: "siyaset-bilimi-ve-uluslararasi-iliskiler-lisans" },
                    { text: "Sivil Hava Ulaştırma İşletmeciliği", value: "sivil-hava-ulastirma-isletmeciligi" },
                    { text: "Sosyal Hizmetler", value: "sosyal-hizmetler" },
                    { text: "Sosyoloji", value: "auzefsosyoloji" },
                    { text: "Tarih", value: "tarih" },
                    { text: "Tıbbi Dokümantasyon Ve Sekreterlik", value: "tibbi-dokumantasyon-ve-sekreterlik" },
                    { text: "Uluslararası Ticaret Ve Lojistik Yönetimi", value: "uluslararasi-ticaret-ve-lojistik-yonetimi" },
                    { text: "Web Tasarımı ve Kodlama", value: "web-tasarimi-ve-kodlama" },
                    { text: "Yaşlı Bakımı", value: "yasli-bakimi" },
                    { text: "Yönetim Bilişim Sistemleri Lisans", value: "yonetim-bilisim-sistemleri-lisans" }
                ], 
                next: () => null
            },
            { 
                id: 'henuz_hazir_degil', 
                question: "Bu dal henüz yapım aşamasında!", 
                key: "bitti", 
                options: [], 
                next: () => null 
            }
        ]
    };

    // --- OLAY DİNLEYİCİLER ---
    startQuizBtn.addEventListener('click', () => {
        userProfile = document.querySelector('input[name="user_profile"]:checked').value;
        profileScreen.style.display = 'none';
        quizScreen.style.display = 'block';
        initializeWizard();
    });

    optionsContainerEl.addEventListener('click', (e) => {
        const label = e.target.closest('.option-label');
        if (label) {
            document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
            label.classList.add('selected');
            const radio = label.querySelector('input[type="radio"]');
            if (radio) {
                loadInfoContent(currentQuestionNode.key, radio.value);
            }
        }
    });

    nextBtn.addEventListener('click', () => {
        const selectedOption = optionsContainerEl.querySelector(`input[name="${currentQuestionNode.key}"]:checked`);
        if (!selectedOption) {
            alert("Lütfen bir seçenek belirleyin.");
            return;
        }
        userAnswers[currentQuestionNode.key] = selectedOption.value;
        const nextQuestionId = currentQuestionNode.next(selectedOption.value);
        showQuestionById(nextQuestionId);
    });

    // --- ANA FONKSİYONLAR ---
    function initializeWizard() {
        userAnswers = {};
        showQuestionById('start');
    }

    function showQuestionById(id) {
        currentQuestionNode = quizData[userProfile].find(q => q.id === id);
        if (!currentQuestionNode || currentQuestionNode.next === null) {
            // Sonuç veya bitiş ekranı mantığı
            questionTextEl.textContent = "Bu dalı tamamladın!";
            if(currentQuestionNode && currentQuestionNode.id === 'auzef_bolumleri') {
                 optionsContainerEl.innerHTML = `<p>Seçtiğin bölümle ilgili detayları araştırabilirsin. Sihirbazın bu dalı tamamlandı.</p>`;
            } else if (currentQuestionNode) {
                 optionsContainerEl.innerHTML = `<p>${currentQuestionNode.question}</p>`;
            }
            
            nextBtn.textContent = '‹ Başa Dön';
            nextBtn.onclick = () => {
                quizScreen.style.display = 'none';
                profileScreen.style.display = 'block';
                // Orijinal click olayını tekrar aktif etmek için
                nextBtn.onclick = null; 
                nextBtn.addEventListener('click', nextButtonClickHandler);
            };
            return;
        }

        questionTextEl.textContent = currentQuestionNode.question;
        optionsContainerEl.innerHTML = '';
        infoBoxEl.style.display = 'none';

        if(currentQuestionNode.options && currentQuestionNode.options.length > 0) {
            currentQuestionNode.options.forEach(option => {
                const label = document.createElement('label');
                label.className = 'option-label';
                label.innerHTML = `<input type="radio" name="${currentQuestionNode.key}" value="${option.value}"><span>${option.text}</span>`;
                optionsContainerEl.appendChild(label);
            });
        }

        if (currentQuestionNode.info) {
            infoBoxEl.innerHTML = currentQuestionNode.info;
            infoBoxEl.style.display = 'block';
        }

        const questionIndex = quizData[userProfile].findIndex(q => q.id === id);
        const progress = ((questionIndex + 1) / (quizData[userProfile].length - 1)) * 100;
        progressBar.style.width = `${progress}%`;
        nextBtn.textContent = 'Sonraki Soru →';
    }
    
    async function loadInfoContent(questionKey, optionValue) {
        let filePath = '';
        
        if (questionKey === 'acikogretim-universiteleri') {
            filePath = `content/acikogretim-universiteleri/${optionValue}/${optionValue}.html`;
        } else if (questionKey === 'auzef-bolumleri' || questionKey === 'auzef') {
            filePath = `content/acikogretim-universiteleri/auzef/${optionValue}.html`;
        } else {
            filePath = `content/${questionKey}/${optionValue}.html`;
        }

        try {
            const response = await fetch(filePath);
            if (!response.ok) { throw new Error(`Dosya bulunamadı: ${filePath}`); }
            const content = await response.text();
            infoBoxEl.innerHTML = content;
            infoBoxEl.style.display = 'block';
        } catch (error) {
            console.error("Bilgi içeriği yüklenemedi:", error);
            infoBoxEl.style.display = 'none';
        }
    }

    function nextButtonClickHandler() {
        const selectedOption = optionsContainerEl.querySelector(`input[name="${currentQuestionNode.key}"]:checked`);
        if (!selectedOption) {
            alert("Lütfen bir seçenek belirleyin.");
            return;
        }
        userAnswers[currentQuestionNode.key] = selectedOption.value;
        const nextQuestionId = currentQuestionNode.next(selectedOption.value);
        showQuestionById(nextQuestionId);
    }
    
    // Olay dinleyicisini bir kere ve doğru şekilde bağla
    // Butonun işlevi değiştiği için bu artık en sonda değil, 'Başa Dön' işlevi sıfırlandığında çağrılacak.
});
