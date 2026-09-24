/* =========================================================
   FJIS ACADEMY
   STUDENT LEARNER
   TKA SMP ENGINE
   ========================================================= */

const STORAGE = {
    users: "fjis_users",
    session: "fjis_session",
    progress: "fjis_progress",
    tkaHistory: "fjis_tka_history"
};

const state = {
    currentPage: "landing-page",
    dashboardSection: "home",

    smp: {
        level: "7",
        subject: "",
        topic: "",
        difficulty: "Campuran",
        questionCount: 10,
        questions: [],
        currentQuestion: 0,
        answers: [],
        score: 0,
        startedAt: null,
        finishedAt: null
    },

    tka: {
        subject: "Semua",
        competency: "Semua",
        difficulty: "Campuran",
        mode: "latihan",
        questionCount: 10,
        questions: [],
        currentQuestion: 0,
        answers: [],
        startedAt: null,
        finishedAt: null,
        timer: null,
        remainingSeconds: 0
    }
};


/* =========================================================
   BASIC HELPERS
   ========================================================= */

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return [...document.querySelectorAll(selector)];
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getInitials(name) {
    if (!name) return "FJ";

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase();
}

function formatDate(date = new Date()) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(new Date(date));
}

function formatDateTime(date = new Date()) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(date));
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE.users)) || [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(STORAGE.users, JSON.stringify(users));
}

function getSession() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE.session));
    } catch {
        return null;
    }
}

function saveSession(session) {
    localStorage.setItem(STORAGE.session, JSON.stringify(session));
}

/*
 * Compatibility bridge untuk dashboard/page lama.
 * Dashboard lama membaca "fjis_current_user", sedangkan
 * engine auth utama memakai "fjis_session".
 * Keduanya sekarang selalu disinkronkan supaya nama akun
 * yang baru dibuat/login tidak tertinggal menjadi akun lama.
 */
function saveCurrentUser(user) {
    if (!user) return;

    const currentUser = {
        id: user.id || "",
        name: String(user.name || "Student").trim() || "Student",
        fullName: String(user.name || "Student").trim() || "Student",
        email: String(user.email || "").trim().toLowerCase(),
        level: user.level || "Student Learner",
        avatar: user.avatar || "🧑🏻"
    };

    localStorage.setItem(
        "fjis_current_user",
        JSON.stringify(currentUser)
    );
}

function clearSession() {
    localStorage.removeItem(STORAGE.session);
    localStorage.removeItem("fjis_current_user");
}

function getProgress() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE.progress)) || {};
    } catch {
        return {};
    }
}

function saveProgress(data) {
    localStorage.setItem(STORAGE.progress, JSON.stringify(data));
}

function getTKAHistory() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE.tkaHistory)) || {};
    } catch {
        return {};
    }
}

function saveTKAHistory(data) {
    localStorage.setItem(STORAGE.tkaHistory, JSON.stringify(data));
}

function getCurrentUser() {
    const session = getSession();

    if (session?.email) {
        const user = getUsers().find(
            item =>
                String(item.email || "").toLowerCase() ===
                String(session.email || "").toLowerCase()
        ) || null;

        if (user) {
            /* Repair/sync legacy dashboard identity automatically. */
            saveCurrentUser(user);
            return user;
        }
    }

    /* Legacy fallback: migrate fjis_current_user -> fjis_session. */
    try {
        const legacy = JSON.parse(
            localStorage.getItem("fjis_current_user") || "null"
        );

        if (legacy?.email) {
            const user = getUsers().find(
                item =>
                    String(item.email || "").toLowerCase() ===
                    String(legacy.email || "").toLowerCase()
            ) || null;

            if (user) {
                saveSession({
                    email: user.email,
                    loginAt: new Date().toISOString()
                });
                saveCurrentUser(user);
                return user;
            }
        }
    } catch {
        /* Abaikan data legacy yang rusak. */
    }

    return null;
}

function getUserKey() {
    const user = getCurrentUser();
    return user?.email?.toLowerCase() || "guest";
}

function showToast(message) {
    const toast = $("#toast");
    const toastMessage = $("#toast-message");

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

function setFormMessage(element, message, type = "") {
    if (!element) return;

    element.textContent = message;
    element.className = "form-message";

    if (type) {
        element.classList.add(type);
    }
}


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showPage(pageId) {
    const pages = $$(".page");

    pages.forEach(page => {
        page.classList.toggle("active", page.id === pageId);
    });

    state.currentPage = pageId;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageId === "dashboard-page") {
        updateDashboard();
    }
}

function setupNavigation() {
    $$("[data-page]").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();

            const target = button.dataset.page;

            if (target === "dashboard-page" && !getCurrentUser()) {
                showPage("login-page");
                return;
            }

            showPage(target);
        });
    });
}


/* =========================================================
   AUTHENTICATION
   ========================================================= */

function setupRegister() {
    const form = $("#register-form");
    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = $("#register-name")?.value.trim();
        const email = $("#register-email")?.value.trim().toLowerCase();
        const password = $("#register-password")?.value;
        const level = $("#register-level")?.value;

        const message = $("#register-message");

        if (!name || !email || !password || !level) {
            setFormMessage(
                message,
                "Lengkapi semua data terlebih dahulu.",
                "error"
            );
            return;
        }

        if (password.length < 6) {
            setFormMessage(
                message,
                "Password minimal 6 karakter.",
                "error"
            );
            return;
        }

        const users = getUsers();

        const exists = users.some(
            user => user.email.toLowerCase() === email
        );

        if (exists) {
            setFormMessage(
                message,
                "Email tersebut sudah terdaftar. Silakan login.",
                "error"
            );
            return;
        }

        users.push({
            id: crypto.randomUUID
                ? crypto.randomUUID()
                : Date.now().toString(),
            name,
            email,
            password,
            level,
            createdAt: new Date().toISOString()
        });

        saveUsers(users);

        saveSession({
            email,
            loginAt: new Date().toISOString()
        });

        /* Simpan identitas lengkap akun baru untuk kompatibilitas
           dengan dashboard yang membaca fjis_current_user. */
        saveCurrentUser({
            id: users[users.length - 1].id,
            name,
            email,
            level
        });

        setFormMessage(
            message,
            "Akun berhasil dibuat. Membuka dashboard...",
            "success"
        );

        form.reset();

        setTimeout(() => {
            showPage("dashboard-page");
            showToast(`Selamat datang di FJIS Academy, ${name}!`);
        }, 600);
    });
}

function setupLogin() {
    const form = $("#login-form");
    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const email = $("#login-email")?.value.trim().toLowerCase();
        const password = $("#login-password")?.value;
        const message = $("#login-message");

        const user = getUsers().find(
            item => item.email.toLowerCase() === email
        );

        if (!user || user.password !== password) {
            setFormMessage(
                message,
                "Email atau password tidak sesuai.",
                "error"
            );
            return;
        }

        saveSession({
            email: user.email,
            loginAt: new Date().toISOString()
        });

        /* Selalu timpa identitas lama dengan akun yang baru login. */
        saveCurrentUser(user);

        form.reset();

        setFormMessage(
            message,
            "Login berhasil.",
            "success"
        );

        setTimeout(() => {
            showPage("dashboard-page");
            showToast(`Selamat datang kembali, ${user.name}!`);
        }, 400);
    });
}

function syncCurrentUserIdentity() {
    const user = getCurrentUser();
    if (user) saveCurrentUser(user);
}

function setupLogout() {
    const button = $("#logout-button");
    if (!button) return;

    button.addEventListener("click", () => {
        clearSession();
        showPage("landing-page");
        showToast("Kamu telah keluar dari akun.");
    });
}


/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {
    const user = getCurrentUser();

    if (!user) {
        showPage("landing-page");
        return;
    }

    const nameElement = $("#dashboard-name");
    const levelElement = $("#dashboard-level");
    const avatarElement = $("#dashboard-avatar");

    if (nameElement) {
        nameElement.textContent = user.name;
    }

    if (levelElement) {
        levelElement.textContent = user.level || "Student Learner";
    }

    if (avatarElement) {
        avatarElement.textContent = getInitials(user.name);
    }

    const title = $("#dashboard-title");

    if (title) {
        title.textContent = `Selamat datang, ${user.name}`;
    }

    const date = $("#current-date");

    if (date) {
        date.textContent = formatDate();
    }

    updateOverallProgress();

    renderDashboardSection(state.dashboardSection);
}

