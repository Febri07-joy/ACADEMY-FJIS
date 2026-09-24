/* =========================================================
   FJIS ACADEMY
   TKA TRYOUT DATA ENGINE
   File : tka-data.js
   =========================================================

   Fungsi:
   - Menyimpan konfigurasi paket tryout
   - Menentukan mapel wajib
   - Menentukan mapel pilihan
   - Sistem kode akses / referral
   - Struktur data soal
   - Struktur tipe soal
   - Struktur penilaian
   - Menjadi jembatan untuk tka-tryout.js

   CATATAN:
   Soal lengkap akan dimasukkan ke QUESTION_BANK.
   Struktur ini dibuat supaya soal dari file-file TKA
   yang sudah disiapkan bisa dimasukkan tanpa mengubah
   engine utama.
   ========================================================= */


/* =========================================================
   1. INFORMASI PROGRAM
   ========================================================= */

const FJIS_TKA_SOURCE = {
    wajib: "./sources/wajib.js",
    pilihan: [
        "./sources/pilihan-bagian-1.js",
        "./sources/pilihan-bagian-2.js",
        "./sources/pilihan-bagian-3.js"
    ]
};

const FJIS_TKA_SOURCE_MAP = {
    wajib: {
        "bahasa-indonesia": "wajib",
        "matematika": "wajib",
        "bahasa-inggris": "wajib"
    },
    pilihan: {
        "ekonomi": ["pilihan-bagian-1", "pilihan-bagian-3"],
        "ppkn": ["pilihan-bagian-1"],
        "sejarah": ["pilihan-bagian-1"],
        "matematika-lanjutan": ["pilihan-bagian-2"],
        "geografi": ["pilihan-bagian-2"],
        "sosiologi": ["pilihan-bagian-2"],
        "fisika": ["pilihan-bagian-3"],
        "kimia": [],
        "biologi": ["pilihan-bagian-3"]
    }
};

function getFJISTKASource(subjectId) {
    const subject = getFJISTKASubject(subjectId);
    if (!subject) return null;

    if (subject.category === "wajib") {
        return {
            type: "wajib",
            files: [FJIS_TKA_SOURCE.wajib]
        };
    }

    const keys = FJIS_TKA_SOURCE_MAP.pilihan[subjectId] || [];
    const files = keys.map((key) => {
        const match = key.match(/(\d+)$/);
        if (!match) return null;
        const index = Number(match[1]) - 1;
        return FJIS_TKA_SOURCE.pilihan[index] || null;
    }).filter(Boolean);

    return {
        type: "pilihan",
        files
    };
}

