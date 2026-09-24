/* ============================================================
   FJIS ACADEMY — KULIAH / BEASISWA
   Terhubung ke Scholarship Engine
   Status & warna otomatis:
   OPEN      = hijau
   UPCOMING  = kuning
   CLOSED    = merah
============================================================ */

(function () {
  "use strict";

  const grid = document.getElementById("grid");
  const count = document.getElementById("count");
  const empty = document.getElementById("empty");
  const modal = document.getElementById("modal");
  const close = document.getElementById("close");

  if (!grid) return;

  function formatDate(value) {
    if (!value) return "—";

    const p = String(value).split("-").map(Number);

    if (p.length !== 3 || p.some(Number.isNaN)) {
      return value;
    }

    return new Date(
      p[0],
      p[1] - 1,
      p[2]
    ).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }

  function daysLeft(item) {
    if (!item.deadline) return "";

    const p = String(item.deadline).split("-").map(Number);

    if (p.length !== 3 || p.some(Number.isNaN)) {
      return "";
    }

    const deadline = new Date(
      p[0],
      p[1] - 1,
      p[2],
      23,
      59,
      59,
      999
    );

    const diff = Math.ceil(
      (deadline - new Date()) / 86400000
    );

    if (diff < 0) return "Pendaftaran telah berakhir.";
    if (diff === 0) return "Batas pendaftaran hari ini.";

    return `${diff} hari lagi`;
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getStatusClass(status) {
    const key = status?.key;

    if (key === "closed") return "closed";
    if (key === "upcoming") return "upcoming";
    return "open";
  }

  function getActionText(statusClass) {
    if (statusClass === "closed") {
      return "Lihat sumber →";
    }

    if (statusClass === "upcoming") {
      return "Lihat info →";
    }

    return "Daftar / Info →";
  }

  function render(data) {
    const records = Array.isArray(data) ? data : [];

    grid.innerHTML = "";

    const open = records.filter(
      x => x.status?.key === "open"
    ).length;

    const upcoming = records.filter(
      x => x.status?.key === "upcoming"
    ).length;

    const closed = records.filter(
      x => x.status?.key === "closed"
    ).length;

    if (count) {
      count.textContent =
        `${open} dibuka · ${upcoming} akan dibuka · ${closed} sudah tutup · ${records.length} total`;
    }

    if (!records.length) {
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;

    records.forEach(item => {
      const status = item.status || {
        key: "open",
        label: "Dibuka"
      };

      const statusClass = getStatusClass(status);

      const card = document.createElement("article");

      card.className =
        `card scholarship-card status-${statusClass}`;

      const url =
        item.applyUrl ||
        item.infoUrl ||
        "#";

      const actionText =
        getActionText(statusClass);

      let periodExtra = "";

      if (statusClass === "open") {
        const remaining = daysLeft(item);

        if (remaining) {
          periodExtra =
            `<br><b>${escapeHTML(remaining)}</b>`;
        }
      }

      if (statusClass === "upcoming") {
        periodExtra =
          `<br><b class="upcoming-note">Pendaftaran belum dibuka.</b>`;
      }

      if (statusClass === "closed") {
        periodExtra =
          `<br><b class="closed-note">Pendaftaran telah berakhir.</b>`;
      }

      card.innerHTML = `
        <div>

          <span class="badge status-badge ${statusClass}">
            ${escapeHTML(status.label)}
          </span>

          <h3>${escapeHTML(item.name)}</h3>

          <div class="org">
            ${escapeHTML(item.organization)}
          </div>

          <div class="deadline">
            <strong>📅 Periode</strong><br>
            ${escapeHTML(formatDate(item.start))}
            —
            ${escapeHTML(formatDate(item.deadline))}
            ${periodExtra}
          </div>

          <div class="meta-row">
            <span>${escapeHTML(item.level)}</span>
            <span>${escapeHTML(item.funding)}</span>
          </div>

        </div>

        <div class="actions">

          <button
            class="detail"
            type="button"
          >
            Detail
          </button>

          <a
            class="apply ${statusClass}"
            href="${escapeHTML(url)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${actionText}
          </a>

        </div>
      `;

      const detailButton =
        card.querySelector(".detail");

      if (detailButton) {
        detailButton.addEventListener(
          "click",
          () => openDetail(item)
        );
      }

      grid.appendChild(card);
    });
  }

  function openDetail(item) {
    if (!modal) return;

    const status = item.status || {
      key: "open",
      label: "Dibuka"
    };

    const statusClass =
      getStatusClass(status);

    const title =
      document.getElementById("title");

    const org =
      document.getElementById("org");

    const content =
      document.getElementById("content");

    if (title) {
      title.textContent =
        item.name || "";
    }

    if (org) {
      org.textContent =
        `${item.organization || ""} · ${item.level || ""}`;
    }

    const requirements =
      Array.isArray(item.requirements)
        ? item.requirements
        : [];

    const url =
      item.applyUrl ||
      item.infoUrl ||
      "#";

    let buttonText =
      "Buka pendaftaran / info resmi →";

    if (statusClass === "closed") {
      buttonText =
        "Buka sumber informasi →";
    } else if (statusClass === "upcoming") {
      buttonText =
        "Lihat informasi →";
    }

    if (content) {
      content.innerHTML = `
        <p>
          <strong>Status:</strong>
          <span class="modal-status ${statusClass}">
            ${escapeHTML(status.label)}
          </span>
        </p>

        <p>
          <strong>Periode:</strong>
          ${escapeHTML(formatDate(item.start))}
          —
          ${escapeHTML(formatDate(item.deadline))}
        </p>

        <p>
          <strong>Pendanaan:</strong>
          ${escapeHTML(item.funding || "—")}
        </p>

        <h3>Ringkasan</h3>

        <p>
          ${escapeHTML(
            item.description ||
            "Belum ada ringkasan."
          )}
        </p>

        <h3>Persyaratan utama</h3>

        <ul>
          ${
            requirements.length
              ? requirements
                  .map(
                    x =>
                      `<li>${escapeHTML(x)}</li>`
                  )
                  .join("")
              : "<li>Cek sumber resmi.</li>"
          }
        </ul>

        <h3>Benefit</h3>

        <p>
          ${escapeHTML(
            item.benefit ||
            "Cek sumber resmi."
          )}
        </p>

        <div
          class="actions"
          style="margin-top:16px"
        >
          <a
            class="apply ${statusClass}"
            href="${escapeHTML(url)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${buttonText}
          </a>
        </div>
      `;
    }

    modal.classList.add("show");
  }

  if (close && modal) {
    close.addEventListener(
      "click",
      () => {
        modal.classList.remove("show");
      }
    );
  }

  if (modal) {
    modal.addEventListener(
      "click",
      event => {
        if (event.target === modal) {
          modal.classList.remove("show");
        }
      }
    );
  }

  function useEngineData() {
    if (
      Array.isArray(
        window.FJIS_SCHOLARSHIPS
      )
    ) {
      render(
        window.FJIS_SCHOLARSHIPS
      );

      return true;
    }

    return false;
  }

  /*
    Engine mengirim event ketika:
    - data pertama kali tersedia
    - feed diperbarui
    - status berubah
  */
  document.addEventListener(
    "fjis:scholarships-updated",
    event => {
      render(
        event.detail?.scholarships || []
      );
    }
  );

  /*
    Fallback jika engine belum selesai.
  */
  if (!useEngineData()) {
    const local =
      Array.isArray(
        window.SCHOLARSHIPS_KULIAH
      )
        ? window.SCHOLARSHIPS_KULIAH
        : [];

    const fallback =
      local.map(item => {
        const now = new Date();

        const start = item.start
          ? new Date(
              item.start +
              "T00:00:00"
            )
          : null;

        const deadline =
          item.deadline
            ? new Date(
                item.deadline +
                "T23:59:59"
              )
            : null;

        let status = {
          key: "open",
          label: "Dibuka"
        };

        if (start && now < start) {
          status = {
            key: "upcoming",
            label: "Belum Dibuka"
          };
        } else if (
          deadline &&
          now > deadline
        ) {
          status = {
            key: "closed",
            label: "Sudah Tutup"
          };
        }

        return {
          ...item,
          status
        };
      });

    fallback.sort((a, b) => {
      const order = {
        open: 0,
        upcoming: 1,
        closed: 2
      };

      return (
        order[a.status.key] -
        order[b.status.key]
      );
    });

    render(fallback);
  }
})();