function updateOverallProgress() {
    const progressData = getProgress();
    const userKey = getUserKey();

    const userProgress = progressData[userKey] || {};

    const values = Object.values(userProgress);

    const progress =
        values.length > 0
            ? Math.round(
                values.reduce((sum, value) => sum + Number(value || 0), 0)
                / values.length
            )
            : 0;

    const overall = $("#overall-progress");
    const bar = $("#overall-progress-bar");

    if (overall) {
        overall.textContent = `${progress}%`;
    }

    if (bar) {
        bar.style.width = `${progress}%`;
    }
}

function setupDashboardNavigation() {
    $$("[data-dashboard-section]").forEach(button => {
        button.addEventListener("click", () => {
            state.dashboardSection = button.dataset.dashboardSection;

            $$("[data-dashboard-section]").forEach(item => {
                item.classList.toggle(
                    "active",
                    item.dataset.dashboardSection === state.dashboardSection
                );
            });

            renderDashboardSection(state.dashboardSection);
        });
    });
}

function renderDashboardSection(section) {
    const sections = {
        home: "#dashboard-home",
        smp: "#dashboard-smp",
        sma: "#dashboard-sma",
        kuliah: "#dashboard-kuliah",
        kedinasan: "#dashboard-kedinasan",
        beasiswa: "#dashboard-beasiswa"
    };

    Object.entries(sections).forEach(([key, selector]) => {
        const element = $(selector);

        if (element) {
            element.style.display = key === section ? "" : "none";
        }
    });

    if (section === "smp") {
        renderSMPLearning();
    }

    if (section === "sma") {
        renderSMALearning();
    }
}


/* =========================================================
   SMP LEARNING DATA
   ========================================================= */

const SMP_SUBJECTS = {
    "7": [
        {
            name: "Matematika",
            topics: [
                "Bilangan",
                "Aljabar",
                "Geometri",
                "Data dan Peluang"
            ]
        },
        {
            name: "Bahasa Indonesia",
            topics: [
                "Teks Deskripsi",
                "Teks Prosedur",
                "Teks Narasi",
                "Literasi"
            ]
        },
        {
            name: "IPA",
            topics: [
                "Makhluk Hidup",
                "Zat dan Perubahannya",
                "Energi",
                "Bumi dan Tata Surya"
            ]
        }
    ],

    "8": [
        {
            name: "Matematika",
            topics: [
                "Pola Bilangan",
                "Persamaan Linear",
                "Relasi dan Fungsi",
                "Teorema Pythagoras",
                "Statistika"
            ]
        },
        {
            name: "Bahasa Indonesia",
            topics: [
                "Teks Eksposisi",
                "Teks Persuasi",
                "Teks Berita",
                "Literasi"
            ]
        },
        {
            name: "IPA",
            topics: [
                "Sistem Pernapasan",
                "Sistem Peredaran Darah",
                "Tekanan",
                "Getaran dan Gelombang"
            ]
        }
    ],

    "9": [
        {
            name: "Matematika",
            topics: [
                "Bilangan Berpangkat",
                "Persamaan Kuadrat",
                "Kesebangunan",
                "Bangun Ruang",
                "Statistika dan Peluang"
            ]
        },
        {
            name: "Bahasa Indonesia",
            topics: [
                "Teks Argumentasi",
                "Teks Eksplanasi",
                "Teks Persuasi",
                "Literasi dan Penalaran"
            ]
        },
        {
            name: "IPA",
            topics: [
                "Reproduksi",
                "Genetika",
                "Listrik",
                "Kemagnetan"
            ]
        }
    ]
};


/* =========================================================
   GENERIC SMP QUESTIONS
   ========================================================= */

const SMP_QUESTION_BANK = {
    "7": {
        "Matematika": {
            "Bilangan": [
                {
                    question: "Hasil dari 24 + 36 ÷ 6 adalah...",
                    options: ["10", "18", "30", "40"],
                    answer: 2,
                    explanation: "Kerjakan pembagian terlebih dahulu: 36 ÷ 6 = 6, kemudian 24 + 6 = 30.",
                    difficulty: "Mudah"
                }
            ]
        }
    },

    "8": {
        "Matematika": {
            "Pola Bilangan": [
                {
                    question: "Perhatikan pola 3, 6, 12, 24, ... Bilangan berikutnya adalah...",
                    options: ["36", "42", "48", "54"],
                    answer: 2,
                    explanation: "Setiap bilangan dikalikan 2. Jadi 24 × 2 = 48.",
                    difficulty: "Mudah"
                }
            ]
        }
    },

    "9": {
        "Matematika": {
            "Bilangan Berpangkat": [
                {
                    question: "Nilai dari 2³ × 2⁴ adalah...",
                    options: ["32", "64", "128", "256"],
                    answer: 2,
                    explanation: "Jika basis sama, pangkat dijumlahkan: 2³ × 2⁴ = 2⁷ = 128.",
                    difficulty: "Sedang"
                }
            ],

            "Persamaan Kuadrat": [
                {
                    question: "Jika x² − 5x + 6 = 0, nilai x yang memenuhi adalah...",
                    options: ["1 dan 6", "2 dan 3", "−2 dan −3", "3 dan 6"],
                    answer: 1,
                    explanation: "x² − 5x + 6 = (x − 2)(x − 3), sehingga x = 2 atau x = 3.",
                    difficulty: "Sedang"
                }
            ]
        }
    }
};

function getGenericSMPQuestion(subject, topic, difficulty) {
    const templates = {
        "Matematika": [
            {
                question: `Latihan konsep ${topic}: Jika suatu besaran meningkat dari 20 menjadi 30, berapa persen kenaikannya?`,
                options: ["25%", "40%", "50%", "60%"],
                answer: 2,
                explanation: "Kenaikan = 30 − 20 = 10. Persentase kenaikan = 10/20 × 100% = 50%."
            },
            {
                question: `Dalam penerapan ${topic}, seorang siswa memperoleh nilai 72 dari maksimum 90. Berapa persentase nilainya?`,
                options: ["70%", "75%", "80%", "85%"],
                answer: 2,
                explanation: "72/90 × 100% = 80%."
            }
        ],

        "Bahasa Indonesia": [
            {
                question: `Bacalah kalimat berikut: "Sekolah itu menanam pohon di setiap sudut halaman agar lingkungan menjadi lebih sejuk." Tujuan tindakan tersebut adalah...`,
                options: [
                    "Mengurangi jumlah siswa",
                    "Membuat lingkungan lebih sejuk",
                    "Mengubah bentuk sekolah",
                    "Menambah jumlah ruang kelas"
                ],
                answer: 1,
                explanation: "Tujuan dinyatakan langsung melalui bagian 'agar lingkungan menjadi lebih sejuk'."
            }
        ],

        "IPA": [
            {
                question: `Konsep ${topic} dapat diamati ketika suatu perubahan terjadi pada benda atau lingkungan. Hal yang paling tepat dilakukan siswa adalah...`,
                options: [
                    "Mengamati dan mencatat data",
                    "Menebak tanpa pengamatan",
                    "Mengabaikan hasil",
                    "Mengubah data agar sesuai dugaan"
                ],
                answer: 0,
                explanation: "Pendekatan ilmiah memerlukan pengamatan dan pencatatan data."
            }
        ]
    };

    const pool = templates[subject] || templates["Matematika"];

    return {
        ...pool[Math.floor(Math.random() * pool.length)],
        difficulty
    };
}

function getSMPQuestions(level, subject, topic, difficulty, count) {
    let pool = [];

    const exact =
        SMP_QUESTION_BANK?.[level]?.[subject]?.[topic];

    if (Array.isArray(exact)) {
        pool.push(...exact);
    }

    if (pool.length < count) {
        while (pool.length < count) {
            pool.push(
                getGenericSMPQuestion(
                    subject,
                    topic,
                    difficulty
                )
            );
        }
    }

    if (difficulty !== "Campuran") {
        const filtered = pool.filter(
            question => question.difficulty === difficulty
        );

        if (filtered.length >= count) {
            pool = filtered;
        }
    }

    return shuffle(pool)
        .slice(0, count)
        .map((question, index) => ({
            ...question,
            id: `smp-${Date.now()}-${index}-${Math.random()}`,
            number: index + 1
        }));
}