const FJIS_TKA_CONFIG = {

    programName: "FJIS Academy",

    programTitle: "TKA SMA Kelas 12",

    year: 2026,

    level: "SMA",

    grade: 12,

    type: "Tryout TKA",

    scoreMin: 1,

    scoreMax: 100,

    /* -----------------------------------------
       MAPEL WAJIB
       ----------------------------------------- */

    mandatorySubjects: [
        {
            id: "bahasa-indonesia",
            name: "Bahasa Indonesia",
            shortName: "B. Indonesia",

            category: "wajib",

            questionCount: 30,

            durationMinutes: 45,

            order: 1,

            source: "wajib"
        },

        {
            id: "matematika",
            name: "Matematika",

            category: "wajib",

            questionCount: 25,

            durationMinutes: 50,

            order: 2,

            source: "wajib"
        },

        {
            id: "bahasa-inggris",
            name: "Bahasa Inggris",
            shortName: "B. Inggris",

            category: "wajib",

            questionCount: 30,

            durationMinutes: 45,

            order: 3,

            source: "wajib"
        }
    ],


    /* -----------------------------------------
       MAPEL PILIHAN YANG DIDUKUNG FJIS
       -----------------------------------------

       FJIS menyediakan 9 mapel pilihan.
       Peserta maksimal memilih 2.
       ----------------------------------------- */

    optionalSubjects: [

        {
            id: "fisika",
            name: "Fisika",

            category: "pilihan",

            questionCount: 25,

            durationMinutes: 60,

            order: 4,

            source: "pilihan"
        },

        {
            id: "kimia",
            name: "Kimia",

            category: "pilihan",

            questionCount: 30,

            durationMinutes: 60,

            order: 5,

            source: "pilihan"
        },

        {
            id: "biologi",
            name: "Biologi",

            category: "pilihan",

            questionCount: 30,

            durationMinutes: 60,

            order: 6,

            source: "pilihan"
        },

        {
            id: "ekonomi",
            name: "Ekonomi",

            category: "pilihan",

            questionCount: 30,

            durationMinutes: 60,

            order: 7,

            source: "pilihan"
        },

        {
            id: "sejarah",
            name: "Sejarah",

            category: "pilihan",

            questionCount: 30,

            durationMinutes: 60,

            order: 8,

            source: "pilihan"
        },

        {
            id: "ppkn",
            name: "PPKn",

            category: "pilihan",

            questionCount: 30,

            durationMinutes: 60,

            order: 9,

            source: "pilihan"
        },

        {
            id: "matematika-lanjutan",
            name: "Matematika Tingkat Lanjut",

            category: "pilihan",

            questionCount: 30,

            durationMinutes: 60,

            order: 10,

            source: "pilihan"
        },

        {
            id: "geografi",
            name: "Geografi",

            category: "pilihan",

            questionCount: 30,

            durationMinutes: 60,

            order: 11,

            source: "pilihan"
        },

        {
            id: "sosiologi",
            name: "Sosiologi",

            category: "pilihan",

            questionCount: 30,

            durationMinutes: 60,

            order: 12,

            source: "pilihan"
        }
    ],


    /* -----------------------------------------
       ATURAN PEMILIHAN
       ----------------------------------------- */

    selectionRules: {

        mandatoryMinimum: 3,

        mandatoryMaximum: 3,

        optionalMinimum: 2,

        optionalMaximum: 2,

        totalSubjects: 5

    }

};


/* =========================================================
   2. KODE AKSES TRYOUT
   =========================================================

   Satu kode = satu paket.

   Nanti kode ini bisa dibuat berbeda untuk:
   - Paket 1
   - Paket 2
   - Paket 3
   - Paket khusus sekolah
   - Paket khusus kelas
   - Paket referral
   ========================================================= */

const FJIS_TKA_PACKAGES = {

    "FJIS-TKA-2026-001": {

        id: "tka-2026-001",

        code: "FJIS-TKA-2026-001",

        title: "TKA Kelas 12 — Paket 1",

        description:
            "Paket tryout TKA SMA Kelas 12 FJIS Academy.",

        active: true,

        maxUsage: 0,

        used: 0,

        mandatorySubjects: [
            "bahasa-indonesia",
            "matematika",
            "bahasa-inggris"
        ],

        optionalPool: [
            "fisika",
            "kimia",
            "biologi",
            "ekonomi",
            "sejarah",
            "ppkn",
            "matematika-lanjutan",
            "geografi",
            "sosiologi"
        ]

    },


    "Q8V7-XM2K-PL9R": {

        id: "tka-2026-002",

        code: "Q8V7-XM2K-PL9R",

        title: "TKA Kelas 12 — Paket 2",

        description:
            "Paket tryout TKA SMA Kelas 12 FJIS Academy — Paket 2.",

        active: true,

        maxUsage: 0,

        used: 0,

        mandatorySubjects: [
            "bahasa-indonesia",
            "matematika",
            "bahasa-inggris"
        ],

        optionalPool: [
            "fisika",
            "kimia",
            "biologi",
            "ekonomi",
            "sejarah",
            "ppkn",
            "matematika-lanjutan",
            "geografi",
            "sosiologi"
        ],

        packageSource: "Paket 2 — bank soal sumber asli FJIS",
        packageSourcePath: "./paket-2/"

    },

    "FJIS-TKA-DEMO": {

        id: "tka-demo",

        code: "FJIS-TKA-DEMO",

        title: "TKA Kelas 12 — Demo",

        description:
            "Paket demo untuk pengujian sistem tryout.",

        active: true,

        maxUsage: 0,

        used: 0,

        mandatorySubjects: [
            "bahasa-indonesia",
            "matematika",
            "bahasa-inggris"
        ],

        optionalPool: [
            "fisika",
            "kimia",
            "biologi",
            "ekonomi",
            "sejarah",
            "ppkn",
            "matematika-lanjutan",
            "geografi",
            "sosiologi"
        ]

    }

};


