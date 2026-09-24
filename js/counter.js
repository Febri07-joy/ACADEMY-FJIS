(function () {
    "use strict";

    console.log("FJIS Counter System: ON");


    function parseNumber(text) {

        return parseInt(
            text
                .replace(/\./g, "")
                .replace(/\+/g, "")
                .replace(/%/g, "")
                .trim(),
            10
        );

    }


    function formatNumber(number) {

        return new Intl.NumberFormat(
            "id-ID"
        ).format(number);

    }


    function animateCounter(
        element,
        target,
        suffix,
        duration
    ) {

        const startTime =
            performance.now();


        function update(currentTime) {

            const elapsed =
                currentTime -
                startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            /*
             * Ease Out
             */
            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const current =
                Math.floor(
                    target * eased
                );


            element.textContent =
                formatNumber(current) +
                suffix;


            if (progress < 1) {

                requestAnimationFrame(
                    update
                );

            } else {

                element.textContent =
                    formatNumber(target) +
                    suffix;

            }

        }


        /*
         * MULAI DARI 0
         */
        element.textContent =
            "0" + suffix;


        requestAnimationFrame(
            update
        );

    }


    function initCounters() {

        const counters =
            document.querySelectorAll(
                ".mini-stats strong"
            );


        if (!counters.length) {

            console.warn(
                "FJIS Counter: .mini-stats strong tidak ditemukan"
            );

            return;

        }


        counters.forEach(
            function (element) {

                const original =
                    element.textContent.trim();


                const target =
                    parseNumber(
                        original
                    );


                if (Number.isNaN(target)) {
                    return;
                }


                const suffix =
                    original.includes("%")
                        ? "%"
                        : "+";


                /*
                 * SIMPAN NILAI ASLI
                 */
                element.dataset.counterTarget =
                    target;


                element.dataset.counterSuffix =
                    suffix;


                /*
                 * Kalau sudah terlihat,
                 * jalankan sekarang
                 */
                animateCounter(
                    element,
                    target,
                    suffix,
                    2200
                );

            }
        );

    }


    /*
     * Jalankan setelah halaman siap
     */
    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initCounters
        );

    } else {

        initCounters();

    }

})();
    /*
     * SIMULASI AKTIVITAS BERJALAN
     */

    setInterval(function () {

        const counters =
            document.querySelectorAll(
                ".mini-stats strong"
            );

        if (!counters.length) {
            return;
        }


        counters.forEach(
            function (element, index) {

                /*
                 * Jangan ubah persentase
                 */
                if (
                    element.textContent.includes("%")
                ) {
                    return;
                }


                let current =
                    parseNumber(
                        element.textContent
                    );


                if (Number.isNaN(current)) {
                    return;
                }


                /*
                 * Pertambahan kecil
                 */
                const increase =
                    index === 0
                        ? Math.floor(
                            Math.random() * 3
                        ) + 1
                        : Math.floor(
                            Math.random() * 2
                        ) + 1;


                current += increase;


                element.textContent =
                    formatNumber(
                        current
                    ) + "+";

            }
        );

    }, 8000);