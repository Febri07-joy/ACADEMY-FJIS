(function () {
    "use strict";

    console.log("=================================");
    console.log("FJIS ACADEMY SYSTEM START");
    console.log("=================================");

    /* =====================================================
       HELPER
    ===================================================== */

    function ready(callback) {

        if (document.readyState === "loading") {

            document.addEventListener(
                "DOMContentLoaded",
                callback
            );

        } else {

            callback();

        }

    }


    /* =====================================================
       PAGE LOADER
    ===================================================== */

    function initLoader() {

        const loader =
            document.getElementById("pageLoader");

        if (!loader) return;

        loader.classList.add("is-hidden");

        setTimeout(function () {

            loader.style.display = "none";

        }, 800);

    }


    /* =====================================================
       REAL TIME CLOCK
    ===================================================== */

    function initClock() {

        const clocks =
            document.querySelectorAll(
                "[data-clock]"
            );

        console.log(
            "CLOCK ELEMENTS:",
            clocks.length
        );

        if (!clocks.length) return;


        function update() {

            const now = new Date();

            const day =
                String(
                    now.getDate()
                ).padStart(2, "0");


            const months = [

                "Januari",
                "Februari",
                "Maret",
                "April",
                "Mei",
                "Juni",
                "Juli",
                "Agustus",
                "September",
                "Oktober",
                "November",
                "Desember"

            ];


            const month =
                months[
                    now.getMonth()
                ];


            const year =
                now.getFullYear();


            const hour =
                String(
                    now.getHours()
                ).padStart(2, "0");


            const minute =
                String(
                    now.getMinutes()
                ).padStart(2, "0");


            const second =
                String(
                    now.getSeconds()
                ).padStart(2, "0");


            const output =
                `${day} ${month} ${year} ${hour}:${minute}:${second}`;


            clocks.forEach(function (clock) {

                clock.textContent =
                    output;

            });

        }


        update();


        setInterval(
            update,
            1000
        );


        console.log(
            "CLOCK SYSTEM: ON"
        );

    }


    /* =====================================================
       HERO MOTIVATION
       HANYA UNTUK LANDING PAGE
    ===================================================== */

    function initHeroMotivation() {

        const element =
            document.getElementById(
                "heroMotivation"
            );


        if (!element) {

            return;

        }


        const quotes = [

            "Apa yang kamu latih hari ini akan membentuk dirimu.",

            "Belajar hari ini adalah persiapan untuk hari esok.",

            "Tidak harus langsung hebat. Yang penting terus bertumbuh.",

            "Setiap proses belajar membawa kamu satu langkah lebih dekat.",

            "Kamu tidak sedang terlambat. Kamu sedang bertumbuh.",

            "Sedikit demi sedikit tetap merupakan sebuah kemajuan.",

            "Apa yang kamu pelajari hari ini akan menjadi bekal untuk hari esok."

        ];


        let index = 0;


        element.style.transition =
            "opacity 0.45s ease, transform 0.45s ease";


        element.textContent =
            quotes[0];


        function changeQuote() {

            element.style.opacity =
                "0";


            element.style.transform =
                "translateY(10px)";


            setTimeout(function () {

                index =
                    (index + 1) %
                    quotes.length;


                element.textContent =
                    quotes[index];


                element.style.opacity =
                    "1";


                element.style.transform =
                    "translateY(0)";

            }, 450);

        }


        setInterval(
            changeQuote,
            3000
        );


        console.log(
            "HERO MOTIVATION: ON"
        );

    }


    /* =====================================================
       SECONDARY MOTIVATION
       HANYA UNTUK LANDING PAGE
    ===================================================== */

    function initSecondaryMotivation() {

        const element =
            document.getElementById(
                "secondaryMotivation"
            );


        if (!element) {

            return;

        }


        const quotes = [

            "Terus belajar, terus bertumbuh, terus melangkah.",

            "Belajar dengan tujuan. Bertumbuh dengan proses.",

            "Hari ini belajar. Besok menjadi lebih siap.",

            "Tidak perlu sempurna untuk terus berkembang.",

            "Setiap langkah kecil tetap merupakan kemajuan."

        ];


        let index = 0;


        element.style.transition =
            "opacity 0.4s ease";


        setInterval(function () {

            element.style.opacity =
                "0";


            setTimeout(function () {

                index =
                    (index + 1) %
                    quotes.length;


                element.textContent =
                    quotes[index];


                element.style.opacity =
                    "1";

            }, 400);

        }, 3000);


        console.log(
            "SECONDARY MOTIVATION: ON"
        );

    }


    /* =====================================================
       LIVE DASHBOARD NUMBERS

       Peserta:
       38.523+

       Aktivitas:
       1.284+

       Naik:
       +4 / +5 / +6

       Bergantian setiap 2–3 detik
    ===================================================== */

    function initNumbers() {

        const stats =
            document.querySelectorAll(
                ".mini-stats strong"
            );


        if (stats.length < 2) {

            return;

        }


        let participants =
            38523;


        let activities =
            1284;


        function formatNumber(value) {

            return new Intl.NumberFormat(
                "id-ID"
            ).format(value);

        }


        function randomIncrease() {

            return (
                Math.floor(
                    Math.random() * 3
                ) + 4
            );

        }


        function updateParticipants() {

            participants +=
                randomIncrease();


            stats[0].textContent =
                formatNumber(
                    participants
                ) + "+";


            setTimeout(
                updateActivities,
                2000 +
                Math.random() * 1000
            );

        }


        function updateActivities() {

            activities +=
                randomIncrease();


            stats[1].textContent =
                formatNumber(
                    activities
                ) + "+";


            setTimeout(
                updateParticipants,
                2000 +
                Math.random() * 1000
            );

        }


        stats[0].textContent =
            formatNumber(
                participants
            ) + "+";


        stats[1].textContent =
            formatNumber(
                activities
            ) + "+";


        setTimeout(
            updateParticipants,
            2500
        );


        console.log(
            "LIVE NUMBER SYSTEM: ON"
        );

    }


    /* =====================================================
       STUDENT RESPONSE
       HANYA AKTIF JIKA ELEMENT RESPONSE ADA
    ===================================================== */

    function initResponses() {

        const responses = {

            sma: [

                {
                    name: "J*****n",
                    text:
                        "Waduh gimana nih para pejuang PTN? Bentar lagi TKA, udah pada siap belum? Jujur gue masih dikit banget persiapan."
                },

                {
                    name: "A****a",
                    text:
                        "Awalnya bingung mulai belajar dari mana. Sekarang gue coba cicil sedikit-sedikit setiap hari."
                },

                {
                    name: "R*****n",
                    text:
                        "Menurut gue yang paling penting bukan belajar lama, tapi konsisten."
                },

                {
                    name: "D****n",
                    text:
                        "Gue mulai belajar lebih teratur setelah sadar kalau persiapan itu nggak bisa dilakukan semalam."
                }

            ],


            kuliah: [

                {
                    name: "M****a",
                    text:
                        "Gimana nih para maba, shock kah ketika masuk kuliah? Wkwk."
                },

                {
                    name: "D*****i",
                    text:
                        "Ternyata dunia kuliah ngajarin gue buat lebih mandiri dan bisa ngatur waktu sendiri."
                },

                {
                    name: "F****a",
                    text:
                        "Tugas memang banyak, tapi lama-lama mulai ngerti cara ngatur prioritas."
                },

                {
                    name: "A****n",
                    text:
                        "Awalnya takut nggak bisa ngikutin, ternyata kalau mau bertanya dan terus belajar semuanya bisa dipelajari."
                }

            ]

        };


        function rotate(type) {

            const nameElement =
                document.querySelector(
                    `[data-response-name="${type}"]`
                );


            const textElement =
                document.querySelector(
                    `[data-response-text="${type}"]`
                );


            /*
             * PENTING:
             * Kalau response card tidak ada,
             * jangan melakukan apa-apa.
             */

            if (
                !nameElement ||
                !textElement
            ) {

                return;

            }


            let index = 0;


            setInterval(function () {

                index++;


                if (
                    index >=
                    responses[type].length
                ) {

                    index = 0;

                }


                const response =
                    responses[type][index];


                nameElement.style.transition =
                    "opacity .3s ease";


                textElement.style.transition =
                    "opacity .3s ease";


                nameElement.style.opacity =
                    "0";


                textElement.style.opacity =
                    "0";


                setTimeout(function () {

                    nameElement.textContent =
                        response.name;


                    textElement.textContent =
                        response.text;


                    nameElement.style.opacity =
                        "1";


                    textElement.style.opacity =
                        "1";

                }, 300);


            }, 2500);

        }


        rotate("sma");

        rotate("kuliah");


        /*
         * Hanya tampilkan log kalau
         * memang ada response card.
         */

        const hasSMA =
            document.querySelector(
                '[data-response-name="sma"]'
            );


        const hasKuliah =
            document.querySelector(
                '[data-response-name="kuliah"]'
            );


        if (
            hasSMA ||
            hasKuliah
        ) {

            console.log(
                "RESPONSE SYSTEM: ON"
            );

        }

    }


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    function initNavigation() {

        const button =
            document.getElementById(
                "mobileMenuButton"
            );


        const navigation =
            document.getElementById(
                "mainNavigation"
            );


        if (
            !button ||
            !navigation
        ) {

            return;

        }


        button.addEventListener(
            "click",
            function () {

                const open =
                    navigation.classList.toggle(
                        "is-open"
                    );


                button.classList.toggle(
                    "is-active",
                    open
                );


                button.setAttribute(
                    "aria-expanded",
                    String(open)
                );

            }
        );


        navigation
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navigation.classList.remove(
                            "is-open"
                        );


                        button.classList.remove(
                            "is-active"
                        );


                        button.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            });


        console.log(
            "NAVIGATION SYSTEM: ON"
        );

    }


    /* =====================================================
       DETECT PAGE
    ===================================================== */

    function detectPage() {

        const path =
            window.location.pathname
                .toLowerCase();


        if (
            path.endsWith(
                "/index.html"
            ) ||
            path === "/" ||
            path === ""
        ) {

            return "landing";

        }


        if (
            path.includes(
                "/sma/"
            )
        ) {

            return "sma";

        }


        if (
            path.includes(
                "/kedinasan/"
            )
        ) {

            return "kedinasan";

        }


        if (
            path.includes(
                "/kuliah/"
            )
        ) {

            return "kuliah";

        }


        if (
            path.includes(
                "/beasiswa/"
            )
        ) {

            return "beasiswa";

        }


        if (
            path.includes(
                "/dashboard"
            )
        ) {

            return "dashboard";

        }


        if (
            path.includes(
                "/login"
            ) ||
            path.includes(
                "/register"
            )
        ) {

            return "auth";

        }


        return "other";

    }


    /* =====================================================
       START EVERYTHING
    ===================================================== */

    ready(function () {

        console.log(
            "FJIS DOM READY"
        );


        const currentPage =
            detectPage();


        console.log(
            "CURRENT PAGE:",
            currentPage
        );


        /*
         * SISTEM GLOBAL
         */

        initLoader();

        initClock();

        initNavigation();


        /*
         * SISTEM LANDING SAJA
         *
         * Jadi materi.html,
         * bab.html,
         * materi-belajar.html,
         * dll tidak akan menjalankan
         * sistem yang tidak mereka perlukan.
         */

        if (
            currentPage ===
            "landing"
        ) {

            initHeroMotivation();

            initSecondaryMotivation();

            initNumbers();

            initResponses();

        }


        /*
         * FALLBACK
         *
         * Kalau halaman landing
         * tidak terdeteksi karena
         * struktur URL tertentu,
         * cek berdasarkan element.
         */

        if (
            currentPage !==
            "landing"
        ) {

            const hasHero =
                document.getElementById(
                    "heroMotivation"
                );


            const hasStats =
                document.querySelector(
                    ".mini-stats strong"
                );


            const hasResponses =
                document.querySelector(
                    "[data-response-name]"
                );


            if (hasHero) {

                initHeroMotivation();

            }


            if (hasStats) {

                initNumbers();

            }


            if (hasResponses) {

                initResponses();

            }

        }


        console.log(
            "================================="
        );


        console.log(
            "FJIS ALL SYSTEMS READY"
        );


        console.log(
            "PAGE:",
            currentPage
        );


        console.log(
            "================================="
        );

    });

})();