/* =========================================================
   3. TIPE SOAL
   =========================================================

   Engine akan menggunakan tipe ini untuk menentukan
   bagaimana jawaban peserta diperiksa.
   ========================================================= */

const FJIS_TKA_QUESTION_TYPES = {

    PG: {

        id: "PG",

        name: "Pilihan Ganda",

        description:
            "Peserta memilih satu jawaban.",

        maxAnswer: 1

    },


    MCMA: {

        id: "MCMA",

        name: "Pilihan Ganda Kompleks",

        description:
            "Peserta dapat memilih lebih dari satu jawaban.",

        maxAnswer: null

    },


    KATEGORI: {

        id: "KATEGORI",

        name: "Kategori",

        description:
            "Peserta menentukan kategori pada setiap pernyataan.",

        maxAnswer: null

    },


    BS: {

        id: "BS",

        name: "Benar / Salah",

        description:
            "Peserta menentukan benar atau salah.",

        maxAnswer: null

    }

};


/* =========================================================
   4. QUESTION BANK
   =========================================================

   TEMPAT DATA SOAL DINORMALISASI.

   Format dibuat fleksibel karena file sumber yang diberikan
   mempunyai beberapa bentuk struktur jawaban.

   Contoh PG:
   {
       id: "mtk-001",
       subjectId: "matematika",
       type: "PG",
       question: "...",
       options: [
           { id: "A", text: "..." },
           { id: "B", text: "..." },
           ...
       ],
       answer: "B",
       explanation: "..."
   }

   Contoh MCMA:

   answer: ["A", "C"]

   Contoh KATEGORI:

   statements: [
       {
           text: "...",
           answer: "B"
       },
       {
           text: "...",
           answer: "S"
       }
   ]

   ========================================================= */

const FJIS_TKA_QUESTION_BANK = {


    "bahasa-indonesia": [],


    "matematika": [],


    "bahasa-inggris": [],


    "fisika": [],


    "kimia": [],


    "biologi": [],


    "ekonomi": [],


    "sejarah": [],


    "ppkn": [],


    "matematika-lanjutan": [],


    "geografi": [],


    "sosiologi": []

};


/* =========================================================
   5. FUNGSI NORMALISASI MAPEL
   ========================================================= */

function getFJISTKASubject(subjectId) {

    const allSubjects = [

        ...FJIS_TKA_CONFIG.mandatorySubjects,

        ...FJIS_TKA_CONFIG.optionalSubjects

    ];

    return allSubjects.find(
        subject => subject.id === subjectId
    ) || null;

}


/* =========================================================
   6. AMBIL SEMUA MAPEL
   ========================================================= */

function getFJISTKAAllSubjects() {

    return [

        ...FJIS_TKA_CONFIG.mandatorySubjects,

        ...FJIS_TKA_CONFIG.optionalSubjects

    ];

}


/* =========================================================
   7. AMBIL MAPEL WAJIB
   ========================================================= */

function getFJISTKAMandatorySubjects() {

    return FJIS_TKA_CONFIG.mandatorySubjects.map(
        subject => ({ ...subject })
    );

}


/* =========================================================
   8. AMBIL MAPEL PILIHAN
   ========================================================= */

function getFJISTKAOptionalSubjects() {

    return FJIS_TKA_CONFIG.optionalSubjects.map(
        subject => ({ ...subject })
    );

}


/* =========================================================
   9. VALIDASI KODE AKSES
   ========================================================= */