/* =========================================================
   SMP UI
   ========================================================= */

function renderSMPLearning() {
    const area = $("#smp-learning-area");

    if (!area) return;

    area.innerHTML = `
        <div class="section-heading">
            <span class="eyebrow">SMP LEARNING</span>
            <h2>Belajar sedikit demi sedikit, berkembang setiap hari.</h2>
            <p>
                Pilih kelas, mata pelajaran, dan topik yang ingin kamu kuasai.
            </p>
        </div>

        <div id="smp-selector-area"></div>
        <div id="smp-topic-area"></div>
        <div id="smp-practice-area"></div>
    `;

    renderSMPSelectors();
}

function renderSMPSelectors() {
    const area = $("#smp-selector-area");

    if (!area) return;

    const subjects =
        SMP_SUBJECTS[state.smp.level] || [];

    area.innerHTML = `
        <div class="glass-card">
            <h3>Pilih Kelas</h3>

            <div class="program-grid">
                ${["7", "8", "9"].map(level => `
                    <button
                        class="secondary-button ${state.smp.level === level ? "active" : ""}"
                        data-smp-level="${level}"
                    >
                        Kelas ${level}
                    </button>
                `).join("")}
            </div>

            <h3 style="margin-top:24px;">Mata Pelajaran</h3>

            <div class="program-grid">
                ${subjects.map(subject => `
                    <button
                        class="secondary-button"
                        data-smp-subject="${escapeHTML(subject.name)}"
                    >
                        ${escapeHTML(subject.name)}
                    </button>
                `).join("")}
            </div>
        </div>
    `;

    $$("[data-smp-level]").forEach(button => {
        button.addEventListener("click", () => {
            state.smp.level = button.dataset.smpLevel;
            state.smp.subject = "";
            state.smp.topic = "";
            renderSMPLearning();
        });
    });

    $$("[data-smp-subject]").forEach(button => {
        button.addEventListener("click", () => {
            state.smp.subject = button.dataset.smpSubject;
            state.smp.topic = "";
            renderSMPTopics();
        });
    });
}

function renderSMPTopics() {
    const area = $("#smp-topic-area");

    if (!area) return;

    const subjectData =
        SMP_SUBJECTS[state.smp.level]
            ?.find(item => item.name === state.smp.subject);

    if (!subjectData) {
        area.innerHTML = "";
        return;
    }

    area.innerHTML = `
        <div class="glass-card">
            <h3>
                ${escapeHTML(state.smp.subject)}
                — Kelas ${state.smp.level}
            </h3>

            <p>Pilih topik yang ingin dipelajari.</p>

            <div class="program-grid">
                ${subjectData.topics.map(topic => `
                    <button
                        class="secondary-button"
                        data-smp-topic="${escapeHTML(topic)}"
                    >
                        ${escapeHTML(topic)}
                    </button>
                `).join("")}
            </div>
        </div>

        <div id="smp-practice-area"></div>
    `;

    $$("[data-smp-topic]").forEach(button => {
        button.addEventListener("click", () => {
            state.smp.topic = button.dataset.smpTopic;
            renderSMPPracticeSetup();
        });
    });
}

function renderSMPPracticeSetup() {
    const area = $("#smp-practice-area");

    if (!area) return;

    area.innerHTML = `
        <div class="glass-card">
            <h3>Latihan ${escapeHTML(state.smp.topic)}</h3>

            <label>
                Tingkat kesulitan
                <select id="smp-difficulty">
                    <option>Campuran</option>
                    <option>Sangat Mudah</option>
                    <option>Mudah</option>
                    <option>Sedang</option>
                    <option>Sulit</option>
                    <option>Sangat Sulit</option>
                </select>
            </label>

            <label style="display:block;margin-top:16px;">
                Jumlah soal
                <select id="smp-question-count">
                    ${[5, 10, 15, 20, 25, 30, 50]
                        .map(number => `
                            <option value="${number}">
                                ${number} soal
                            </option>
                        `).join("")}
                </select>
            </label>

            <button
                class="primary-button"
                id="start-smp-practice"
                style="margin-top:20px;"
            >
                Mulai Latihan
            </button>
        </div>
    `;

    $("#start-smp-practice")?.addEventListener(
        "click",
        startSMPPractice
    );
}

function startSMPPractice() {
    state.smp.difficulty =
        $("#smp-difficulty")?.value || "Campuran";

    state.smp.questionCount =
        Number($("#smp-question-count")?.value || 10);

    state.smp.questions = getSMPQuestions(
        state.smp.level,
        state.smp.subject,
        state.smp.topic,
        state.smp.difficulty,
        state.smp.questionCount
    );

    state.smp.currentQuestion = 0;
    state.smp.answers = [];
    state.smp.score = 0;
    state.smp.startedAt = new Date().toISOString();

    renderSMPQuestion();
}

function renderSMPQuestion() {
    const area = $("#smp-practice-area");

    if (!area) return;

    const question =
        state.smp.questions[state.smp.currentQuestion];

    if (!question) {
        finishSMPPractice();
        return;
    }

    area.innerHTML = `
        <div class="glass-card">
            <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;">
                <strong>
                    Soal ${state.smp.currentQuestion + 1}
                    dari ${state.smp.questions.length}
                </strong>

                <span>
                    ${escapeHTML(question.difficulty || "Campuran")}
                </span>
            </div>

            <h3 style="margin-top:24px;">
                ${escapeHTML(question.question)}
            </h3>

            <div style="display:grid;gap:12px;margin-top:20px;">
                ${question.options.map((option, index) => `
                    <button
                        class="secondary-button smp-option"
                        data-option="${index}"
                    >
                        ${String.fromCharCode(65 + index)}.
                        ${escapeHTML(option)}
                    </button>
                `).join("")}
            </div>
        </div>
    `;

    $$(".smp-option").forEach(button => {
        button.addEventListener("click", () => {
            const selected = Number(button.dataset.option);

            state.smp.answers.push({
                questionId: question.id,
                selected,
                correct: selected === question.answer
            });

            if (selected === question.answer) {
                state.smp.score++;
            }

            state.smp.currentQuestion++;

            renderSMPQuestion();
        });
    });
}

function finishSMPPractice() {
    state.smp.finishedAt = new Date().toISOString();

    const total = state.smp.questions.length;

    const percentage =
        total > 0
            ? Math.round((state.smp.score / total) * 100)
            : 0;

    saveLearningProgress(
        `smp-${state.smp.level}-${state.smp.subject}-${state.smp.topic}`,
        percentage
    );

    renderSMPResult();
}

function renderSMPResult() {
    const area = $("#smp-practice-area");

    if (!area) return;

    const total = state.smp.questions.length;

    const percentage =
        total > 0
            ? Math.round((state.smp.score / total) * 100)
            : 0;

    area.innerHTML = `
        <div class="glass-card">
            <span class="eyebrow">HASIL LATIHAN</span>

            <h2>
                ${state.smp.score}/${total}
            </h2>

            <p>
                Nilai kamu:
                <strong>${percentage}</strong>
            </p>

            <button
                class="primary-button"
                id="smp-discussion-button"
            >
                Lihat Pembahasan
            </button>

            <button
                class="secondary-button"
                id="smp-retry-button"
                style="margin-left:8px;"
            >
                Ulangi
            </button>

            <div id="smp-discussion-area" style="margin-top:24px;"></div>
        </div>
    `;

    $("#smp-discussion-button")?.addEventListener(
        "click",
        renderSMPDiscussion
    );

    $("#smp-retry-button")?.addEventListener(
        "click",
        renderSMPPracticeSetup
    );
}

