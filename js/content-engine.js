/* =========================================================
   FJIS ACADEMY — CONTENT ENGINE
   VERSION: SMA KELAS 10 + 11 + 12
   ========================================================= */

const FJISContent = {

    /* =====================================================
       BASIC HELPERS
       ===================================================== */

    escapeHTML(value) {
        if (value === null || value === undefined) return "";

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    normalize(value) {
        return String(
            value === null || value === undefined ? "" : value
        )
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    },

    slugify(value) {
        return this.normalize(value)
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    },


    /* =====================================================
       GENERIC JSON LOADER
       ===================================================== */

    async load(path) {

        try {

            console.log(
                "FJIS Content: fetching →",
                path
            );

            const separator =
                path.includes("?")
                    ? "&"
                    : "?";

            const requestPath =
                `${path}${separator}fjis_cache=${Date.now()}`;

            const response =
                await fetch(
                    requestPath,
                    {
                        method: "GET",
                        cache: "no-store",
                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status} — ${path}`
                );

            }

            const text =
                await response.text();

            if (!text.trim()) {

                throw new Error(
                    `Response JSON kosong — ${path}`
                );

            }

            let data;

            try {

                data =
                    JSON.parse(text);

            } catch (error) {

                console.error(
                    "FJIS JSON Parse Error:",
                    error
                );

                console.error(
                    "JSON Path:",
                    path
                );

                console.error(
                    "JSON Start:",
                    text.slice(0, 300)
                );

                throw new Error(
                    `JSON tidak valid — ${path}`
                );

            }

            if (
                !data ||
                typeof data !== "object" ||
                Array.isArray(data)
            ) {

                throw new Error(
                    `Root JSON tidak valid — ${path}`
                );

            }

            console.log(
                "FJIS Content: JSON OK →",
                path
            );

            return data;

        } catch (error) {

            console.error(
                "FJIS Content Error:",
                error
            );

            return null;
        }

    },


    /* =====================================================
       LOAD CLASS
       ===================================================== */

    async loadClass(classNumber) {

        const classId =
            String(classNumber)
                .replace(/^kelas[-_]?/i, "")
                .trim();

        const path =
            `../../data/sma/kelas-${classId}/subjects.json`;

        return await this.load(path);

    },

    /* =====================================================
       CLASS STRUCTURE HELPERS
       Kelas 10/11 lama + Kelas 12 subjects[] baru
       ===================================================== */

    isNewStructure(classData) {
        return !!(
            classData &&
            Array.isArray(classData.subjects)
        );
    },

    getClassSubjects(classData, semester = "") {
        if (!classData) return [];

        if (this.isNewStructure(classData)) {
            return Array.isArray(classData.subjects)
                ? classData.subjects
                : [];
        }

        const semesterData =
            this.getSemester(classData, semester);

        return semesterData &&
            Array.isArray(semesterData.subjects)
            ? semesterData.subjects
            : [];
    },

    getSubjectMetadata(classData, semester, subjectIdentifier) {
        if (!classData) return null;

        if (this.isNewStructure(classData)) {
            return this.findSubject(
                { subjects: classData.subjects },
                subjectIdentifier
            );
        }

        const semesterData =
            this.getSemester(classData, semester);

        return semesterData
            ? this.findSubject(
                semesterData,
                subjectIdentifier
            )
            : null;
    },

    getChapterSemester(chapter, fallback = "1") {
        if (!chapter || typeof chapter !== "object") {
            return fallback;
        }

        return (
            chapter.semester ??
            chapter.semesterNumber ??
            chapter.term ??
            fallback
        );
    },


    /* =====================================================
       STRUCTURE HELPERS
       ===================================================== */

    /*
     * Kelas 10 memakai struktur lama:
     *   classData.semesters -> semester -> subjects
     *
     * Kelas 11/12 memakai struktur baru:
     *   classData.subjects -> subject -> chapters
     *
     * Helper ini menjadi satu pintu untuk membedakan keduanya,
     * sehingga halaman lain tidak perlu menebak struktur JSON.
     */
    isNewStructure(classData) {
        return !!(
            classData &&
            Array.isArray(classData.subjects)
        );
    },

    getClassSubjects(classData, semester = "") {
        if (!classData) return [];

        if (this.isNewStructure(classData)) {
            return Array.isArray(classData.subjects)
                ? classData.subjects
                : [];
        }

        const semesterData =
            this.getSemester(classData, semester);

        return (
            semesterData &&
            Array.isArray(semesterData.subjects)
        )
            ? semesterData.subjects
            : [];
    },

    getSubjectMetadata(classData, semester, subjectIdentifier) {
        if (!classData) return null;

        if (this.isNewStructure(classData)) {
            return this.findSubject(
                { subjects: classData.subjects },
                subjectIdentifier
            );
        }

        const semesterData =
            this.getSemester(classData, semester);

        return semesterData
            ? this.findSubject(
                semesterData,
                subjectIdentifier
            )
            : null;
    },

    /* =====================================================
       SEMESTER HELPERS
       ===================================================== */

    getSemester(
        classData,
        semester
    ) {

        if (!classData) {
            return null;
        }

        const target =
            String(
                semester === null ||
                semester === undefined
                    ? ""
                    : semester
            ).trim();

        if (!target) {
            return null;
        }

        const targetNumber =
            Number(target);

        const semesters =
            classData.semesters;


        /*
         * =================================================
         * STRUKTUR KELAS 10
         *
         * semesters: {
         *     "1": {...},
         *     "2": {...}
         * }
         * =================================================
         */

        if (
            semesters &&
            typeof semesters === "object" &&
            !Array.isArray(semesters)
        ) {

            const keys = [

                target,

                String(targetNumber),

                `semester-${target}`,

                `semester${target}`,

                `sem-${target}`,

                `sem${target}`,

                `Semester ${target}`

            ];


            for (const key of keys) {

                if (
                    Object.prototype.hasOwnProperty.call(
                        semesters,
                        key
                    )
                ) {

                    return semesters[key];

                }

            }


            const foundKey =
                Object.keys(semesters)
                    .find(key => {

                        const digits =
                            String(key)
                                .replace(
                                    /[^0-9]/g,
                                    ""
                                );

                        return (
                            digits &&
                            Number(digits) ===
                                targetNumber
                        );

                    });


            if (foundKey) {

                return semesters[
                    foundKey
                ];

            }

        }


        /*
         * =================================================
         * STRUKTUR ALTERNATIF
         *
         * semesters: [
         *     {
         *         semester: 1,
         *         subjects: [...]
         *     }
         * ]
         * =================================================
         */

        if (Array.isArray(semesters)) {

            const found =
                semesters.find(item => {

                    if (
                        !item ||
                        typeof item !== "object"
                    ) {

                        return false;

                    }

                    const value =
                        item.semester ??
                        item.semesterNumber ??
                        item.term ??
                        item.id;

                    return (
                        String(
                            value ?? ""
                        ) === target ||
                        Number(value) ===
                            targetNumber
                    );

                });


            if (found) {
                return found;
            }

        }


        /*
         * =================================================
         * STRUKTUR ALTERNATIF:
         *
         * semester1
         * semester2
         * =================================================
         */

        const directKeys = [

            `semester-${target}`,

            `semester${target}`,

            `sem-${target}`,

            `sem${target}`

        ];


        for (
            const key of directKeys
        ) {

            if (
                classData[key] &&
                typeof classData[key] === "object"
            ) {

                return classData[key];

            }

        }


        return null;

    },


    getAvailableSemesters(classData) {

        if (!classData) {
            return [];
        }

        const result = [];

        const semesters =
            classData.semesters;


        if (
            semesters &&
            typeof semesters === "object" &&
            !Array.isArray(semesters)
        ) {

            Object.keys(
                semesters
            ).forEach(key => {

                const digits =
                    String(key)
                        .replace(
                            /[^0-9]/g,
                            ""
                        );

                if (digits) {

                    result.push(
                        String(
                            Number(digits)
                        )
                    );

                }

            });

        }


        if (Array.isArray(semesters)) {

            semesters.forEach(item => {

                if (
                    !item ||
                    typeof item !== "object"
                ) {

                    return;

                }

                const value =
                    item.semester ??
                    item.semesterNumber ??
                    item.term ??
                    item.id;

                if (
                    value !== null &&
                    value !== undefined
                ) {

                    result.push(
                        String(value)
                    );

                }

            });

        }


        [
            "1",
            "2"
        ].forEach(number => {

            if (
                this.getSemester(
                    classData,
                    number
                )
            ) {

                result.push(number);

            }

        });


        return [
            ...new Set(result)
        ].sort(
            (a, b) =>
                Number(a) - Number(b)
        );

    },


    /* =====================================================
       SUBJECT HELPERS
       ===================================================== */

    findSubject(
        data,
        subjectIdentifier
    ) {

        if (!data) {
            return null;
        }

        const subjects =
            Array.isArray(data)
                ? data
                : Array.isArray(data.subjects)
                    ? data.subjects
                    : [];


        if (!subjects.length) {
            return null;
        }


        const target =
            this.normalize(
                subjectIdentifier
            );


        if (!target) {
            return null;
        }


        return (
            subjects.find(
                subject => {

                    if (
                        !subject ||
                        typeof subject !== "object"
                    ) {

                        return false;

                    }

                    const values = [

                        subject.code,

                        subject.name,

                        subject.slug,

                        subject.file,

                        subject.folder,

                        subject.id

                    ];


                    return (
                        values.some(
                            value =>
                                this.normalize(
                                    value
                                ) === target
                        ) ||

                        values.some(
                            value =>
                                this.slugify(
                                    value
                                ) ===
                                this.slugify(
                                    target
                                )
                        )
                    );

                }
            ) || null
        );

    },


    /* =====================================================
       SUBJECT PATH HELPERS
       ===================================================== */

    cleanSubjectFile(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .trim()
            .replace(/\\/g, "/")
            .replace(/^.*\//, "")
            .replace(/\.json$/i, "");

    },


    buildSubjectCandidates(
        classNumber,
        semester,
        subject
    ) {

        const classId =
            String(classNumber)
                .replace(/^kelas[-_]?/i, "")
                .trim();

        const sem =
            String(
                semester === null ||
                semester === undefined ||
                semester === ""
                    ? "1"
                    : semester
            ).trim();

        if (!subject) {
            return [];
        }

        const folder =
            this.cleanSubjectFile(
                subject.folder
            );

        const file =
            this.cleanSubjectFile(
                subject.file
            );

        const slug =
            this.cleanSubjectFile(
                subject.slug
            );

        const code =
            this.cleanSubjectFile(
                subject.code
            );

        const name =
            this.slugify(
                subject.name
            );

        const identifiers = [
            file,
            folder,
            slug,
            code,
            name
        ].filter(Boolean);


        const uniqueIdentifiers = [
            ...new Set(
                identifiers
            )
        ];


        const candidates = [];


        /*
         * STRUKTUR FOLDER MAPEL
         *
         * Jika metadata memiliki:
         *   folder: "matematika"
         *   file:   "matematika.json"
         *
         * maka prioritas utama adalah:
         *
         * data/sma/kelas-X/matematika/matematika.json
         *
         * Ini penting karena struktur proyek dapat menyimpan
         * setiap mapel di dalam foldernya sendiri.
         */

        if (folder && file) {

            candidates.push(
                `../../data/sma/kelas-${classId}/${folder}/${file}.json`
            );

        }


        if (folder && file && classId === "10") {

            candidates.push(
                `../../data/sma/kelas-${classId}/semester-${sem}/${folder}/${file}.json`
            );

            candidates.push(
                `../../data/sma/kelas-${classId}/semester${sem}/${folder}/${file}.json`
            );

        }


        /*
         * KELAS 11 / 12 - file langsung di root kelas
         *
         * data/sma/kelas-12/matematika.json
         */

        uniqueIdentifiers.forEach(identifier => {

            candidates.push(
                `../../data/sma/kelas-${classId}/${identifier}.json`
            );

        });


        /*
         * KELAS 10
         *
         * data/sma/kelas-10/semester-1/matematika.json
         */

        uniqueIdentifiers.forEach(identifier => {

            candidates.push(
                `../../data/sma/kelas-${classId}/semester-${sem}/${identifier}.json`
            );

            candidates.push(
                `../../data/sma/kelas-${classId}/semester${sem}/${identifier}.json`
            );

            candidates.push(
                `../../data/sma/kelas-${classId}/semester-${sem}/subjects/${identifier}.json`
            );

            candidates.push(
                `../../data/sma/kelas-${classId}/semester-${sem}/materi/${identifier}.json`
            );

        });


        /*
         * Struktur tambahan yang kadang digunakan
         */

        uniqueIdentifiers.forEach(identifier => {

            candidates.push(
                `../../data/sma/kelas-${classId}/subjects/${identifier}.json`
            );

            candidates.push(
                `../../data/sma/kelas-${classId}/materi/${identifier}.json`
            );

        });


        return [
            ...new Set(
                candidates
            )
        ];

    },


    /* =====================================================
       RESOLVE SUBJECT
       ===================================================== */

    async resolveSubject(
        classNumber,
        semester,
        subjectIdentifier
    ) {

        const classData =
            await this.loadClass(
                classNumber
            );

        if (!classData) {
            return null;
        }


        /*
         * SATU RESOLVER UNTUK SEMUA STRUKTUR
         *
         * Kelas 12:
         *   subjects[] langsung di subjects.json
         *
         * Kelas 10:
         *   subjects[] berada di semester
         *
         * Kelas 11 yang masih memakai struktur lama
         * tetap diproses melalui jalur semester.
         */
        const subject =
            this.getSubjectMetadata(
                classData,
                semester,
                subjectIdentifier
            );

        if (subject) {
            return subject;
        }


        return null;

    },


    /* =====================================================
       RESOLVE SUBJECT FILE
       ===================================================== */

    async resolveSubjectFile(
        classNumber,
        semester,
        subjectIdentifier
    ) {

        /*
         * Kalau sudah object subject,
         * langsung ambil metadata file.
         */

        if (
            subjectIdentifier &&
            typeof subjectIdentifier === "object"
        ) {

            return (
                subjectIdentifier.file ||
                subjectIdentifier.slug ||
                subjectIdentifier.folder ||
                subjectIdentifier.code ||
                null
            );

        }


        const subject =
            await this.resolveSubject(
                classNumber,
                semester,
                subjectIdentifier
            );


        if (!subject) {
            return null;
        }


        return (
            subject.file ||
            subject.slug ||
            subject.folder ||
            subject.code ||
            null
        );

    },


    /* =====================================================
       LOAD SUBJECT
       ===================================================== */

    async loadSubject(
        classNumber,
        semester,
        subjectIdentifier
    ) {

        let subject =
            await this.resolveSubject(
                classNumber,
                semester,
                subjectIdentifier
            );


        /*
         * Jika resolver tidak menemukan subject,
         * buat fallback dari identifier.
         */

        if (!subject) {

            const fallback =
                String(
                    subjectIdentifier === null ||
                    subjectIdentifier === undefined
                        ? ""
                        : subjectIdentifier
                ).trim();

            if (!fallback) {

                console.error(
                    "FJIS Content Error: subject kosong."
                );

                return null;

            }

            subject = {
                file: fallback,
                slug: fallback,
                folder: fallback,
                code: fallback,
                name: fallback
            };

        }


        const candidates =
            this.buildSubjectCandidates(
                classNumber,
                semester,
                subject
            );


        if (!candidates.length) {

            console.error(
                "FJIS Content Error: kandidat file subject kosong.",
                {
                    classNumber,
                    semester,
                    subject
                }
            );

            return null;

        }


        for (
            const path of candidates
        ) {

            console.log(
                "FJIS Content: mencoba subject →",
                path
            );


            const data =
                await this.load(path);


            if (data) {

                console.log(
                    "FJIS Content: subject berhasil →",
                    path
                );


                /*
                 * Simpan metadata internal.
                 * Tidak mengubah isi JSON.
                 */

                if (
                    typeof data === "object" &&
                    !Array.isArray(data)
                ) {

                    if (!data.__fjis) {
                        Object.defineProperty(
                            data,
                            "__fjis",
                            {
                                value: {
                                    classNumber,
                                    semester,
                                    subject
                                },
                                enumerable: false
                            }
                        );
                    }

                }


                return data;

            }

        }


        console.error(
            "FJIS Content Error: file subject tidak ditemukan.",
            {
                classNumber,
                semester,
                subjectIdentifier,
                subject
            }
        );


        return null;

    },


    getChapterSemester(chapter, fallback = "") {
        if (!chapter || typeof chapter !== "object") {
            return fallback;
        }

        return (
            chapter.semester ??
            chapter.semesterNumber ??
            chapter.term ??
            fallback
        );
    },

    /* =====================================================
       CHAPTER HELPERS
       ===================================================== */

    getSubjectChapters(
        subjectData,
        semester
    ) {

        if (
            !subjectData ||
            typeof subjectData !== "object"
        ) {

            return [];

        }


        /*
         * =================================================
         * BENTUK:
         *
         * {
         *     chapters: [...]
         * }
         * =================================================
         */

        if (
            Array.isArray(
                subjectData.chapters
            )
        ) {

            const chapters =
                subjectData.chapters;


            if (
                semester === null ||
                semester === undefined ||
                semester === ""
            ) {

                return chapters;

            }


            const target =
                Number(semester);


            const filtered =
                chapters.filter(
                    chapter => {

                        if (
                            !chapter ||
                            typeof chapter !== "object"
                        ) {

                            return false;

                        }


                        const value =
                            this.getChapterSemester(
                                chapter,
                                ""
                            );


                        /*
                         * Kalau chapter tidak punya
                         * informasi semester,
                         * tetap masukkan.
                         */

                        if (
                            value === null ||
                            value === undefined ||
                            value === ""
                        ) {

                            return true;

                        }


                        return (
                            Number(value) === target ||
                            String(value) ===
                                String(semester)
                        );

                    }
                );


            /*
             * Kalau filtering tidak menghasilkan
             * apa-apa, jangan membuat halaman kosong.
             */

            return filtered.length
                ? filtered
                : chapters;

        }


        /*
         * =================================================
         * BENTUK:
         *
         * semesters -> chapters[]
         * =================================================
         */

        const semesterData =
            this.getSemester(
                subjectData,
                semester
            );


        if (
            semesterData &&
            Array.isArray(
                semesterData.chapters
            )
        ) {

            return semesterData.chapters;

        }


        /*
         * =================================================
         * BENTUK:
         *
         * semesters -> subjects[]
         *
         * Digunakan kalau subjectData merupakan
         * struktur kelas yang lebih kompleks.
         * =================================================
         */

        if (
            semesterData &&
            Array.isArray(
                semesterData.subjects
            )
        ) {

            const metadata =
                subjectData.__fjis || {};

            const selectedSubject =
                this.findSubject(
                    semesterData,
                    metadata.subject?.code ||
                    metadata.subject?.name ||
                    metadata.subject?.folder
                );


            if (
                selectedSubject &&
                Array.isArray(
                    selectedSubject.chapters
                )
            ) {

                return selectedSubject.chapters;

            }

        }


        /*
         * =================================================
         * BENTUK:
         *
         * semester1 / semester2
         * =================================================
         */

        const key =
            `semester${semester}`;


        if (
            subjectData[key] &&
            Array.isArray(
                subjectData[key].chapters
            )
        ) {

            return subjectData[
                key
            ].chapters;

        }


        /*
         * Bentuk alternatif:
         *
         * semester-1 / semester-2
         */

        const hyphenKey =
            `semester-${semester}`;


        if (
            subjectData[hyphenKey] &&
            Array.isArray(
                subjectData[hyphenKey].chapters
            )
        ) {

            return subjectData[
                hyphenKey
            ].chapters;

        }


        return [];

    },


    /* =====================================================
       GET ALL CHAPTERS
       ===================================================== */

    getAllSubjectChapters(
        subjectData
    ) {

        if (
            !subjectData ||
            typeof subjectData !== "object"
        ) {

            return [];

        }


        if (
            Array.isArray(
                subjectData.chapters
            )
        ) {

            return subjectData.chapters;

        }


        const result = [];


        const semesters =
            this.getAvailableSemesters(
                subjectData
            );


        semesters.forEach(semester => {

            const chapters =
                this.getSubjectChapters(
                    subjectData,
                    semester
                );

            if (Array.isArray(chapters)) {

                chapters.forEach(chapter => {

                    result.push({
                        ...chapter,
                        semester:
                            chapter.semester ??
                            chapter.semesterNumber ??
                            chapter.term ??
                            semester
                    });

                });

            }

        });


        return result;

    },


    /* =====================================================
       CHAPTER IDENTIFIER
       ===================================================== */

    getChapterByIdentifier(
        chapters,
        chapterIdentifier
    ) {

        if (
            !Array.isArray(chapters)
        ) {

            return null;

        }


        const target =
            this.normalize(
                chapterIdentifier
            );


        if (!target) {
            return null;
        }


        return (
            chapters.find(
                (chapter, index) => {

                    if (
                        !chapter ||
                        typeof chapter !== "object"
                    ) {

                        return false;

                    }


                    const id =
                        this.normalize(
                            chapter.id
                        );


                    const number =
                        this.normalize(

                            chapter.number === null ||
                            chapter.number === undefined

                                ? index + 1

                                : chapter.number

                        );


                    const title =
                        this.normalize(
                            chapter.title
                        );


                    const slug =
                        this.normalize(
                            chapter.slug
                        );


                    return (
                        id === target ||
                        number === target ||
                        title === target ||
                        slug === target ||

                        this.slugify(id) ===
                            this.slugify(target) ||

                        this.slugify(title) ===
                            this.slugify(target) ||

                        this.slugify(slug) ===
                            this.slugify(target)
                    );

                }
            ) || null
        );

    },


    /* =====================================================
       SUBCHAPTER HELPERS
       ===================================================== */

    getSubchapters(
        chapter
    ) {

        if (
            !chapter ||
            typeof chapter !== "object"
        ) {

            return [];

        }


        const candidates = [

            chapter.subchapters,

            chapter.subBab,

            chapter.subbab,

            chapter.sub_bab,

            chapter.sections,

            chapter.topics

        ];


        for (
            const value of candidates
        ) {

            if (
                Array.isArray(value)
            ) {

                return value;

            }

        }


        return [];

    },


    getSubchapterByIdentifier(
        chapter,
        subchapterIdentifier
    ) {

        const subchapters =
            this.getSubchapters(
                chapter
            );


        if (
            !subchapters.length
        ) {

            return null;

        }


        const target =
            this.normalize(
                subchapterIdentifier
            );


        if (!target) {
            return null;
        }


        return (
            subchapters.find(
                (
                    subchapter,
                    index
                ) => {

                    if (
                        !subchapter ||
                        typeof subchapter !== "object"
                    ) {

                        return false;

                    }


                    const id =
                        this.normalize(
                            subchapter.id
                        );


                    const number =
                        this.normalize(

                            subchapter.number === null ||
                            subchapter.number === undefined

                                ? index + 1

                                : subchapter.number

                        );


                    const title =
                        this.normalize(
                            subchapter.title
                        );


                    const slug =
                        this.normalize(
                            subchapter.slug
                        );


                    return (
                        id === target ||
                        number === target ||
                        title === target ||
                        slug === target ||

                        this.slugify(id) ===
                            this.slugify(target) ||

                        this.slugify(title) ===
                            this.slugify(target) ||

                        this.slugify(slug) ===
                            this.slugify(target)
                    );

                }
            ) || null
        );

    },


    /* =====================================================
       TKA ENGINE
       Struktur terpisah dari SMA Kelas 10/11/12
       Struktur file: data/tka/sma/wajib/<subject>.json
       dan data/tka/sma/pilihan/<subject>.json
       ===================================================== */

    isTKAData(data) {
        return !!(data && typeof data === "object" && !Array.isArray(data) && (
            this.normalize(data.type) === "tka" ||
            this.normalize(data.program) === "tka" ||
            this.normalize(data.source) === "tka"
        ));
    },

    async loadTKA(category = "wajib", subject = "") {
        const allowed = ["wajib", "pilihan"];
        const cat = this.slugify(category || "wajib");
        const slug = this.slugify(subject || "");
        if (!allowed.includes(cat) || !slug) return null;
        const path = `../../data/tka/sma/${cat}/${slug}.json`;
        const data = await this.load(path);
        return data ? this.normalizeTKAData(data, cat, slug) : null;
    },

    normalizeTKAData(data, category = "", subjectSlug = "") {

        /*
         * TKA normalizer
         * -------------------------------------------------
         * Tidak mengubah isi JSON sumber.
         * Hanya membentuk struktur yang konsisten untuk UI.
         *
         * Didukung:
         * - topics / chapters / bab / materials / materi
         * - materials[].lesson sebagai materi
         * - root question_bank sebagai bank soal
         * - question_bank -> topic/subtopic.questions
         */
        if (
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {
            return null;
        }

        const source = data;

        const topicSource =
            Array.isArray(source.topics) ? source.topics :
            Array.isArray(source.chapters) ? source.chapters :
            Array.isArray(source.bab) ? source.bab :
            Array.isArray(source.materials) ? source.materials :
            Array.isArray(source.materi) ? source.materi :
            [];

        const questionBank =
            Array.isArray(source.question_bank) ? source.question_bank :
            Array.isArray(source.questionBank) ? source.questionBank :
            Array.isArray(source.questions) ? source.questions :
            [];

        const normalizeValue = value =>
            this.normalize(value);

        const slugValue = value =>
            this.slugify(value);

        const fieldsOf = item => {
            if (!item || typeof item !== "object") return [];

            return [
                item.id,
                item.code,
                item.slug,
                item.title,
                item.name,
                item.subtopic,
                item.subcompetency,
                item.competency,
                item.number
            ]
                .filter(
                    value =>
                        value !== undefined &&
                        value !== null
                )
                .map(normalizeValue)
                .filter(Boolean);
        };

        const questionFieldsOf = question => {
            if (!question || typeof question !== "object") {
                return [];
            }

            return [
                question.subtopic,
                question.subtest,
                question.subchapter,
                question.subchapterId,
                question.topic,
                question.topicId,
                question.chapter,
                question.chapterId,
                question.bab,
                question.babId,
                question.material,
                question.materialId,
                question.competency,
                question.competencyCode,
                question.subcompetency,
                question.subcompetencyCode,
                question.code
            ]
                .filter(
                    value =>
                        value !== undefined &&
                        value !== null
                )
                .map(normalizeValue)
                .filter(Boolean);
        };

        const questionBelongsTo = (
            question,
            target,
            targetIndex = 0
        ) => {

            if (
                !question ||
                typeof question !== "object"
            ) {
                return false;
            }

            const qId =
                normalizeValue(question.id);

            const qFields =
                questionFieldsOf(question);

            const targetFields =
                fieldsOf(target);

            /*
             * 1. Exact field match.
             *    Penting untuk subcompetency Bahasa Indonesia
             *    yang menggunakan judul panjang.
             */
            if (
                qFields.some(
                    q =>
                        targetFields.some(
                            targetValue =>
                                q === targetValue
                        )
                )
            ) {
                return true;
            }

            /*
             * 2. Slug match.
             */
            const qSlugs =
                qFields.map(slugValue);

            const targetSlugs =
                targetFields.map(slugValue);

            if (
                qSlugs.some(
                    q =>
                        q &&
                        targetSlugs.some(
                            targetValue =>
                                targetValue &&
                                q === targetValue
                        )
                )
            ) {
                return true;
            }

            /*
             * 3. Kode seperti:
             *    BIN-T1-001
             *    cocok dengan material.code = T1.
             */
            const targetCode =
                normalizeValue(
                    target?.code ??
                    ""
                );

            if (
                targetCode &&
                qId &&
                (
                    qId === targetCode ||
                    qId.startsWith(
                        `${targetCode}-`
                    ) ||
                    qId.includes(
                        `-${targetCode}-`
                    )
                )
            ) {
                return true;
            }

            /*
             * 4. Kode dapat tersimpan pada field question
             *    selain ID.
             */
            if (
                targetCode &&
                qFields.some(
                    field =>
                        field === targetCode ||
                        field.startsWith(
                            `${targetCode}-`
                        )
                )
            ) {
                return true;
            }

            /*
             * 5. Nomor subtest jika tersedia.
             */
            const targetNumber =
                String(
                    target?.number ??
                    targetIndex + 1
                );

            const questionNumbers = [
                question.subtestNumber,
                question.subtopicNumber,
                question.topicNumber,
                question.materialNumber
            ]
                .filter(
                    value =>
                        value !== undefined &&
                        value !== null
                )
                .map(String);

            return questionNumbers.includes(
                targetNumber
            );
        };

        const readLocalQuestions = item => {
            if (
                !item ||
                typeof item !== "object"
            ) {
                return [];
            }

            return Array.isArray(item.questions)
                ? item.questions
                : Array.isArray(item.soal)
                    ? item.soal
                    : Array.isArray(item.practice)
                        ? item.practice
                        : Array.isArray(item.latihan)
                            ? item.latihan
                            : [];
        };

        const uniqueQuestions = list => {
            const seen = new Set();

            return list.filter(question => {

                if (
                    !question ||
                    typeof question !== "object"
                ) {
                    return true;
                }

                const key =
                    question.id ??
                    question.question ??
                    question.soal ??
                    JSON.stringify(question);

                const normalizedKey =
                    String(key);

                if (
                    seen.has(normalizedKey)
                ) {
                    return false;
                }

                seen.add(normalizedKey);
                return true;
            });
        };

        const normalizedTopics =
            topicSource.map(
                (topic, topicIndex) => {

                    if (
                        !topic ||
                        typeof topic !== "object"
                    ) {
                        return topic;
                    }

                    const subtopics =
                        this.getTKASubtopics(
                            topic
                        );

                    /*
                     * Bahasa Indonesia:
                     * materials[].lesson adalah isi materi.
                     * Expose sebagai `material` agar renderer
                     * yang membaca material/materi/content tetap jalan.
                     */
                    const topicMaterial =
                        topic.material ??
                        topic.materi ??
                        topic.content ??
                        topic.konten ??
                        topic.lesson ??
                        null;

                    const localTopicQuestions =
                        readLocalQuestions(
                            topic
                        );

                    const bankTopicQuestions =
                        questionBank.filter(
                            question =>
                                questionBelongsTo(
                                    question,
                                    topic,
                                    topicIndex
                                )
                        );

                    /*
                     * Untuk topic tanpa subtopic:
                     * langsung pasang seluruh soal yang cocok.
                     */
                    if (
                        !subtopics.length
                    ) {
                        return {
                            ...topic,

                            ...(topicMaterial !== null
                                ? {
                                    material:
                                        topicMaterial
                                }
                                : {}),

                            questions:
                                uniqueQuestions([
                                    ...localTopicQuestions,
                                    ...bankTopicQuestions
                                ])
                        };
                    }

                    /*
                     * Untuk struktur yang memang memiliki
                     * subtopic, pertahankan struktur tersebut
                     * dan pasang soal ke subtopic.
                     */
                    const normalizedSubtopics =
                        subtopics.map(
                            (
                                subtopic,
                                subtopicIndex
                            ) => {

                                if (
                                    !subtopic ||
                                    typeof subtopic !== "object"
                                ) {
                                    return subtopic;
                                }

                                const localSubQuestions =
                                    readLocalQuestions(
                                        subtopic
                                    );

                                const bankSubQuestions =
                                    questionBank.filter(
                                        question =>
                                            questionBelongsTo(
                                                question,
                                                subtopic,
                                                subtopicIndex
                                            )
                                    );

                                return {
                                    ...subtopic,

                                    questions:
                                        uniqueQuestions([
                                            ...localSubQuestions,
                                            ...bankSubQuestions
                                        ])
                                };
                            }
                        );

                    return {
                        ...topic,

                        ...(topicMaterial !== null
                            ? {
                                material:
                                    topicMaterial
                            }
                            : {}),

                        subtopics:
                            normalizedSubtopics,

                        /*
                         * Pertahankan soal lokal/topic-level.
                         */
                        questions:
                            uniqueQuestions([
                                ...localTopicQuestions,
                                ...bankTopicQuestions
                            ])
                    };
                }
            );

        return {
            ...source,

            type:
                source.type ||
                "TKA",

            program:
                source.program ||
                "TKA",

            level:
                source.level ||
                "SMA",

            category:
                source.category ||
                category ||
                "wajib",

            subject:
                source.subject ||
                null,

            subjectSlug:
                source.subjectSlug ||
                source.subject_slug ||
                subjectSlug,

            title:
                source.title ||
                (
                    typeof source.subject === "string"
                        ? source.subject
                        : "TKA SMA"
                ),

            description:
                source.description ||
                "",

            overview:
                source.overview ||
                source.ringkasan ||
                "",

            topics:
                normalizedTopics,

            /*
             * Alias materials untuk kompatibilitas renderer lama.
             */
            /*
             * Alias UI yang selalu konsisten.
             * Jangan bergantung pada apakah sumber memakai
             * `topics` atau `materials`. Math memakai `topics`,
             * sedangkan Bahasa Indonesia memakai `materials`.
             */
            materials:
                normalizedTopics,

            /*
             * Bank asli tetap tersedia.
             */
            question_bank:
                questionBank,

            evaluation:
                source.evaluation ||
                source.penilaian ||
                null
        };
    },

    getTKATopics(data) {
        if (!data || typeof data !== "object") return [];
        if (Array.isArray(data.topics)) return data.topics;
        if (Array.isArray(data.chapters)) return data.chapters;
        if (Array.isArray(data.bab)) return data.bab;
        if (Array.isArray(data.materials)) return data.materials;
        if (Array.isArray(data.materi)) return data.materi;
        return [];
    },

    findTKATopic(data, identifier) {
        const topics = this.getTKATopics(data);
        if (!identifier) return null;
        const target = this.normalize(identifier);
        return topics.find(item => {
            if (!item || typeof item !== "object") return false;
            return [item.id,item.slug,item.code,item.title,item.name,item.number].some(v => v != null && (this.normalize(v) === target || this.slugify(v) === this.slugify(target)));
        }) || null;
    },

    getTKASubtopics(topic) {
        if (!topic || typeof topic !== "object") return [];
        for (const key of ["subtopics","submaterials","submateri","subchapters","subbab"]) {
            if (Array.isArray(topic[key])) return topic[key];
        }
        return [];
    },

    findTKASubtopic(topic, identifier) {
        const list = this.getTKASubtopics(topic);
        if (!identifier) return null;
        const target = this.normalize(identifier);
        return list.find(item => item && typeof item === "object" && [item.id,item.slug,item.code,item.title,item.name,item.number].some(v => v != null && (this.normalize(v) === target || this.slugify(v) === this.slugify(target)))) || null;
    },

    getTKAMaterial(topic, subtopicIdentifier = "") {
        if (!topic) return null;
        const item = subtopicIdentifier ? this.findTKASubtopic(topic, subtopicIdentifier) : topic;
        return item ? (item.material ?? item.materi ?? item.content ?? item.konten ?? null) : null;
    },

    getTKAExamples(topic, subtopicIdentifier = "") {
        if (!topic) return [];
        const item = subtopicIdentifier ? this.findTKASubtopic(topic, subtopicIdentifier) : topic;
        if (!item) return [];
        return Array.isArray(item.examples) ? item.examples : Array.isArray(item.contoh) ? item.contoh : Array.isArray(item.exampleQuestions) ? item.exampleQuestions : [];
    },

    getTKAQuestions(topic, subtopicIdentifier = "") {

        /*
         * Jika dipanggil dengan subbab:
         * ambil questions dari subbab yang sudah
         * dihubungkan oleh normalizeTKAData().
         */
        if (
            topic &&
            typeof topic === "object"
        ) {

            const item =
                subtopicIdentifier
                    ? this.findTKASubtopic(
                        topic,
                        subtopicIdentifier
                    )
                    : topic;

            if (item) {

                const localQuestions =
                    Array.isArray(
                        item.questions
                    )
                        ? item.questions
                        : Array.isArray(
                            item.soal
                        )
                            ? item.soal
                            : Array.isArray(
                                item.practice
                            )
                                ? item.practice
                                : Array.isArray(
                                    item.latihan
                                )
                                    ? item.latihan
                                    : [];

                if (localQuestions.length) {
                    return localQuestions;
                }

            }

            /*
             * Fallback lama tetap dipertahankan.
             */
            if (
                Array.isArray(topic.questions)
            ) {
                return topic.questions;
            }

            if (
                Array.isArray(topic.soal)
            ) {
                return topic.soal;
            }

            if (
                Array.isArray(topic.practice)
            ) {
                return topic.practice;
            }

            if (
                Array.isArray(topic.latihan)
            ) {
                return topic.latihan;
            }

        }

        /*
         * Jika `topic` adalah data TKA root,
         * kembalikan seluruh question_bank.
         *
         * Ini yang sebelumnya belum ada dan menyebabkan
         * LATIHAN terbaca 0 walaupun JSON berhasil dimuat.
         */
        if (
            topic &&
            typeof topic === "object" &&
            Array.isArray(topic.question_bank)
        ) {
            return topic.question_bank;
        }

        return [];

    },

    getTKAQuestionBank(data) {

        if (
            !data ||
            typeof data !== "object"
        ) {
            return [];
        }

        if (
            Array.isArray(data.question_bank)
        ) {
            return data.question_bank;
        }

        if (
            Array.isArray(data.questionBank)
        ) {
            return data.questionBank;
        }

        return [];

    },


    getTKAEvaluation(data) {
        return data ? (data.evaluation || data.penilaian || null) : null;
    },

    /* =====================================================
       RENDER SUBJECTS
       ===================================================== */

    renderSubjects(
        container,
        subjects
    ) {

        if (!container) {
            return;
        }


        if (
            !Array.isArray(subjects) ||
            subjects.length === 0
        ) {

            container.innerHTML = `

                <div class="program-card">

                    <h3>
                        Materi sedang dipersiapkan
                    </h3>

                    <p>
                        Materi untuk bagian ini
                        belum tersedia.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML =
            subjects
                .map(
                    subject => {

                        const code =
                            this.escapeHTML(
                                subject.code || ""
                            );


                        const name =
                            this.escapeHTML(
                                subject.name ||
                                "Mata Pelajaran"
                            );


                        const description =
                            this.escapeHTML(
                                subject.description ||
                                ""
                            );


                        let link =
                            subject.link ||
                            "";


                        if (!link) {

                            const identifier =
                                subject.slug ||
                                subject.folder ||
                                subject.code ||
                                subject.name ||
                                "";


                            const classNumber =
                                container.dataset.class ||
                                "10";


                            const semester =
                                container.dataset.semester ||
                                "1";


                            link =
                                `bab.html?class=${encodeURIComponent(
                                    classNumber
                                )}` +

                                `&semester=${encodeURIComponent(
                                    semester
                                )}` +

                                `&subject=${encodeURIComponent(
                                    identifier
                                )}`;

                        }


                        return `

                            <a
                                href="${this.escapeHTML(link)}"
                                class="program-card glass-card"
                                data-subject="${this.escapeHTML(code)}"
                            >

                                <div
                                    class="program-card-icon"
                                >
                                    ${code}
                                </div>


                                <div
                                    class="program-card-content"
                                >

                                    <span
                                        class="program-card-category"
                                    >
                                        ${this.escapeHTML(
                                            subject.category ||
                                            "Mata Pelajaran"
                                        )}
                                    </span>


                                    <h3>
                                        ${name}
                                    </h3>


                                    <p>
                                        ${description}
                                    </p>

                                </div>


                                <div
                                    class="program-card-arrow"
                                >
                                    →
                                </div>

                            </a>

                        `;

                    }
                )
                .join("");

    },


    /* =====================================================
       RENDER CHAPTERS
       ===================================================== */

    renderChapters(
        container,
        chapters,
        context = {}
    ) {

        if (!container) {
            return;
        }


        if (
            !Array.isArray(chapters) ||
            chapters.length === 0
        ) {

            container.innerHTML = `

                <div class="program-card">

                    <h3>
                        Bab belum tersedia
                    </h3>

                    <p>
                        Struktur bab untuk
                        mata pelajaran ini
                        belum tersedia.
                    </p>

                </div>

            `;

            return;

        }


        const classNumber =
            context.classNumber ||
            "10";


        const semester =
            context.semester ??
            "";


        const subject =
            context.subject ||
            "";


        container.innerHTML =
            chapters
                .map(
                    (
                        chapter,
                        index
                    ) => {

                        const number =
                            chapter.number ??
                            index + 1;


                        const id =
                            chapter.id ||
                            chapter.slug ||
                            `bab-${number}`;


                        const title =
                            this.escapeHTML(
                                chapter.title ||
                                `Bab ${number}`
                            );


                        const description =
                            this.escapeHTML(
                                chapter.description ||
                                ""
                            );


                        const chapterSemester =
                            this.getChapterSemester(
                                chapter,
                                semester || "1"
                            ) || "1";


                        const semesterQuery =
                            chapterSemester !== "" &&
                            chapterSemester !== null &&
                            chapterSemester !== undefined

                                ? `&semester=${encodeURIComponent(
                                    chapterSemester
                                )}`

                                : "";


                        const link =
                            `bab.html?class=${encodeURIComponent(
                                classNumber
                            )}` +

                            semesterQuery +

                            `&subject=${encodeURIComponent(
                                subject
                            )}` +

                            `&chapter=${encodeURIComponent(
                                id
                            )}`;


                        return `

                            <a
                                href="${this.escapeHTML(link)}"
                                class="program-card glass-card"
                                data-chapter="${this.escapeHTML(id)}"
                            >

                                <div
                                    class="program-card-icon"
                                >

                                    ${this.escapeHTML(
                                        String(number)
                                            .padStart(
                                                2,
                                                "0"
                                            )
                                    )}

                                </div>


                                <div
                                    class="program-card-content"
                                >

                                    <span
                                        class="program-card-category"
                                    >
                                        BAB
                                        ${this.escapeHTML(
                                            number
                                        )}
                                    </span>


                                    <h3>
                                        ${title}
                                    </h3>


                                    <p>
                                        ${description}
                                    </p>

                                </div>


                                <div
                                    class="program-card-arrow"
                                >
                                    →
                                </div>

                            </a>

                        `;

                    }
                )
                .join("");

    },


    /* =====================================================
       RENDER SUBCHAPTERS
       ===================================================== */

    renderSubchapters(
        container,
        subchapters,
        context = {}
    ) {

        if (!container) {
            return;
        }


        if (
            !Array.isArray(subchapters) ||
            subchapters.length === 0
        ) {

            container.innerHTML = `

                <div class="program-card">

                    <h3>
                        Subbab belum tersedia
                    </h3>

                    <p>
                        Belum ada subbab pada bab ini.
                    </p>

                </div>

            `;

            return;

        }


        const classNumber =
            context.classNumber ||
            "10";


        const semester =
            context.semester ??
            "1";


        const subject =
            context.subject ||
            "";


        const chapter =
            context.chapter ||
            "";


        container.innerHTML =
            subchapters
                .map(
                    (
                        subchapter,
                        index
                    ) => {

                        const id =
                            subchapter.id ||
                            subchapter.slug ||
                            `subbab-${index + 1}`;


                        const number =
                            subchapter.number ??
                            index + 1;


                        const title =
                            this.escapeHTML(
                                subchapter.title ||
                                `Subbab ${number}`
                            );


                        const description =
                            this.escapeHTML(
                                subchapter.description ||
                                ""
                            );


                        const link =
                            `materi-belajar.html?class=${encodeURIComponent(
                                classNumber
                            )}` +

                            `&semester=${encodeURIComponent(
                                semester
                            )}` +

                            `&subject=${encodeURIComponent(
                                subject
                            )}` +

                            `&chapter=${encodeURIComponent(
                                chapter
                            )}` +

                            `&subchapter=${encodeURIComponent(
                                id
                            )}`;


                        return `

                            <a
                                href="${this.escapeHTML(link)}"
                                class="program-card glass-card"
                                data-subchapter="${this.escapeHTML(id)}"
                            >

                                <div
                                    class="program-card-icon"
                                >

                                    ${this.escapeHTML(
                                        String(number)
                                            .padStart(
                                                2,
                                                "0"
                                            )
                                    )}

                                </div>


                                <div
                                    class="program-card-content"
                                >

                                    <span
                                        class="program-card-category"
                                    >
                                        SUBBAB
                                        ${this.escapeHTML(
                                            number
                                        )}
                                    </span>


                                    <h3>
                                        ${title}
                                    </h3>


                                    <p>
                                        ${description}
                                    </p>

                                </div>


                                <div
                                    class="program-card-arrow"
                                >
                                    →
                                </div>

                            </a>

                        `;

                    }
                )
                .join("");

    },


    /* =====================================================
       MATERIAL VALUE FORMATTER
       ===================================================== */

    formatMaterialValue(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        /*
         * STRING
         */

        if (
            typeof value === "string"
        ) {

            /*
             * Kalau JSON mengandung HTML/SVG,
             * jangan diubah menjadi teks biasa.
             */

            if (
                /<[a-z][\s\S]*>/i.test(
                    value
                )
            ) {

                return value;

            }


            return this
                .escapeHTML(value)
                .replace(
                    /\n/g,
                    "<br>"
                );

        }


        /*
         * NUMBER / BOOLEAN
         */

        if (
            typeof value === "number" ||
            typeof value === "boolean"
        ) {

            return this.escapeHTML(
                value
            );

        }


        /*
         * ARRAY
         */

        if (
            Array.isArray(value)
        ) {

            return `

                <div
                    class="fjis-material-items"
                >

                    ${
                        value
                            .map(
                                item => `

                                    <div
                                        class="fjis-material-item"
                                    >
                                        ${
                                            this.formatMaterialValue(
                                                item
                                            )
                                        }
                                    </div>

                                `
                            )
                            .join("")
                    }

                </div>

            `;

        }


        /*
         * OBJECT
         */

        const preferredKeys = [

            "text",

            "content",

            "value",

            "formula",

            "description",

            "definition",

            "statement",

            "answer",

            "label"

        ];


        for (
            const key of preferredKeys
        ) {

            if (
                Object.prototype.hasOwnProperty.call(
                    value,
                    key
                ) &&
                value[key] !== null &&
                value[key] !== undefined
            ) {

                return this.formatMaterialValue(
                    value[key]
                );

            }

        }


        return Object.entries(
            value
        )
            .map(
                (
                    [key, item]
                ) => {

                    const rendered =
                        this.formatMaterialValue(
                            item
                        );


                    if (!rendered) {
                        return "";
                    }


                    return `

                        <div
                            class="fjis-material-object-row"
                        >

                            <strong>
                                ${this.escapeHTML(
                                    key
                                )}
                            </strong>

                            <div>
                                ${rendered}
                            </div>

                        </div>

                    `;

                }
            )
            .join("");

    },


    /* =====================================================
       RENDER MATERIAL
       ===================================================== */

    renderMaterial(
        container,
        material,
        context = {}
    ) {

        if (!container) {
            return;
        }


        if (
            !material ||
            typeof material !== "object"
        ) {

            container.innerHTML = `

                <div class="program-card">

                    <h3>
                        Materi belum tersedia
                    </h3>

                    <p>
                        Belum ada isi materi
                        untuk subbab ini.
                    </p>

                </div>

            `;

            return;

        }


        const title =
            material.title ||
            context.title ||
            "Materi Pembelajaran";


        const description =
            material.description ||
            "";


        const introduction =
            material.introduction ||
            material.pendahuluan ||
            "";


        const sections =
            Array.isArray(
                material.sections
            )
                ? material.sections
                : [];


        const renderBlock =
            value =>
                this.formatMaterialValue(
                    value
                );


        let html = `

            <article
                class="material-content"
            >

                <header
                    class="material-header"
                >

                    <span
                        class="section-label"
                    >
                        MATERI
                    </span>


                    <h1>
                        ${this.escapeHTML(
                            title
                        )}
                    </h1>

                    ${
                        description
                            ? `
                                <p>
                                    ${this.escapeHTML(
                                        description
                                    )}
                                </p>
                            `
                            : ""
                    }

                </header>

        `;


        /*
         * =================================================
         * INTRODUCTION
         * =================================================
         */

        if (introduction) {

            html += `

                <section
                    class="material-card glass-card material-introduction"
                >

                    <h2>
                        Pendahuluan
                    </h2>


                    <div
                        class="material-text"
                    >

                        ${renderBlock(
                            introduction
                        )}

                    </div>

                </section>

            `;

        }


        /*
         * =================================================
         * SECTIONS
         * =================================================
         */

        if (
            sections.length
        ) {

            html += `

                <div
                    class="material-sections"
                >

            `;


            sections.forEach(
                (
                    section,
                    index
                ) => {

                    if (
                        !section ||
                        typeof section !== "object"
                    ) {

                        html += `

                            <section
                                class="material-card glass-card"
                            >

                                ${renderBlock(
                                    section
                                )}

                            </section>

                        `;

                        return;

                    }


                    const sectionTitle =
                        section.title ||
                        `Bagian ${index + 1}`;


                    const type =
                        this.normalize(
                            section.type
                        );


                    let body = "";


                    /*
                     * CONTENT
                     */

                    if (
                        Array.isArray(
                            section.content
                        )
                    ) {

                        body +=
                            section.content
                                .map(
                                    item => `

                                        <div
                                            class="material-paragraph"
                                        >
                                            ${renderBlock(
                                                item
                                            )}
                                        </div>

                                    `
                                )
                                .join("");

                    } else if (
                        section.content !==
                            undefined &&
                        section.content !==
                            null
                    ) {

                        body += `

                            <div
                                class="material-paragraph"
                            >

                                ${renderBlock(
                                    section.content
                                )}

                            </div>

                        `;

                    }


                    /*
                     * ITEMS
                     */

                    if (
                        Array.isArray(
                            section.items
                        )
                    ) {

                        body += `

                            <ul
                                class="material-list"
                            >

                                ${
                                    section.items
                                        .map(
                                            item => `

                                                <li>
                                                    ${renderBlock(
                                                        item
                                                    )}
                                                </li>

                                            `
                                        )
                                        .join("")
                                }

                            </ul>

                        `;

                    }


                    /*
                     * FORMULA
                     */

                    if (
                        section.formula !==
                        undefined
                    ) {

                        body += `

                            <div
                                class="material-formula"
                            >

                                ${renderBlock(
                                    section.formula
                                )}

                            </div>

                        `;

                    }


                    /*
                     * TEXT
                     */

                    if (
                        !body &&
                        section.text !==
                        undefined
                    ) {

                        body =
                            renderBlock(
                                section.text
                            );

                    }


                    /*
                     * FINAL FALLBACK
                     */

                    if (!body) {

                        body =
                            renderBlock(
                                section
                            );

                    }


                    html += `

                        <section
                            class="material-card glass-card material-section material-type-${this.escapeHTML(
                                type || "text"
                            )}"
                        >

                            <h2>
                                ${this.escapeHTML(
                                    sectionTitle
                                )}
                            </h2>


                            <div
                                class="material-text"
                            >

                                ${body}

                            </div>

                        </section>

                    `;

                }
            );


            html += `

                </div>

            `;

        }


        /*
         * =================================================
         * CONCEPT / SUMMARY
         * =================================================
         */

        [
            [
                "concept",
                "Konsep Penting"
            ],

            [
                "summary",
                "Ringkasan"
            ]

        ].forEach(
            (
                [key, heading]
            ) => {

                const value =
                    material[key];


                if (
                    value === undefined ||
                    value === null
                ) {

                    return;

                }


                html += `

                    <section
                        class="material-card glass-card"
                    >

                        <h2>
                            ${heading}
                        </h2>


                        <div
                            class="material-text"
                        >

                            ${renderBlock(
                                value
                            )}

                        </div>

                    </section>

                `;

            }
        );


        /*
         * =================================================
         * FALLBACK MATERIAL
         * =================================================
         */

        if (
            !introduction &&
            !sections.length &&
            material.concept ===
                undefined &&
            material.summary ===
                undefined
        ) {

            html += `

                <section
                    class="material-card glass-card"
                >

                    <div
                        class="material-text"
                    >

                        ${renderBlock(
                            material
                        )}

                    </div>

                </section>

            `;

        }


        html += `

            </article>

        `;


        container.innerHTML =
            html;

    },


    /* =====================================================
       RENDER QUESTIONS
       ===================================================== */

    renderQuestions(
        container,
        questions
    ) {

        if (!container) {
            return;
        }


        if (
            !Array.isArray(questions) ||
            questions.length === 0
        ) {

            container.innerHTML = `

                <div class="program-card">

                    <h3>
                        Soal belum tersedia
                    </h3>

                    <p>
                        Latihan soal untuk
                        subbab ini belum tersedia.
                    </p>

                </div>

            `;

            return;

        }


        const getText =
            value => {

                if (
                    value === null ||
                    value === undefined
                ) {

                    return "";

                }


                if (
                    typeof value === "string" ||
                    typeof value === "number" ||
                    typeof value === "boolean"
                ) {

                    return String(
                        value
                    );

                }


                return this.formatMaterialValue(
                    value
                );

            };


        container.innerHTML =
            questions
                .map(
                    (
                        question,
                        index
                    ) => {

                        const options =
                            Array.isArray(
                                question.options
                            )
                                ? question.options
                                : [];


                        const difficulty =
                            Number(
                                question.difficulty
                            ) || 3;


                        const difficultyLabel = {

                            1:
                                "Level 1 — Sangat Mudah",

                            2:
                                "Level 2 — Mudah",

                            3:
                                "Level 3 — Sedang",

                            4:
                                "Level 4 — Sulit",

                            5:
                                "Level 5 — HOTS"

                        }[
                            difficulty
                        ] ||
                        "Level 3 — Sedang";


                        const stimulus =
                            getText(

                                question.stimulus ??

                                question.passage ??

                                question.readingText ??

                                question.context ??

                                ""

                            );


                        const stimulusTitle =
                            getText(

                                question.stimulusTitle ??

                                question.passageTitle ??

                                question.textTitle ??

                                ""

                            );


                        const image =
                            getText(

                                question.image ??

                                question.imageUrl ??

                                question.stimulusImage ??

                                ""

                            );


                        return `

                            <article
                                class="question-card"
                                data-question="${index}"
                            >

                                <div
                                    class="question-meta"
                                >

                                    <span>
                                        Soal
                                        ${index + 1}
                                    </span>

                                    <span>
                                        ${this.escapeHTML(
                                            difficultyLabel
                                        )}
                                    </span>

                                </div>


                                ${
                                    stimulus
                                        ? `

                                            <div
                                                class="question-stimulus"
                                            >

                                                ${
                                                    stimulusTitle
                                                        ? `
                                                            <h4>
                                                                ${this.escapeHTML(
                                                                    stimulusTitle
                                                                )}
                                                            </h4>
                                                        `
                                                        : ""
                                                }


                                                <div>
                                                    ${stimulus}
                                                </div>

                                            </div>

                                        `
                                        : ""
                                }


                                ${
                                    image
                                        ? `

                                            <div
                                                class="question-image"
                                            >

                                                <img
                                                    src="${this.escapeHTML(
                                                        image
                                                    )}"
                                                    alt="Stimulus soal ${
                                                        index + 1
                                                    }"
                                                >

                                            </div>

                                        `
                                        : ""
                                }


                                <h3
                                    class="question-text"
                                >

                                    ${getText(
                                        question.question ||
                                        question.text ||
                                        question.prompt
                                    )}

                                </h3>


                                <div
                                    class="question-options"
                                >

                                    ${
                                        options
                                            .map(
                                                (
                                                    option,
                                                    optionIndex
                                                ) => {

                                                    const letter =
                                                        String.fromCharCode(
                                                            65 +
                                                            optionIndex
                                                        );


                                                    return `

                                                        <label
                                                            class="question-option"
                                                        >

                                                            <input
                                                                type="radio"
                                                                name="question-${index}"
                                                                value="${this.escapeHTML(
                                                                    letter
                                                                )}"
                                                                data-question-index="${index}"
                                                            >


                                                            <span
                                                                class="option-letter"
                                                            >
                                                                ${letter}
                                                            </span>


                                                            <span
                                                                class="option-text"
                                                            >

                                                                ${getText(
                                                                    option
                                                                )}

                                                            </span>

                                                        </label>

                                                    `;

                                                }
                                            )
                                            .join("")
                                    }

                                </div>

                            </article>

                        `;

                    }
                )
                .join("");

    },


    /* =====================================================
       CHECK ANSWERS
       ===================================================== */

    checkAnswers(
        questions,
        container
    ) {

        if (
            !Array.isArray(
                questions
            )
        ) {

            return null;

        }


        let score = 0;

        let answered = 0;


        questions.forEach(
            (
                question,
                index
            ) => {

                const selected =
                    document.querySelector(
                        `input[name="question-${index}"]:checked`
                    );


                if (!selected) {
                    return;
                }


                answered += 1;


                const answer =
                    String(
                        question.answer || ""
                    )
                        .trim()
                        .toUpperCase();


                const correct =
                    selected.value
                        .toUpperCase() ===
                    answer;


                if (correct) {
                    score += 1;
                }


                const card =
                    selected.closest(
                        ".question-card"
                    );


                if (card) {

                    card.dataset.result =
                        correct
                            ? "correct"
                            : "incorrect";

                }

            }
        );


        const total =
            questions.length;


        const percentage =
            total
                ? Math.round(
                    (score / total) *
                    100
                )
                : 0;


        if (container) {

            container.innerHTML = `

                <div
                    class="quiz-result"
                >

                    <span
                        class="section-label"
                    >
                        HASIL LATIHAN
                    </span>


                    <h2>
                        ${score} / ${total}
                    </h2>


                    <p>
                        ${percentage}%
                        benar
                    </p>


                    <small>
                        ${answered}
                        dari
                        ${total}
                        soal dijawab.
                    </small>

                </div>

            `;

        }


        return {

            score,

            total,

            answered,

            percentage

        };

    },


    /* =====================================================
       VALIDATION
       ===================================================== */

    validateEngine() {

        const required = [

            "load",

            "loadClass",

            "loadSubject",

            "getSemester",

            "isNewStructure",

            "getClassSubjects",

            "getSubjectMetadata",

            "getChapterSemester",

            "findSubject",

            "getSubjectChapters",

            "getChapterByIdentifier",

            "getSubchapterByIdentifier",

            "isTKAData",

            "loadTKA",

            "normalizeTKAData",

            "getTKATopics",

            "findTKATopic",

            "getTKASubtopics",

            "findTKASubtopic",

            "getTKAMaterial",

            "getTKAExamples",

            "getTKAQuestions",
            "getTKAQuestionBank",

            "getTKAEvaluation",

            "renderSubjects",

            "renderChapters",

            "renderSubchapters",

            "renderMaterial",

            "renderQuestions"

        ];


        const result = {};


        required.forEach(
            name => {

                result[name] =
                    typeof this[name] ===
                    "function";

            }
        );


        result.valid =
            required.every(
                name =>
                    result[name]
            );


        return result;

    }

};


/* =========================================================
   GLOBAL ACCESS
   ========================================================= */

window.FJISContent =
    FJISContent;


window.FJISContentEngine =
    FJISContent;


console.log(
    "FJIS Content Engine loaded."
);


console.log(
    "Engine validation:",
    FJISContent.validateEngine()
);
