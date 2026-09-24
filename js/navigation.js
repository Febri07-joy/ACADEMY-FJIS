/* =========================================================
   FJIS ACADEMY
   NAVIGATION
   ========================================================= */

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        const navigation = document.querySelector(".main-navigation");
        const menuButton = document.querySelector(".mobile-menu-button");
        const navLinks = document.querySelectorAll(".main-navigation .nav-link");

        if (!navigation || !menuButton) {
            return;
        }


        /* -----------------------------------------------------
           MOBILE MENU
        ----------------------------------------------------- */

        menuButton.addEventListener("click", function () {

            const isOpen = navigation.classList.toggle("is-open");

            menuButton.classList.toggle("is-active", isOpen);

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen
                    ? "Tutup menu"
                    : "Buka menu"
            );

            document.body.classList.toggle(
                "navigation-open",
                isOpen
            );

        });


        /* -----------------------------------------------------
           CLOSE MOBILE MENU WHEN LINK CLICKED
        ----------------------------------------------------- */

        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                closeMobileMenu();

            });

        });


        /* -----------------------------------------------------
           CLOSE WHEN CLICKING OUTSIDE
        ----------------------------------------------------- */

        document.addEventListener("click", function (event) {

            const clickedInsideNavigation =
                navigation.contains(event.target);

            const clickedMenuButton =
                menuButton.contains(event.target);

            if (
                !clickedInsideNavigation &&
                !clickedMenuButton &&
                navigation.classList.contains("is-open")
            ) {
                closeMobileMenu();
            }

        });


        /* -----------------------------------------------------
           CLOSE WITH ESCAPE
        ----------------------------------------------------- */

        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                closeMobileMenu();
            }

        });


        /* -----------------------------------------------------
           ACTIVE NAVIGATION
        ----------------------------------------------------- */

        const sections = document.querySelectorAll(
            "main section[id]"
        );

        if ("IntersectionObserver" in window && sections.length) {

            const sectionObserver = new IntersectionObserver(
                function (entries) {

                    entries.forEach(function (entry) {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        const sectionId = entry.target.id;

                        navLinks.forEach(function (link) {

                            const href =
                                link.getAttribute("href");

                            link.classList.toggle(
                                "active",
                                href === "#" + sectionId
                            );

                        });

                    });

                },
                {
                    rootMargin: "-35% 0px -55% 0px",
                    threshold: 0
                }
            );

            sections.forEach(function (section) {
                sectionObserver.observe(section);
            });

        }


        /* -----------------------------------------------------
           HANDLE RESIZE
        ----------------------------------------------------- */

        window.addEventListener("resize", function () {

            if (window.innerWidth > 900) {
                closeMobileMenu();
            }

        });


        /* -----------------------------------------------------
           FUNCTION
        ----------------------------------------------------- */

        function closeMobileMenu() {

            navigation.classList.remove("is-open");
            menuButton.classList.remove("is-active");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.setAttribute(
                "aria-label",
                "Buka menu"
            );

            document.body.classList.remove(
                "navigation-open"
            );

        }

    });

})();