function renderSMPDiscussion() {
    const area = $("#smp-discussion-area");

    if (!area) return;

    area.innerHTML = `
        <div style="display:grid;gap:16px;">
            ${state.smp.questions.map((question, index) => {
                const result = state.smp.answers[index];

                return `
                    <div>
                        <strong>
                            ${index + 1}. ${escapeHTML(question.question)}
                        </strong>

                        <p>
                            Jawaban kamu:
                            ${
                                result
                                    ? escapeHTML(
                                        question.options[result.selected]
                                    )
                                    : "-"
                            }
                        </p>

                        <p>
                            Jawaban benar:
                            ${escapeHTML(question.options[question.answer])}
                        </p>

                        <p>
                            ${escapeHTML(question.explanation)}
                        </p>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}

function saveLearningProgress(key, percentage) {
    const data = getProgress();
    const userKey = getUserKey();

    if (!data[userKey]) {
        data[userKey] = {};
    }

    data[userKey][key] = percentage;

    saveProgress(data);
    updateOverallProgress();
}


/* =========================================================
   TKA SMP DATA
   ========================================================= */

const TKA_SUBJECTS = [
    "Bahasa Indonesia",
    "Matematika"
];

const TKA_DIFFICULTIES = [
    "Campuran",
    "Sangat Mudah",
    "Mudah",
    "Sedang",
    "Sulit",
    "Sangat Sulit"
];

const TKA_COMPETENCIES = {
    "Matematika": [
        "Bilangan",
        "Aljabar",
        "Geometri & Pengukuran",
        "Data & Peluang"
    ],

    "Bahasa Indonesia": [
        "Pemahaman Tekstual",
        "Pemahaman Inferensial",
        "Evaluasi/Apresiasi",
        "Antarteks"
    ]
};


/* =========================================================
   TKA QUESTION BANK
   ========================================================= */

const TKA_QUESTION_BANK = [

    /* =========================
       MATEMATIKA — BILANGAN
       ========================= */

    {
        id: "mtk-bil-001",
        subject: "Matematika",
        competency: "Bilangan",
        difficulty: "Mudah",
        question:
            "Sebuah bilangan jika dikalikan 4 kemudian dikurangi 6 menghasilkan 30. Bilangan tersebut adalah...",
        options: [
            "6",
            "8",
            "9",
            "12"
        ],
        answer: 2,
        explanation:
            "Misalkan bilangan x. 4x − 6 = 30, sehingga 4x = 36 dan x = 9."
    },

    {
        id: "mtk-bil-002",
        subject: "Matematika",
        competency: "Bilangan",
        difficulty: "Sedang",
        question:
            "Nilai dari 2⁵ × 2³ ÷ 2⁴ adalah...",
        options: [
            "4",
            "8",
            "16",
            "32"
        ],
        answer: 2,
        explanation:
            "Karena basis sama, pangkat dijumlahkan lalu dikurangi: 5 + 3 − 4 = 4. Jadi hasilnya 2⁴ = 16."
    },

    {
        id: "mtk-bil-003",
        subject: "Matematika",
        competency: "Bilangan",
        difficulty: "Sulit",
        question:
            "FPB dua bilangan adalah 12 dan KPK-nya adalah 180. Jika salah satu bilangan adalah 36, bilangan lainnya adalah...",
        options: [
            "48",
            "60",
            "72",
            "90"
        ],
        answer: 1,
        explanation:
            "Untuk dua bilangan a dan b berlaku a × b = FPB × KPK. Jadi 36b = 12 × 180 = 2160, sehingga b = 60."
    },

    {
        id: "mtk-bil-004",
        subject: "Matematika",
        competency: "Bilangan",
        difficulty: "Sangat Sulit",
        question:
            "Sebuah pola bilangan memiliki suku pertama 3. Setiap suku berikutnya diperoleh dengan mengalikan suku sebelumnya dengan 2 lalu menambahkan 1. Suku ke-5 adalah...",
        options: [
            "39",
            "47",
            "55",
            "63"
        ],
        answer: 1,
        explanation:
            "3 → 7 → 15 → 31 → 63. Jadi suku ke-5 adalah 63."
    },


    /* =========================
       MATEMATIKA — ALJABAR
       ========================= */

    {
        id: "mtk-alg-001",
        subject: "Matematika",
        competency: "Aljabar",
        difficulty: "Mudah",
        question:
            "Jika 3x + 5 = 20, maka nilai x adalah...",
        options: [
            "3",
            "4",
            "5",
            "6"
        ],
        answer: 2,
        explanation:
            "3x = 15 sehingga x = 5."
    },

    {
        id: "mtk-alg-002",
        subject: "Matematika",
        competency: "Aljabar",
        difficulty: "Sedang",
        question:
            "Jika x + y = 10 dan x − y = 4, maka nilai x adalah...",
        options: [
            "3",
            "5",
            "7",
            "9"
        ],
        answer: 2,
        explanation:
            "Jumlahkan kedua persamaan: 2x = 14, sehingga x = 7."
    },

    {
        id: "mtk-alg-003",
        subject: "Matematika",
        competency: "Aljabar",
        difficulty: "Sulit",
        question:
            "Diketahui x² − 7x + 12 = 0. Jumlah kedua akar persamaan tersebut adalah...",
        options: [
            "3",
            "4",
            "7",
            "12"
        ],
        answer: 2,
        explanation:
            "Menurut hubungan akar, jumlah akar = −b/a = 7."
    },

    {
        id: "mtk-alg-004",
        subject: "Matematika",
        competency: "Aljabar",
        difficulty: "Sangat Sulit",
        question:
            "Jika f(x) = 2x² − 3x + 1 dan f(a) = 0, maka hasil kali seluruh nilai a yang memenuhi adalah...",
        options: [
            "1/2",
            "1",
            "3/2",
            "2"
        ],
        answer: 0,
        explanation:
            "Nilai a merupakan akar 2x² − 3x + 1 = 0. Hasil kali akar = c/a = 1/2."
    },


    /* =========================
       MATEMATIKA — GEOMETRI
       ========================= */

    {
        id: "mtk-geo-001",
        subject: "Matematika",
        competency: "Geometri & Pengukuran",
        difficulty: "Mudah",
        question:
            "Sebuah persegi memiliki panjang sisi 8 cm. Luasnya adalah...",
        options: [
            "16 cm²",
            "32 cm²",
            "64 cm²",
            "128 cm²"
        ],
        answer: 2,
        explanation:
            "Luas persegi = sisi × sisi = 8 × 8 = 64 cm²."
    },

    {
        id: "mtk-geo-002",
        subject: "Matematika",
        competency: "Geometri & Pengukuran",
        difficulty: "Sedang",
        question:
            "Segitiga siku-siku memiliki sisi siku-siku 6 cm dan 8 cm. Panjang sisi miringnya adalah...",
        options: [
            "9 cm",
            "10 cm",
            "12 cm",
            "14 cm"
        ],
        answer: 1,
        explanation:
            "c² = 6² + 8² = 36 + 64 = 100, sehingga c = 10."
    },

    {
        id: "mtk-geo-003",
        subject: "Matematika",
        competency: "Geometri & Pengukuran",
        difficulty: "Sulit",
        question:
            "Sebuah persegi panjang memiliki luas 120 cm². Jika panjangnya 4 cm lebih besar daripada lebarnya, lebarnya adalah...",
        options: [
            "8 cm",
            "10 cm",
            "12 cm",
            "15 cm"
        ],
        answer: 1,
        explanation:
            "Misal lebar x, panjang x+4. x(x+4)=120 → x²+4x−120=0 → (x+12)(x−10)=0. Jadi lebar 10 cm."
    },


    /* =========================
       MATEMATIKA — DATA
       ========================= */

    {
        id: "mtk-data-001",
        subject: "Matematika",
        competency: "Data & Peluang",
        difficulty: "Mudah",
        question:
            "Data nilai: 6, 7, 8, 8, 9. Median data tersebut adalah...",
        options: [
            "6",
            "7",
            "8",
            "9"
        ],
        answer: 2,
        explanation:
            "Data sudah berurutan. Nilai tengah adalah 8."
    },

    {
        id: "mtk-data-002",
        subject: "Matematika",
        competency: "Data & Peluang",
        difficulty: "Sedang",
        question:
            "Sebuah dadu bersisi enam dilempar sekali. Peluang muncul bilangan genap adalah...",
        options: [
            "1/6",
            "1/3",
            "1/2",
            "2/3"
        ],
        answer: 2,
        explanation:
            "Bilangan genap adalah 2, 4, dan 6. Ada 3 dari 6 kemungkinan, sehingga peluang = 3/6 = 1/2."
    },

    {
        id: "mtk-data-003",
        subject: "Matematika",
        competency: "Data & Peluang",
        difficulty: "Sulit",
        question:
            "Rata-rata lima bilangan adalah 18. Jika empat bilangan pertama berjumlah 64, bilangan kelima adalah...",
        options: [
            "20",
            "24",
            "26",
            "28"
        ],
        answer: 2,
        explanation:
            "Jumlah seluruh bilangan = 5 × 18 = 90. Bilangan kelima = 90 − 64 = 26."
    },


    /* =========================
       BAHASA INDONESIA
       ========================= */

    {
        id: "bin-tekstual-001",
        subject: "Bahasa Indonesia",
        competency: "Pemahaman Tekstual",
        difficulty: "Mudah",
        passage:
            "Perpustakaan sekolah menyediakan berbagai jenis buku. Selain buku pelajaran, tersedia pula novel, ensiklopedia, dan majalah pendidikan.",
        question:
            "Informasi yang dinyatakan secara langsung dalam teks adalah...",
        options: [
            "Perpustakaan hanya menyediakan buku pelajaran.",
            "Perpustakaan menyediakan berbagai jenis buku.",
            "Semua siswa wajib membaca novel.",
            "Majalah pendidikan tidak tersedia."
        ],
        answer: 1,
        explanation:
            "Kalimat pertama secara langsung menyatakan bahwa perpustakaan menyediakan berbagai jenis buku."
    },

    {
        id: "bin-inferensial-001",
        subject: "Bahasa Indonesia",
        competency: "Pemahaman Inferensial",
        difficulty: "Sedang",
        passage:
            "Rani selalu membawa botol minum sendiri ke sekolah. Ia juga mengajak teman-temannya mengurangi penggunaan botol plastik sekali pakai.",
        question:
            "Simpulan yang paling tepat berdasarkan teks adalah...",
        options: [
            "Rani tidak menyukai sekolah.",
            "Rani memiliki kepedulian terhadap pengurangan sampah plastik.",
            "Rani hanya membawa botol karena diwajibkan.",
            "Teman-teman Rani selalu menolak ajakannya."
        ],
        answer: 1,
        explanation:
            "Kebiasaan membawa botol sendiri dan mengajak orang lain mengurangi plastik menunjukkan kepedulian terhadap lingkungan."
    },

    {
        id: "bin-evaluasi-001",
        subject: "Bahasa Indonesia",
        competency: "Evaluasi/Apresiasi",
        difficulty: "Sulit",
        passage:
            "Sebuah artikel menyatakan bahwa membaca selama 15 menit setiap hari pasti membuat semua siswa memperoleh nilai tinggi.",
        question:
            "Hal yang perlu diperhatikan ketika mengevaluasi pernyataan tersebut adalah...",
        options: [
            "Pernyataan tersebut perlu didukung bukti yang memadai.",
            "Pernyataan tersebut pasti benar karena terdengar positif.",
            "Nilai siswa tidak pernah dipengaruhi faktor lain.",
            "Semua siswa memiliki kondisi belajar yang sama."
        ],
        answer: 0,
        explanation:
            "Klaim yang bersifat umum dan mutlak perlu diperiksa berdasarkan bukti dan faktor lain yang relevan."
    },

    {
        id: "bin-antarteks-001",
        subject: "Bahasa Indonesia",
        competency: "Antarteks",
        difficulty: "Sangat Sulit",
        passage:
            "Teks A menyatakan bahwa penggunaan transportasi umum dapat mengurangi jumlah kendaraan pribadi. Teks B menjelaskan bahwa transportasi umum perlu didukung jadwal dan akses yang baik agar masyarakat tertarik menggunakannya.",
        question:
            "Hubungan gagasan kedua teks tersebut adalah...",
        options: [
            "Keduanya bertentangan sepenuhnya.",
            "Teks B memperkuat gagasan Teks A dengan menjelaskan salah satu syarat keberhasilannya.",
            "Teks A membantah seluruh isi Teks B.",
            "Keduanya membahas topik yang tidak berhubungan."
        ],
        answer: 1,
        explanation:
            "Teks A membahas manfaat transportasi umum, sedangkan Teks B menjelaskan kondisi yang dapat mendukung manfaat tersebut."
    },

    {
        id: "bin-inferensial-002",
        subject: "Bahasa Indonesia",
        competency: "Pemahaman Inferensial",
        difficulty: "Sangat Sulit",
        passage:
            "Meskipun hasil percobaan pertama belum sesuai dugaan, kelompok tersebut tidak langsung mengubah datanya. Mereka memeriksa kembali prosedur dan mengulang percobaan.",
        question:
            "Sikap ilmiah yang paling tampak dalam teks adalah...",
        options: [
            "Mengabaikan hasil yang tidak sesuai.",
            "Menyesuaikan data dengan harapan.",
            "Memeriksa proses dan menggunakan bukti sebelum menarik kesimpulan.",
            "Menghentikan penelitian ketika hasil pertama tidak sesuai."
        ],
        answer: 2,
        explanation:
            "Kelompok tersebut mempertahankan data dan memeriksa prosedur sebelum mengambil kesimpulan."
    }
];


