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
            { id: 'start', question: "Nasıl bir üniversite hayatı hedefliyorsun?", key: "egitim-turu", next: (answer) => answer === 'acikogretim' ? 'acikogretim_universiteleri' : 'henuz_hazir_degil' },
            { id: 'acikogretim_universiteleri', question: "Harika! Peki hangi Açıköğretim Fakültesi ile daha çok ilgileniyorsun?", key: "acikogretim-universiteleri", next: (answer) => answer === 'auzef' ? 'auzef_bolumleri' : 'henuz_hazir_degil' },
            { 
                id: 'auzef_bolumleri', 
                question: "AUZEF için hangi bölümü düşünüyorsun?", 
                key: "auzef",
                info: "İlgilendiğin bölüm hakkında bilgi almak için üzerine tıkla.",
                options: [ 
                    { text: "Acil Durum Ve Afet Yönetimi (ÖnLisans)", value: "acil-durum-ve-afet-yonetimi-app" },
                    { text: "Adalet", value: "adalet-on-lisans-app" },
                    { text: "Bankacılık Ve Sigortacılık", value: "bankacilik-ve-sigortacilik" },
                    { text: "Bilgisayar Programcılığı", value: "bilgisayar-programciligi" },
                    { text: "Coğrafya", value: "cografya" },
                    { text: "Çocuk Gelişimi Lisans", value: "cocukgelisimi" },
                    { text: "Çocuk Gelişimi Ön Lisans", value: "cocuk-gelisimi-on-lisans" },
                    { text: "E-Ticaret ve Pazarlama", value: "e-ticaret-ve-pazarlama" },
                    { text: "Egzersiz Ve Spor Bilimleri", value: "egzersiz-ve-spor-bilimleri" },
                    { text: "Felsefe", value: "felsefe-lisans" },
                    { text: "Grafik Tasarımı Ön Lisans", value: "auzef-grafik-tasarimi-on-lisans" },
                    { text: "Hukuk Büro Yönetimi Ve Sekreterliği", value: "hukuk-buro-yonetimi-ve-sekreterligi-app" },
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
                    { text: "Siyaset Bilimi Ve Uluslararası İlişkiler", value: "siyaset-bilimi-ve-uluslararasi-iliskiler-lisans-app" },
                    { text: "Sivil Hava Ulaştırma İşletmeciliği", value: "sivil-hava-ulastirma-isletmeciligi" },
                    { text: "Sosyal Hizmetler", value: "sosyal-hizmetler" },
                    { text: "Sosyoloji", value: "auzefsosyoloji" },
                    { text: "Tarih", value: "tarih" },
                    { text: "Tıbbi Dokümantasyon Ve Sekreterlik", value: "tibbi-dokumantasyon-ve-sekreterlik" },
                    { text: "Uluslararası Ticaret Ve Lojistik Yönetimi", value: "uluslararasi-ticaret-ve-lojistik-yonetimi-lisans-app" },
                    { text: "Web Tasarımı ve Kodlama", value: "web-tasarimi-ve-kodlama" },
                    { text: "Yaşlı Bakımı", value: "yasli-bakimi" },
                    { text: "Yönetim Bilişim Sistemleri Lisans", value: "yonetim-bilisim-sistemleri-lisans" }
                ], 
                next: () => null
            },
            { id: 'henuz_hazir_degil', question: "Bu dal henüz yapım aşamasında!", key: "bitti", options: [], next: () => null }
        ]
    };

    // --- OLAY DİNLEYİCİLER VE ANA FONKSİYONLAR (DEĞİŞİKLİK YOK) ---
    // ... (bir önceki mesajdakiyle aynı)
};