function validateFJISTKAAccessCode(code) {

    if (!code) {

        return {
            valid: false,
            reason: "Kode akses belum diisi."
        };

    }

    const normalizedCode =
        String(code).trim().toUpperCase();

    const packageData =
        FJIS_TKA_PACKAGES[normalizedCode];

    if (!packageData) {

        return {
            valid: false,
            reason: "Kode akses tidak ditemukan."
        };

    }

    if (!packageData.active) {

        return {
            valid: false,
            reason: "Paket tryout ini sedang tidak aktif."
        };

    }

    if (
        packageData.maxUsage > 0 &&
        packageData.used >= packageData.maxUsage
    ) {

        return {
            valid: false,
            reason: "Kuota penggunaan paket sudah habis."
        };

    }

    return {

        valid: true,

        package: {
            ...packageData
        }

    };

}


/* =========================================================
   10. VALIDASI MAPEL PILIHAN
   ========================================================= */

function validateFJISTKAOptionalSelection(
    selectedSubjectIds
) {

    if (!Array.isArray(selectedSubjectIds)) {

        return {
            valid: false,
            reason: "Data mapel pilihan tidak valid."
        };

    }


    const uniqueSubjects =
        [...new Set(selectedSubjectIds)];


    if (
        uniqueSubjects.length !==
        FJIS_TKA_CONFIG.selectionRules.optionalMaximum
    ) {

        return {

            valid: false,

            reason:
                `Pilih tepat ${FJIS_TKA_CONFIG.selectionRules.optionalMaximum} mapel pilihan.`

        };

    }


    const availableIds =
        FJIS_TKA_CONFIG.optionalSubjects
            .map(subject => subject.id);


    const invalid =
        uniqueSubjects.some(
            id => !availableIds.includes(id)
        );


    if (invalid) {

        return {

            valid: false,

            reason:
                "Terdapat mapel pilihan yang tidak tersedia."

        };

    }


    return {

        valid: true,

        selected:
            uniqueSubjects

    };

}


/* =========================================================
   11. MEMBENTUK URUTAN UJIAN
   =========================================================

   URUTAN TIDAK BOLEH DIUBAH:

   1. Bahasa Indonesia
   2. Matematika
   3. Bahasa Inggris
   4. Pilihan pertama
   5. Pilihan kedua
   ========================================================= */

function buildFJISTKAExamOrder(
    selectedOptionalSubjects
) {

    const validation =
        validateFJISTKAOptionalSelection(
            selectedOptionalSubjects
        );


    if (!validation.valid) {

        return {

            valid: false,

            reason: validation.reason

        };

    }


    const mandatory =
        getFJISTKAMandatorySubjects();


    const optional =
        validation.selected.map(
            id => getFJISTKASubject(id)
        );


    optional.sort(
        (a, b) => a.order - b.order
    );


    return {

        valid: true,

        subjects: [

            ...mandatory,

            ...optional

        ]

    };

}


/* =========================================================
   12. AMBIL SOAL BERDASARKAN MAPEL
   ========================================================= */

function getFJISTKAQuestions(subjectId) {

    const questions =
        FJIS_TKA_QUESTION_BANK[subjectId];


    if (!Array.isArray(questions)) {

        return [];

    }


    return questions.map(
        question => ({ ...question })
    );

}


/* =========================================================
   13. HITUNG NILAI TRYOUT
   =========================================================

   Nilai FJIS:

   jumlah poin diperoleh
   ---------------------- × 100
   jumlah poin maksimal

   HASIL INI ADALAH:
   "Nilai Tryout FJIS"

   Bukan klaim sebagai skor resmi pemerintah.
   ========================================================= */