/* =========================================================
   TKA HELPERS
   ========================================================= */

function getFilteredTKAQuestions({
    subject = "Semua",
    competency = "Semua",
    difficulty = "Campuran",
    count = 10
}) {
    let pool = [...TKA_QUESTION_BANK];

    if (subject !== "Semua") {
        pool = pool.filter(
            question => question.subject === subject
        );
    }

    if (competency !== "Semua") {
        pool = pool.filter(
            question => question.competency === competency
        );
    }

    if (difficulty !== "Campuran") {
        pool = pool.filter(
            question => question.difficulty === difficulty
        );
    }

    /*
       Jika filter terlalu sempit, kita tetap menggunakan
       soal yang tersedia dari filter tersebut.
    */
    return shuffle(pool)
        .slice(0, Math.min(count, pool.length))
        .map((question, index) => ({
            ...question,
            number: index + 1
        }));
}

function getTKAUserHistory() {
    const history = getTKAHistory();
    return history[getUserKey()] || [];
}

function saveTKAAttempt(result) {
    const history = getTKAHistory();
    const userKey = getUserKey();

    if (!history[userKey]) {
        history[userKey] = [];
    }

    history[userKey].unshift(result);

    /*
       Simpan maksimal 30 percobaan terakhir
       agar localStorage tidak terlalu penuh.
    */
    history[userKey] = history[userKey].slice(0, 30);

    saveTKAHistory(history);
}


/* =========================================================
   TKA PAGE
   ========================================================= */

function renderTKAPage() {
    const area = $("#smp-learning-area");

    if (!area) return;

    area.innerHTML = `
        <div class="section-heading">
            <span class="eyebrow">TKA SMP</span>

            <h2>
                Latihan TKA dengan fokus pada kompetensi dan penalaran.
            </h2>

            <p>
                Gunakan latihan ini untuk mengetahui bagian yang sudah kuat
                dan bagian yang masih perlu ditingkatkan.
            </p>
        </div>

        <div id="tka-setup-area"></div>
        <div id="tka-practice-area"></div>
        <div id="tka-history-area"></div>
    `;

    renderTKASetup();
    renderTKAHistory();
}

