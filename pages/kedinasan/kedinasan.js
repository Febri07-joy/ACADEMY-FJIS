/* =========================================================
   FJIS ACADEMY — KEDINASAN
   File: kedinasan.js
   Fokus: fungsi utama + perapihan tampilan
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("FJIS Academy — Kedinasan aktif.");

    /* =====================================================
       UI / LAYOUT IMPROVEMENT
       Tidak mengubah data, pencarian, tryout, atau navigasi.
       ===================================================== */

    document.body.classList.add("kedinasan-page");

    const containers = document.querySelectorAll(
        ".kedinasan-container, .kedinasan-content, .container, main"
    );

    containers.forEach((el) => {
        el.classList.add("kedinasan-layout-ready");
    });

    const cards = document.querySelectorAll(
        ".card, .kedinasan-card, .academy-card, .menu-card"
    );

    cards.forEach((card, index) => {
        card.classList.add("kedinasan-ui-card");
        card.style.setProperty("--card-index", index);
    });

    const buttons = document.querySelectorAll(
        "button, .btn, .button, a.btn, .menu-button"
    );

    buttons.forEach((button) => {
        button.classList.add("kedinasan-ui-button");
    });

    const headings = document.querySelectorAll(
        "h1, .page-title, .kedinasan-title"
    );

    headings.forEach((heading) => {
        heading.classList.add("kedinasan-ui-title");
    });

    const revealItems = document.querySelectorAll(
        ".kedinasan-ui-card, .section, .kedinasan-section"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08 }
        );

        revealItems.forEach((item) => {
            item.classList.add("kedinasan-reveal");
            observer.observe(item);
        });
    } else {
        revealItems.forEach((item) => {
            item.classList.add("is-visible");
        });
    }

    const currentPath = window.location.pathname;

    document.querySelectorAll("a[href]").forEach((link) => {
        const href = link.getAttribute("href");

        if (!href || href === "#" || href.startsWith("javascript:")) {
            return;
        }

        try {
            const linkUrl = new URL(href, window.location.href);

            if (
                linkUrl.pathname === currentPath &&
                !link.classList.contains("active")
            ) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        } catch (error) {
            // Abaikan href yang bukan URL valid.
        }
    });

    const updateViewportClass = () => {
        document.body.classList.toggle(
            "kedinasan-mobile",
            window.innerWidth <= 768
        );

        document.body.classList.toggle(
            "kedinasan-tablet",
            window.innerWidth > 768 && window.innerWidth <= 1024
        );

        document.body.classList.toggle(
            "kedinasan-desktop",
            window.innerWidth > 1024
        );
    };

    updateViewportClass();
    window.addEventListener("resize", updateViewportClass);

});
