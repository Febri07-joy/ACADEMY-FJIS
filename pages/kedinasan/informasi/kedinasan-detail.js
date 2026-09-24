document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("kedinasanList");
    const searchInput = document.getElementById("searchKedinasan");

    if (!container) {
        console.error("Element #kedinasanList tidak ditemukan.");
        return;
    }

    const data =
        typeof DATA_KEDINASAN !== "undefined" && Array.isArray(DATA_KEDINASAN)
            ? DATA_KEDINASAN
            : [];

    /* =====================================================
       TATA TAMPILAN INFORMASI KEDINASAN
       ===================================================== */

    const style = document.createElement("style");

    style.textContent = `
        .kedinasan-page-wrap {
            width: min(1180px, calc(100% - 32px));
            margin: 0 auto;
            padding: 32px 0 64px;
        }

        #searchKedinasan {
            width: 100%;
            box-sizing: border-box;
            padding: 15px 18px;
            margin-bottom: 24px;
            border: 1px solid #d9dee7;
            border-radius: 14px;
            background: #fff;
            color: #18212f;
            font-size: 16px;
            outline: none;
            box-shadow: 0 4px 16px rgba(20,30,50,.05);
            transition: .2s ease;
        }

        #searchKedinasan::placeholder {
            color: #94a3b8;
        }

        #searchKedinasan:focus {
            border-color: #8da2bd;
            box-shadow: 0 0 0 3px rgba(80,110,145,.10);
        }

        #kedinasanList {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
        }

        .kedinasan-card {
            min-width: 0;
            background: #fff;
            border: 1px solid #e5e9ef;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 6px 22px rgba(20,30,50,.06);
            transition:
                transform .2s ease,
                box-shadow .2s ease,
                border-color .2s ease;
            animation: kedinasanCardIn .35s ease both;
        }

        .kedinasan-card:hover {
            transform: translateY(-3px);
            border-color: #d8dee8;
            box-shadow: 0 12px 30px rgba(20,30,50,.10);
        }

        .kedinasan-card-content {
            padding: 22px;
        }

        .kedinasan-card h3 {
            margin: 0 0 5px;
            color: #172033;
            font-size: 20px;
            line-height: 1.3;
            letter-spacing: -.2px;
        }

        .kedinasan-singkatan {
            display: inline-block;
            margin-bottom: 12px;
            color: #64748b;
            font-size: 13px;
            font-weight: 700;
        }

        .kedinasan-card p {
            margin: 0 0 17px;
            color: #4b5563;
            font-size: 14px;
            line-height: 1.7;
        }

        .kedinasan-info {
            display: grid;
            gap: 8px;
            padding: 14px;
            margin-bottom: 18px;
            background: #f8fafc;
            border: 1px solid #edf0f4;
            border-radius: 12px;
            color: #4b5563;
            font-size: 13px;
            line-height: 1.55;
        }

        .kedinasan-info div {
            overflow-wrap: anywhere;
        }

        .kedinasan-info strong {
            color: #1f2937;
        }

        .btn-official {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 40px;
            padding: 0 16px;
            border-radius: 10px;
            background: #172033;
            color: #fff !important;
            text-decoration: none !important;
            font-size: 13px;
            font-weight: 700;
            transition: .2s ease;
        }

        .btn-official:hover {
            transform: translateY(-1px);
            opacity: .92;
        }

        .empty-state {
            grid-column: 1 / -1;
            padding: 40px 20px;
            text-align: center;
            color: #64748b;
            background: #fff;
            border: 1px solid #e5e9ef;
            border-radius: 16px;
        }

        @keyframes kedinasanCardIn {
            from {
                opacity: 0;
                transform: translateY(8px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 900px) {
            #kedinasanList {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 760px) {
            .kedinasan-page-wrap {
                width: min(100% - 24px, 620px);
                padding-top: 22px;
            }

            #kedinasanList {
                gap: 15px;
            }

            .kedinasan-card-content {
                padding: 18px;
            }

            .kedinasan-card h3 {
                font-size: 18px;
            }

            #searchKedinasan {
                margin-bottom: 18px;
            }
        }
    `;

    document.head.appendChild(style);

    /* =====================================================
       WRAPPER
       ===================================================== */

    if (!container.parentElement.classList.contains("kedinasan-page-wrap")) {
        const wrapper = document.createElement("div");
        wrapper.className = "kedinasan-page-wrap";

        container.parentNode.insertBefore(wrapper, container);
        wrapper.appendChild(container);
    }

    /* =====================================================
       KEAMANAN HTML
       ===================================================== */

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* =====================================================
       RENDER DATA
       ===================================================== */

    function render(list) {
        if (!list.length) {
            container.innerHTML = `
                <div class="empty-state">
                    Data kedinasan tidak ditemukan.
                </div>
            `;
            return;
        }

        container.innerHTML = list.map((item) => `
            <article class="kedinasan-card">

                <div class="kedinasan-card-content">

                    <h3>
                        ${escapeHTML(item.nama)}
                    </h3>

                    ${
                        item.singkatan
                            ? `
                                <div class="kedinasan-singkatan">
                                    ${escapeHTML(item.singkatan)}
                                </div>
                            `
                            : ""
                    }

                    <p>
                        ${escapeHTML(item.deskripsi || "")}
                    </p>

                    <div class="kedinasan-info">

                        ${
                            item.kementerian
                                ? `
                                    <div>
                                        <strong>Instansi:</strong>
                                        ${escapeHTML(item.kementerian)}
                                    </div>
                                `
                                : ""
                        }

                        ${
                            item.kategori
                                ? `
                                    <div>
                                        <strong>Kategori:</strong>
                                        ${escapeHTML(item.kategori)}
                                    </div>
                                `
                                : ""
                        }

                        ${
                            item.formasi
                                ? `
                                    <div>
                                        <strong>Formasi:</strong>
                                        ${escapeHTML(item.formasi)}
                                    </div>
                                `
                                : ""
                        }

                        ${
                            item.pendaftaran
                                ? `
                                    <div>
                                        <strong>Pendaftaran:</strong>
                                        ${escapeHTML(item.pendaftaran)}
                                    </div>
                                `
                                : ""
                        }

                    </div>

                    ${
                        item.website
                            ? `
                                <a
                                    class="btn-official"
                                    href="${escapeHTML(item.website)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Website Resmi ↗
                                </a>
                            `
                            : ""
                    }

                </div>

            </article>
        `).join("");
    }

    /* =====================================================
       SEARCH
       ===================================================== */

    function filterData(keyword) {
        const q = keyword.trim().toLowerCase();

        if (!q) {
            return data;
        }

        return data.filter((item) => {
            const searchableText = [
                item.nama,
                item.singkatan,
                item.kementerian,
                item.kategori,
                item.deskripsi,
                item.formasi,
                item.pendaftaran
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(q);
        });
    }

    /* =====================================================
       INITIAL RENDER
       ===================================================== */

    render(data);

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            render(filterData(searchInput.value));
        });
    }

    console.log(
        `FJIS Academy — Informasi Kedinasan aktif. ${data.length} data dimuat.`
    );
});