function renderTKASetup() {
    const area = $("#tka-setup-area");

    if (!area) return;

    const subjectOptions = [
        "Semua",
        ...TKA_SUBJECTS
    ];

    let competencyOptions = ["Semua"];

    if (state.tka.subject !== "Semua") {
        competencyOptions = [
            "Semua",
            ...(TKA_COMPETENCIES[state.tka.subject] || [])
        ];
    }

    area.innerHTML = `
        <div class="glass-card">

            <h3>Atur Latihan TKA</h3>

            <label style="display:block;margin-top:16px;">
                Mata pelajaran
                <select id="tka-subject">
                    ${subjectOptions.map(subject => `
                        <option
                            value="${escapeHTML(subject)}"
                            ${state.tka.subject === subject ? "selected" : ""}
                        >
                            ${escapeHTML(subject)}
                        </option>
                    `).join("")}
                </select>
            </label>

            <label style="display:block;margin-top:16px;">
                Kompetensi
                <select id="tka-competency">
                    ${competencyOptions.map(item => `
                        <option
                            value="${escapeHTML(item)}"
                            ${state.tka.competency === item ? "selected" : ""}
                        >
                            ${escapeHTML(item)}
                        </option>
                    `).join("")}
                </select>
            </label>

            <label style="display:block;margin-top:16px;">
                Tingkat kesulitan
                <select id="tka-difficulty">
                    ${TKA_DIFFICULTIES.map(item => `
                        <option
                            value="${escapeHTML(item)}"
                            ${state.tka.difficulty === item ? "selected" : ""}
                        >
                            ${escapeHTML(item)}
                        </option>
                    `).join("")}
                </select>
            </label>

            <label style="display:block;margin-top:16px;">
                Mode
                <select id="tka-mode">
                    <option
                        value="latihan"
                        ${state.tka.mode === "latihan" ? "selected" : ""}
                    >
                        Latihan Kompetensi
                    </option>

                    <option
                        value="tryout"
                        ${state.tka.mode === "tryout" ? "selected" : ""}
                    >
                        Tryout
                    </option>

                    <option
                        value="kelemahan"
                        ${state.tka.mode === "kelemahan" ? "selected" : ""}
                    >
                        Fokus Kelemahan
                    </option>
                </select>
            </label>

            <label style="display:block;margin-top:16px;">
                Jumlah soal
                <select id="tka-question-count">
                    ${[5, 10, 15, 20, 25, 30]
                        .map(number => `
                            <option
                                value="${number}"
                                ${state.tka.questionCount === number ? "selected" : ""}
                            >
                                ${number} soal
                            </option>
                        `).join("")}
                </select>
            </label>

            <div
                style="
                    margin-top:18px;
                    padding:16px;
                    border-radius:16px;
                    background:rgba(255,255,255,.35);
                "
            >
                <strong>Catatan</strong>
                <p style="margin-bottom:0;">
                    Mode Tryout menggunakan timer latihan FJIS.
                    Waktu ini bukan ketentuan waktu resmi TKA.
                </p>
            </div>

            <button
                class="primary-button"
                id="start-tka"
                style="margin-top:20px;"
            >
                Mulai TKA
            </button>

            <button
                class="secondary-button"
                id="refresh-tka-history"
                style="margin-top:10px;"
            >
                Refresh Riwayat
            </button>
        </div>
    `;

    $("#tka-subject")?.addEventListener("change", event => {
        state.tka.subject = event.target.value;
        state.tka.competency = "Semua";
        renderTKASetup();
    });

    $("#tka-competency")?.addEventListener("change", event => {
        state.tka.competency = event.target.value;
    });

    $("#tka-difficulty")?.addEventListener("change", event => {
        state.tka.difficulty = event.target.value;
    });

    $("#tka-mode")?.addEventListener("change", event => {
        state.tka.mode = event.target.value;
    });

    $("#tka-question-count")?.addEventListener("change", event => {
        state.tka.questionCount = Number(event.target.value);
    });

    $("#start-tka")?.addEventListener(
        "click",
        startTKA
    );

    $("#refresh-tka-history")?.addEventListener(
        "click",
        renderTKAHistory
    );
}


/* =========================================================
   TKA FOCUS WEAKNESS
   ========================================================= */

function getWeakCompetencies() {
    const history = getTKAUserHistory();

    if (!history.length) {
        return [];
    }

    const stats = {};

    history.forEach(attempt => {
        (attempt.competencyStats || []).forEach(item => {
            if (!stats[item.competency]) {
                stats[item.competency] = {
                    correct: 0,
                    total: 0
                };
            }

            stats[item.competency].correct += item.correct;
            stats[item.competency].total += item.total;
        });
    });

    return Object.entries(stats)
        .map(([competency, data]) => ({
            competency,
            percentage:
                data.total > 0
                    ? Math.round(
                        (data.correct / data.total) * 100
                    )
                    : 0
        }))
        .sort((a, b) => a.percentage - b.percentage);
}

function getWeaknessQuestions(count) {
    const weak = getWeakCompetencies();

    if (!weak.length) {
        return shuffle(TKA_QUESTION_BANK).slice(0, count);
    }

    const weakest = weak.slice(0, 2)
        .map(item => item.competency);

    const pool = TKA_QUESTION_BANK.filter(
        question =>
            weakest.includes(question.competency)
    );

    return shuffle(pool)
        .slice(0, count);
}


/* =========================================================
   START TKA
   ========================================================= */

function startTKA() {
    state.tka.subject =
        $("#tka-subject")?.value || "Semua";

    state.tka.competency =
        $("#tka-competency")?.value || "Semua";

    state.tka.difficulty =
        $("#tka-difficulty")?.value || "Campuran";

    state.tka.mode =
        $("#tka-mode")?.value || "latihan";

    state.tka.questionCount =
        Number($("#tka-question-count")?.value || 10);

    let questions;

    if (state.tka.mode === "kelemahan") {
        questions = getWeaknessQuestions(
            state.tka.questionCount
        );

        if (state.tka.subject !== "Semua") {
            questions = questions.filter(
                question =>
                    question.subject === state.tka.subject
            );
        }

        if (state.tka.competency !== "Semua") {
            questions = questions.filter(
                question =>
                    question.competency === state.tka.competency
            );
        }

        if (state.tka.difficulty !== "Campuran") {
            questions = questions.filter(
                question =>
                    question.difficulty === state.tka.difficulty
            );
        }

        questions = shuffle(questions)
            .slice(0, state.tka.questionCount);
    } else {
        questions = getFilteredTKAQuestions({
            subject: state.tka.subject,
            competency: state.tka.competency,
            difficulty: state.tka.difficulty,
            count: state.tka.questionCount
        });
    }

    if (!questions.length) {
        showToast(
            "Belum ada soal yang sesuai dengan filter tersebut."
        );
        return;
    }

    state.tka.questions = questions;
    state.tka.currentQuestion = 0;
    state.tka.answers = [];
    state.tka.startedAt = new Date().toISOString();
    state.tka.finishedAt = null;

    if (state.tka.mode === "tryout") {
        state.tka.remainingSeconds =
            state.tka.questions.length * 90;

        startTKATimer();
    } else {
        clearInterval(state.tka.timer);
        state.tka.timer = null;
    }

    renderTKAQuestion();
}


/* =========================================================
   TKA TIMER
   ========================================================= */

function startTKATimer() {
    clearInterval(state.tka.timer);

    updateTKATimer();

    state.tka.timer = setInterval(() => {
        state.tka.remainingSeconds--;

        updateTKATimer();

        if (state.tka.remainingSeconds <= 0) {
            clearInterval(state.tka.timer);
            state.tka.timer = null;

            showToast("Waktu latihan habis.");

            finishTKA();
        }
    }, 1000);
}

function updateTKATimer() {
    const timer = $("#tka-timer");

    if (!timer) return;

    const seconds = Math.max(
        0,
        state.tka.remainingSeconds
    );

    const minutes =
        Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");

    const remaining =
        (seconds % 60)
            .toString()
            .padStart(2, "0");

    timer.textContent =
        `${minutes}:${remaining}`;
}


/* =========================================================
   TKA QUESTION
   ========================================================= */

