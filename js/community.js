(function () {
    "use strict";

    console.log("FJIS Community loaded");

    const STORAGE =
        "fjis_student_experiences";


    const data = {

        sma: [
            {
                name: "J*****n",
                message:
                    "Waduh gimana nih para pejuang PTN? Bentar lagi TKA, udah pada siap belum? Jujur gue masih dikit banget persiapan."
            },
            {
                name: "A****a",
                message:
                    "Awalnya bingung mulai belajar dari mana. Sekarang gue coba cicil sedikit-sedikit setiap hari."
            },
            {
                name: "R*****n",
                message:
                    "Menurut gue yang paling penting bukan belajar lama, tapi konsisten."
            }
        ],

        kuliah: [
            {
                name: "M****a",
                message:
                    "Gimana nih para maba, shock kah ketika masuk kuliah? Wkwk."
            },
            {
                name: "D*****i",
                message:
                    "Ternyata dunia kuliah ngajarin gue buat lebih mandiri dan bisa ngatur waktu sendiri."
            },
            {
                name: "F****a",
                message:
                    "Tugas memang banyak, tapi lama-lama mulai ngerti cara ngatur prioritas."
            }
        ]

    };


    function getUserData() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    STORAGE
                )
            ) || [];

        } catch {

            return [];

        }
    }


    function saveUserData(item) {

        const current =
            getUserData();

        current.push(item);

        localStorage.setItem(
            STORAGE,
            JSON.stringify(current)
        );

    }


    function getAll(type) {

        const seed =
            data[type] || [];

        const user =
            getUserData()
                .filter(function (item) {
                    return item.type === type;
                });

        return seed.concat(user);
    }


    /* =====================================================
       ROTATING RESPONSE
    ===================================================== */

    function startRotation(type) {

        const name =
            document.querySelector(
                `[data-response-name="${type}"]`
            );

        const text =
            document.querySelector(
                `[data-response-text="${type}"]`
            );

        if (!name || !text) {
            return;
        }

        let index = 0;

        setInterval(function () {

            const responses =
                getAll(type);

            if (!responses.length) {
                return;
            }

            index =
                (index + 1) %
                responses.length;

            const response =
                responses[index];

            name.style.opacity = "0";
            text.style.opacity = "0";

            setTimeout(function () {

                name.textContent =
                    response.name;

                text.textContent =
                    response.message;

                name.style.opacity = "1";
                text.style.opacity = "1";

            }, 300);

        }, 2500);

    }


    /* =====================================================
       EXPERIENCE MODAL
    ===================================================== */

    function setupExperience() {

        document
            .querySelectorAll(
                "[data-open-experience]"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const type =
                            button.getAttribute(
                                "data-open-experience"
                            );

                        const modal =
                            document.getElementById(
                                "experienceModal"
                            );

                        const typeInput =
                            document.getElementById(
                                "experienceType"
                            );

                        if (!modal) return;

                        if (typeInput) {
                            typeInput.value = type;
                        }

                        modal.classList.add(
                            "is-open"
                        );

                        modal.setAttribute(
                            "aria-hidden",
                            "false"
                        );

                    }
                );

            });


        document
            .querySelectorAll(
                "#experienceModal [data-close-modal]"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    closeExperience
                );

            });


        const form =
            document.getElementById(
                "experienceForm"
            );

        if (!form) return;


        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const name =
                    document
                        .getElementById(
                            "experienceName"
                        )
                        .value
                        .trim();

                const message =
                    document
                        .getElementById(
                            "experienceMessage"
                        )
                        .value
                        .trim();

                const type =
                    document
                        .getElementById(
                            "experienceType"
                        )
                        .value;

                if (
                    !name ||
                    !message ||
                    !type
                ) {
                    return;
                }


                saveUserData({
                    name: maskName(name),
                    message: message,
                    type: type,
                    createdAt:
                        new Date().toISOString()
                });


                form.reset();

                closeExperience();

            }
        );

    }


    function closeExperience() {

        const modal =
            document.getElementById(
                "experienceModal"
            );

        if (!modal) return;

        modal.classList.remove(
            "is-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       VIEW ALL RESPONSE
    ===================================================== */

    function setupViewResponses() {

        document
            .querySelectorAll(
                "[data-view-responses]"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const type =
                            button.getAttribute(
                                "data-view-responses"
                            );

                        showAllResponses(type);

                    }
                );

            });


        document
            .querySelectorAll(
                "[data-close-responses]"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    closeResponses
                );

            });

    }


    function showAllResponses(type) {

        const modal =
            document.getElementById(
                "responsesModal"
            );

        const container =
            document.getElementById(
                "allResponses"
            );

        if (!modal || !container) {
            return;
        }


        container.innerHTML = "";


        getAll(type).forEach(
            function (response) {

                const article =
                    document.createElement(
                        "article"
                    );

                article.className =
                    "community-response-item";


                const author =
                    document.createElement(
                        "strong"
                    );

                author.textContent =
                    response.name;


                const message =
                    document.createElement(
                        "p"
                    );

                message.textContent =
                    response.message;


                article.appendChild(
                    author
                );

                article.appendChild(
                    message
                );

                container.appendChild(
                    article
                );

            }
        );


        modal.classList.add(
            "is-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    function closeResponses() {

        const modal =
            document.getElementById(
                "responsesModal"
            );

        if (!modal) return;

        modal.classList.remove(
            "is-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       RANDOM NAME MASK
    ===================================================== */

    function maskName(name) {

        const chars =
            name.split("");

        const validIndexes =
            chars
                .map(function (char, index) {
                    return char !== " "
                        ? index
                        : null;
                })
                .filter(function (index) {
                    return index !== null;
                });


        const count =
            Math.max(
                1,
                Math.floor(
                    validIndexes.length / 2
                )
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const random =
                Math.floor(
                    Math.random() *
                    validIndexes.length
                );

            const index =
                validIndexes.splice(
                    random,
                    1
                )[0];

            chars[index] = "*";

        }


        return chars.join("");

    }


    /* =====================================================
       INIT
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            startRotation("sma");
            startRotation("kuliah");

            setupExperience();
            setupViewResponses();

        }
    );

})();