function calculateFJISTKAScore(
    questions,
    answers
) {

    if (!Array.isArray(questions)) {

        return {

            score: 0,

            correct: 0,

            total: 0

        };

    }


    let correct = 0;


    questions.forEach(
        question => {

            const userAnswer =
                answers?.[question.id];


            if (
                isFJISTKAAnswerCorrect(
                    question,
                    userAnswer
                )
            ) {

                correct++;

            }

        }
    );


    const total =
        questions.length;


    const score =
        total > 0
            ? Math.round(
                (correct / total) * 100
            )
            : 0;


    return {

        score: score,

        correct: correct,

        total: total

    };

}


/* =========================================================
   14. PEMERIKSAAN JAWABAN
   ========================================================= */

function isFJISTKAAnswerCorrect(
    question,
    userAnswer
) {

    if (!question) {

        return false;

    }


    /* -----------------------------------------
       PG
       ----------------------------------------- */

    if (question.type === "PG") {

        return (
            String(userAnswer || "")
                .toUpperCase() ===
            String(question.answer || "")
                .toUpperCase()
        );

    }


    /* -----------------------------------------
       MCMA
       ----------------------------------------- */

    if (question.type === "MCMA") {

        const correctAnswers =
            normalizeAnswerArray(
                question.answer
            );

        const selectedAnswers =
            normalizeAnswerArray(
                userAnswer
            );


        if (
            correctAnswers.length !==
            selectedAnswers.length
        ) {

            return false;

        }


        return correctAnswers.every(
            answer =>
                selectedAnswers.includes(answer)
        );

    }


    /* -----------------------------------------
       KATEGORI / BS
       ----------------------------------------- */

    if (
        question.type === "KATEGORI" ||
        question.type === "BS"
    ) {

        return compareStructuredAnswers(
            question,
            userAnswer
        );

    }


    return false;

}


/* =========================================================
   15. NORMALISASI ARRAY JAWABAN
   ========================================================= */

function normalizeAnswerArray(answer) {

    if (Array.isArray(answer)) {

        return answer
            .map(
                value =>
                    String(value)
                        .trim()
                        .toUpperCase()
            )
            .sort();

    }


    if (answer === null || answer === undefined) {

        return [];

    }


    return [

        String(answer)
            .trim()
            .toUpperCase()

    ];

}


/* =========================================================
   16. PEMBANDING JAWABAN TERSTRUKTUR
   ========================================================= */

function compareStructuredAnswers(
    question,
    userAnswer
) {

    if (
        !Array.isArray(question.statements)
    ) {

        return false;

    }


    if (
        !Array.isArray(userAnswer)
    ) {

        return false;

    }


    if (
        question.statements.length !==
        userAnswer.length
    ) {

        return false;

    }


    return question.statements.every(
        (statement, index) => {

            const expected =
                String(
                    statement.answer || ""
                )
                    .trim()
                    .toUpperCase();


            const actual =
                String(
                    userAnswer[index] || ""
                )
                    .trim()
                    .toUpperCase();


            return expected === actual;

        }
    );

}


/* =========================================================
   17. KATEGORI NILAI FJIS
   =========================================================

   Kategori ini digunakan untuk tampilan internal
   nilai tryout FJIS.

   BUKAN kategori skor resmi TKA pemerintah.
   ========================================================= */

function getFJISTKAScoreCategory(score) {

    const value =
        Number(score) || 0;


    if (value >= 90) {

        return {

            label: "Istimewa",

            description:
                "Penguasaan materi sangat tinggi."

        };

    }


    if (value >= 80) {

        return {

            label: "Sangat Baik",

            description:
                "Penguasaan materi sangat baik."

        };

    }


    if (value >= 70) {

        return {

            label: "Baik",

            description:
                "Penguasaan materi sudah baik."

        };

    }


    if (value >= 60) {

        return {

            label: "Memenuhi",

            description:
                "Penguasaan materi sudah memenuhi dasar."

        };

    }


    if (value >= 50) {

        return {

            label: "Perlu Penguatan",

            description:
                "Masih ada beberapa kompetensi yang perlu diperkuat."

        };

    }


    return {

        label: "Perlu Pembinaan",

        description:
            "Materi perlu dipelajari dan dilatih kembali."

    };

}