function renderTKAQuestion() {
    const area = $("#tka-practice-area");

    if (!area) return;

    const question =
        state.tka.questions[state.tka.currentQuestion];

    if (!question) {
        finishTKA();
        return;
    }

    const answered =
        state.tka.answers.find(
            item => item.questionId === question.id
        );

    area.innerHTML = `
        <div class="glass-card">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    gap:16px;
                    flex-wrap:wrap;
                "
            >
                <div>
                    <span class="eyebrow">
                        ${escapeHTML(question.subject)}
                    </span>

                    <strong>
                        Soal ${state.tka.currentQuestion + 1}
                        dari ${state.tka.questions.length}
                    </strong>
                </div>

                ${
                    state.tka.mode === "tryout"
                        ? `
                            <div>
                                <strong>Timer</strong>
                                <div id="tka-timer">
                                    00:00
                                </div>
                            </div>
                        `
                        : ""
                }
            </div>

            <div style="margin-top:20px;">
                <span>
                    Kompetensi:
                    ${escapeHTML(question.competency)}
                </span>

                <span style="margin-left:10px;">
                    Kesulitan:
                    ${escapeHTML(question.difficulty)}
                </span>
            </div>

            ${
                question.passage
                    ? `
                        <div
                            style="
                                margin-top:20px;
                                padding:18px;
                                border-left:4px solid var(--accent);
                                background:rgba(255,255,255,.28);
                                border-radius:12px;
                            "
                        >
                            ${escapeHTML(question.passage)}
                        </div>
                    `
                    : ""
            }

            <h3 style="margin-top:24px;">
                ${escapeHTML(question.question)}
            </h3>

            <div
                style="
                    display:grid;
                    gap:12px;
                    margin-top:20px;
                "
            >
                ${question.options.map((option, index) => `
                    <button
                        class="
                            secondary-button
                            tka-option
                            ${answered?.selected === index ? "active" : ""}
                        "
                        data-option="${index}"
                    >
                        ${String.fromCharCode(65 + index)}.
                        ${escapeHTML(option)}
                    </button>
                `).join("")}
            </div>

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    gap:10px;
                    margin-top:24px;
                    flex-wrap:wrap;
                "
            >
                <button
                    class="secondary-button"
                    id="tka-prev"
                    ${state.tka.currentQuestion === 0 ? "disabled" : ""}
                >
                    Sebelumnya
                </button>

                <button
                    class="primary-button"
                    id="tka-next"
                    ${answered ? "" : "disabled"}
                >
                    ${
                        state.tka.currentQuestion ===
                        state.tka.questions.length - 1
                            ? "Selesai"
                            : "Berikutnya"
                    }
                </button>
            </div>
        </div>
    `;

    if (state.tka.mode === "tryout") {
        updateTKATimer();
    }

    $$(".tka-option").forEach(button => {
        button.addEventListener("click", () => {
            const selected =
                Number(button.dataset.option);

            const existing =
                state.tka.answers.findIndex(
                    item =>
                        item.questionId === question.id
                );

            const answerData = {
                questionId: question.id,
                selected,
                correct:
                    selected === question.answer
            };

            if (existing >= 0) {
                state.tka.answers[existing] = answerData;
            } else {
                state.tka.answers.push(answerData);
            }

            renderTKAQuestion();
        });
    });

    $("#tka-prev")?.addEventListener(
        "click",
        () => {
            if (state.tka.currentQuestion > 0) {
                state.tka.currentQuestion--;
                renderTKAQuestion();
            }
        }
    );

    $("#tka-next")?.addEventListener(
        "click",
        () => {
            const currentAnswer =
                state.tka.answers.find(
                    item =>
                        item.questionId === question.id
                );

            if (!currentAnswer) {
                showToast("Pilih jawaban terlebih dahulu.");
                return;
            }

            if (
                state.tka.currentQuestion ===
                state.tka.questions.length - 1
            ) {
                finishTKA();
            } else {
                state.tka.currentQuestion++;
                renderTKAQuestion();
            }
        }
    );
}


/* =========================================================
   TKA RESULT ANALYSIS
   ========================================================= */

function calculateTKAAnalysis() {
    const questions = state.tka.questions;
    const answers = state.tka.answers;

    const competencyMap = {};
    const difficultyMap = {};

    questions.forEach(question => {
        const answer =
            answers.find(
                item => item.questionId === question.id
            );

        const correct =
            answer?.correct ? 1 : 0;

        if (!competencyMap[question.competency]) {
            competencyMap[question.competency] = {
                correct: 0,
                total: 0
            };
        }

        competencyMap[question.competency].correct += correct;
        competencyMap[question.competency].total++;

        if (!difficultyMap[question.difficulty]) {
            difficultyMap[question.difficulty] = {
                correct: 0,
                total: 0
            };
        }

        difficultyMap[question.difficulty].correct += correct;
        difficultyMap[question.difficulty].total++;
    });

    const competencyStats =
        Object.entries(competencyMap)
            .map(([competency, data]) => ({
                competency,
                correct: data.correct,
                total: data.total,
                percentage:
                    Math.round(
                        (data.correct / data.total) * 100
                    )
            }))
            .sort(
                (a, b) =>
                    b.percentage - a.percentage
            );

    const difficultyStats =
        Object.entries(difficultyMap)
            .map(([difficulty, data]) => ({
                difficulty,
                correct: data.correct,
                total: data.total,
                percentage:
                    Math.round(
                        (data.correct / data.total) * 100
                    )
            }));

    const totalCorrect =
        answers.filter(item => item.correct).length;

    const total =
        questions.length;

    const percentage =
        total > 0
            ? Math.round(
                (totalCorrect / total) * 100
            )
            : 0;

    return {
        totalCorrect,
        total,
        percentage,
        competencyStats,
        difficultyStats
    };
}

function getPerformanceLabel(score) {
    if (score >= 90) return "Sangat kuat";
    if (score >= 80) return "Kuat";
    if (score >= 70) return "Cukup kuat";
    if (score >= 60) return "Perlu penguatan";
    return "Perlu belajar kembali";
}

function getRecommendation(stats) {
    if (!stats.length) {
        return "Kerjakan lebih banyak latihan agar pola kemampuanmu dapat dianalisis.";
    }

    const weakest =
        [...stats].sort(
            (a, b) =>
                a.percentage - b.percentage
        )[0];

    if (weakest.percentage >= 80) {
        return "Secara umum kemampuanmu cukup merata. Tingkatkan tantangan dengan soal penalaran yang lebih kompleks.";
    }

    return `Prioritaskan kembali materi ${weakest.competency}. Setelah itu, kerjakan latihan serupa untuk melihat peningkatan.`;
}


/* =========================================================
   FINISH TKA
   ========================================================= */

function finishTKA() {
    clearInterval(state.tka.timer);
    state.tka.timer = null;

    state.tka.finishedAt =
        new Date().toISOString();

    const analysis =
        calculateTKAAnalysis();

    const strongest =
        analysis.competencyStats[0];

    const weakest =
        [...analysis.competencyStats]
            .sort(
                (a, b) =>
                    a.percentage - b.percentage
            )[0];

    const result = {
        id:
            `tka-${Date.now()}-${Math.random()}`,

        date:
            new Date().toISOString(),

        subject:
            state.tka.subject,

        competency:
            state.tka.competency,

        difficulty:
            state.tka.difficulty,

        mode:
            state.tka.mode,

        total:
            analysis.total,

        correct:
            analysis.totalCorrect,

        percentage:
            analysis.percentage,

        competencyStats:
            analysis.competencyStats,

        difficultyStats:
            analysis.difficultyStats,

        strongest:
            strongest?.competency || "-",

        weakest:
            weakest?.competency || "-",

        durationSeconds:
            Math.round(
                (
                    new Date(state.tka.finishedAt)
                    -
                    new Date(state.tka.startedAt)
                ) / 1000
            )
    };

    saveTKAAttempt(result);

    renderTKAResult(result);
}


/* =========================================================
   TKA RESULT UI
   ========================================================= */

