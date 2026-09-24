(function () {
    "use strict";

    console.log("FJIS Clock System: ON");


    function updateClock() {

        const clocks =
            document.querySelectorAll(
                "[data-clock]"
            );


        if (!clocks.length) {

            console.warn(
                "FJIS Clock: data-clock tidak ditemukan"
            );

            return;

        }


        const now =
            new Date();


        const day =
            String(
                now.getDate()
            ).padStart(2, "0");


        const monthNames = [
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
            monthNames[
                now.getMonth()
            ];


        const year =
            now.getFullYear();


        const hours =
            String(
                now.getHours()
            ).padStart(2, "0");


        const minutes =
            String(
                now.getMinutes()
            ).padStart(2, "0");


        const seconds =
            String(
                now.getSeconds()
            ).padStart(2, "0");


        const result =
            `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;


        clocks.forEach(
            function (clock) {

                clock.textContent =
                    result;

            }
        );

    }


    updateClock();


    setInterval(
        updateClock,
        1000
    );

})();