/* =========================================================
   18. MEMBENTUK DATA HASIL MAPEL
   ========================================================= */

function buildFJISTKASubjectResult(
    subjectId,
    questions,
    answers
) {

    const subject =
        getFJISTKASubject(subjectId);


    const scoreData =
        calculateFJISTKAScore(
            questions,
            answers
        );


    const category =
        getFJISTKAScoreCategory(
            scoreData.score
        );


    return {

        subjectId: subjectId,

        subjectName:
            subject
                ? subject.name
                : subjectId,

        category:
            subject
                ? subject.category
                : null,

        score:
            scoreData.score,

        correct:
            scoreData.correct,

        total:
            scoreData.total,

        categoryLabel:
            category.label,

        categoryDescription:
            category.description,

        completedAt:
            new Date().toISOString()

    };

}


/* =========================================================
   19. VALIDASI PAKET LENGKAP
   ========================================================= */

function validateFJISTKAPackage(
    packageData,
    selectedOptionalSubjects
) {

    if (!packageData) {

        return {

            valid: false,

            reason:
                "Paket tryout tidak ditemukan."

        };

    }


    const examOrder =
        buildFJISTKAExamOrder(
            selectedOptionalSubjects
        );


    if (!examOrder.valid) {

        return {

            valid: false,

            reason:
                examOrder.reason

        };

    }


    return {

        valid: true,

        subjects:
            examOrder.subjects

    };

}


/* =========================================================
   20. EXPORT / GLOBAL OBJECT
   =========================================================

   Karena project FJIS saat ini memakai HTML + JS biasa,
   kita expose semua data ke window.

   tka-tryout.js nantinya akan membaca:
   window.FJIS_TKA_CONFIG
   window.FJIS_TKA_PACKAGES
   window.FJIS_TKA_QUESTION_BANK
   ========================================================= */

window.FJIS_TKA_SOURCE = FJIS_TKA_SOURCE;
window.FJIS_TKA_SOURCE_MAP = FJIS_TKA_SOURCE_MAP;
window.getFJISTKASource = getFJISTKASource;

window.FJIS_TKA_CONFIG =
    FJIS_TKA_CONFIG;

window.FJIS_TKA_PACKAGES =
    FJIS_TKA_PACKAGES;

/* Paket 2 diaktifkan lewat kode akses acak Q8V7-XM2K-PL9R.
   Bank soal Paket 2 tetap dipisahkan dari QUESTION_BANK Paket 1. */
window.FJIS_TKA_PACKAGE_2_CODE = "Q8V7-XM2K-PL9R";
window.FJIS_TKA_PACKAGE_2_ID = "tka-2026-002";

window.FJIS_TKA_QUESTION_TYPES =
    FJIS_TKA_QUESTION_TYPES;

window.FJIS_TKA_QUESTION_BANK =
    FJIS_TKA_QUESTION_BANK;

window.getFJISTKASubject =
    getFJISTKASubject;

window.getFJISTKAAllSubjects =
    getFJISTKAAllSubjects;

window.getFJISTKAMandatorySubjects =
    getFJISTKAMandatorySubjects;

window.getFJISTKAOptionalSubjects =
    getFJISTKAOptionalSubjects;

window.validateFJISTKAAccessCode =
    validateFJISTKAAccessCode;

window.validateFJISTKAOptionalSelection =
    validateFJISTKAOptionalSelection;

window.buildFJISTKAExamOrder =
    buildFJISTKAExamOrder;

window.getFJISTKAQuestions =
    getFJISTKAQuestions;

window.calculateFJISTKAScore =
    calculateFJISTKAScore;

window.isFJISTKAAnswerCorrect =
    isFJISTKAAnswerCorrect;

window.getFJISTKAScoreCategory =
    getFJISTKAScoreCategory;

window.buildFJISTKASubjectResult =
    buildFJISTKASubjectResult;

window.validateFJISTKAPackage =
    validateFJISTKAPackage;


/* =========================================================
   END OF TKA DATA ENGINE
   ========================================================= */