function renderTKAResult(result) {
    const area = $("#tka-practice-area");

    if (!area) return;

    area.innerHTML = `
        <div class="glass-card">

            <span class="eyebrow">
                HASIL TKA FJIS
            </span>

            <h2 style="font-size:48px;">
                ${result.percentage}
            </h2>

            <p>
                ${result.correct}
                benar dari
                ${result.total}
                soal.
            </p>

            <p>
                Performa:
                <strong>
                    ${getPerformanceLabel(result.percentage)}
                </strong>
            </p>

            <div
                style="
                    display:grid;
                    gap:14px;
                    margin-top:24px;
                "
            >
                <div>
                    <strong>Kompetensi terkuat</strong>
                    <p>
                        ${escapeHTML(result.strongest)}
                    </p>
                </div>

                <div>
                    <strong>Kompetensi yang perlu diperkuat</strong>
                    <p>
                        ${escapeHTML(result.weakest)}
                    </p>
                </div>
            </div>

            <div style="margin-top:24px;">
                <h3>Analisis Kompetensi</h3>

                ${result.competencyStats.map(item => `
                    <div style="margin-top:16px;">
                        <div
                            style="
                                display:flex;
                                justify-content:space-between;
                                gap:10px;
                            "
                        >
                            <span>
                                ${escapeHTML(item.competency)}
                            </span>

                            <strong>
                                ${item.percentage}%
                            </strong>
                        </div>

                        <div
                            style="
                                height:8px;
                                margin-top:7px;
                                border-radius:20px;
                                background:rgba(0,0,0,.08);
                                overflow:hidden;
                            "
                        >
                            <div
                                style="
                                    width:${item.percentage}%;
                                    height:100%;
                                    background:var(--accent);
                                "
                            ></div>
                        </div>
                    </div>
                `).join("")}
            </div>

            <div style="margin-top:28px;">
                <h3>Analisis Kesulitan</h3>

                ${result.difficultyStats.map(item => `
                    <p>
                        <strong>
                            ${escapeHTML(item.difficulty)}
                        </strong>:
                        ${item.correct}/${item.total}
                        (${item.percentage}%)
                    </p>
                `).join("")}
            </div>

            <div
                style="
                    margin-top:24px;
                    padding:18px;
                    background:rgba(255,255,255,.32);
                    border-radius:16px;
                "
            >
                <strong>Rekomendasi belajar</strong>

                <p style="margin-bottom:0;">
                    ${escapeHTML(
                        getRecommendation(
                            result.competencyStats
                        )
                    )}
                </p>
            </div>

            <div
                style="
                    display:flex;
                    gap:10px;
                    flex-wrap:wrap;
                    margin-top:24px;
                "
            >
                <button
                    class="primary-button"
                    id="tka-again"
                >
                    Coba Lagi
                </button>

                <button
                    class="secondary-button"
                    id="tka-history-button"
                >
                    Lihat Riwayat
                </button>

                <button
                    class="secondary-button"
                    id="tka-weakness-button"
                >
                    Latihan Fokus Kelemahan
                </button>
            </div>

            <div
                id="tka-result-discussion"
                style="margin-top:24px;"
            ></div>
        </div>
    `;

    $("#tka-again")?.addEventListener(
        "click",
        () => {
            renderTKASetup();
            renderTKAHistory();
        }
    );

    $("#tka-history-button")?.addEventListener(
        "click",
        renderTKAHistory
    );

    $("#tka-weakness-button")?.addEventListener(
        "click",
        () => {
            state.tka.mode = "kelemahan";
            renderTKASetup();
            showToast(
                "Mode Fokus Kelemahan sudah dipilih."
            );
        }
    );
}


/* =========================================================
   TKA HISTORY
   ========================================================= */

function renderTKAHistory() {
    const area = $("#tka-history-area");

    if (!area) return;

    const history =
        getTKAUserHistory();

    if (!history.length) {
        area.innerHTML = `
            <div class="glass-card" style="margin-top:24px;">
                <h3>Riwayat TKA</h3>

                <p>
                    Belum ada riwayat latihan TKA.
                    Kerjakan latihan pertama kamu.
                </p>
            </div>
        `;

        return;
    }

    const weak =
        getWeakCompetencies();

    area.innerHTML = `
        <div class="glass-card" style="margin-top:24px;">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    gap:12px;
                    flex-wrap:wrap;
                "
            >
                <div>
                    <span class="eyebrow">
                        HISTORY
                    </span>

                    <h3>
                        Riwayat Latihan TKA
                    </h3>
                </div>

                ${
                    weak.length
                        ? `
                            <div>
                                <strong>
                                    Fokus berikutnya:
                                </strong>

                                <p>
                                    ${escapeHTML(
                                        weak[0].competency
                                    )}
                                    —
                                    ${weak[0].percentage}%
                                </p>
                            </div>
                        `
                        : ""
                }
            </div>

            <div
                style="
                    display:grid;
                    gap:14px;
                    margin-top:20px;
                "
            >
                ${history.map(item => `
                    <div
                        style="
                            padding:16px;
                            border-radius:16px;
                            background:rgba(255,255,255,.28);
                        "
                    >
                        <div
                            style="
                                display:flex;
                                justify-content:space-between;
                                gap:12px;
                                flex-wrap:wrap;
                            "
                        >
                            <strong>
                                ${escapeHTML(
                                    item.subject
                                )}
                            </strong>

                            <strong>
                                ${item.percentage}
                            </strong>
                        </div>

                        <p>
                            ${formatDateTime(item.date)}
                        </p>

                        <p>
                            Mode:
                            ${escapeHTML(item.mode)}
                            <br>

                            Benar:
                            ${item.correct}/${item.total}
                            <br>

                            Terkuat:
                            ${escapeHTML(item.strongest)}
                            <br>

                            Perlu diperkuat:
                            ${escapeHTML(item.weakest)}
                        </p>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}


/* =========================================================
   SMA FOUNDATION
   ========================================================= */

const SMA_SUBJECTS = {
    "10": [
        "Matematika",
        "Bahasa Indonesia",
        "Bahasa Inggris",
        "Fisika",
        "Kimia",
        "Biologi",
        "Ekonomi",
        "Sejarah"
    ],

    "11": [
        "Matematika",
        "Bahasa Indonesia",
        "Bahasa Inggris",
        "Fisika",
        "Kimia",
        "Biologi",
        "Ekonomi",
        "Sejarah"
    ],

    "12": [
        "Matematika",
        "Bahasa Indonesia",
        "Bahasa Inggris",
        "Fisika",
        "Kimia",
        "Biologi",
        "Ekonomi",
        "Sejarah"
    ]
};

function renderSMALearning() {
    const area = $("#sma-learning-area");

    if (!area) return;

    area.innerHTML = `
        <div class="section-heading">
            <span class="eyebrow">
                SMA LEARNING
            </span>

            <h2>
                Bangun fondasi akademik untuk kelas 10–12.
            </h2>

            <p>
                Struktur SMA akan dikembangkan setelah mesin SMP
                dan TKA selesai diperkuat.
            </p>
        </div>

        <div id="sma-subject-area"></div>
    `;

    renderSMASubjects();
}

function renderSMASubjects() {
    const area = $("#sma-subject-area");

    if (!area) return;

    area.innerHTML = `
        <div class="glass-card">

            <h3>Pilih Kelas SMA</h3>

            <div class="program-grid">
                ${["10", "11", "12"].map(level => `
                    <button
                        class="secondary-button"
                        data-sma-level="${level}"
                    >
                        Kelas ${level}
                    </button>
                `).join("")}
            </div>

            <div
                id="sma-selected-subjects"
                style="margin-top:24px;"
            ></div>
        </div>
    `;

    $$("[data-sma-level]").forEach(button => {
        button.addEventListener("click", () => {
            const level =
                button.dataset.smaLevel;

            const target =
                $("#sma-selected-subjects");

            if (!target) return;

            target.innerHTML = `
                <h3>
                    Mata Pelajaran Kelas ${level}
                </h3>

                <div class="program-grid">
                    ${SMA_SUBJECTS[level].map(subject => `
                        <button
                            class="secondary-button"
                        >
                            ${escapeHTML(subject)}
                        </button>
                    `).join("")}
                </div>
            `;
        });
    });
}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.FJIS = {
    state,

    showPage,

    getCurrentUser,

    renderTKAPage,

    startTKA,

    getTKAUserHistory,

    getWeakCompetencies,

    renderSMPLearning,

    renderSMALearning
};


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setupNavigation();
    setupRegister();
    setupLogin();
    setupLogout();
    setupDashboardNavigation();

    const user = getCurrentUser();

    if (user) {
        /*
           Jangan langsung memaksa dashboard.
           User tetap bisa melihat landing page.
        */
        updateDashboard();
    }

    /*
       Jika halaman SMP dibuka dari dashboard,
       sistem akan siap digunakan.
    */

});


/* =========================================================
   IDENTITY SYNC STARTUP
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    syncCurrentUserIdentity();
});
