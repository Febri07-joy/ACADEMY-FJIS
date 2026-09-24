/* ============================================================
   FJIS ACADEMY — SCHOLARSHIP ENGINE v2
   Hosting-ready
   - Database lokal tetap dipakai
   - Feed JSON dibaca otomatis
   - Status otomatis dari tanggal
   - Data aktif di atas, yang tutup di bawah
   - Tidak menghapus data lama
============================================================ */

(function () {
  "use strict";

  const LOCAL_DATA = Array.isArray(window.SCHOLARSHIPS_KULIAH)
    ? window.SCHOLARSHIPS_KULIAH
    : [];

  /* File ini berada di folder sources/ */
  const FEED_URL = "./scholarship-feed.json";

  function parseDate(value, endOfDay = false) {
    if (!value) return null;

    const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;

    return endOfDay
      ? new Date(+m[1], +m[2] - 1, +m[3], 23, 59, 59, 999)
      : new Date(+m[1], +m[2] - 1, +m[3], 0, 0, 0, 0);
  }

  function getStatus(item) {
    const now = new Date();
    const start = parseDate(item.start);
    const deadline = parseDate(item.deadline, true);

    if (start && now < start) {
      return { key: "upcoming", label: "Belum Dibuka" };
    }

    if (deadline && now > deadline) {
      return { key: "closed", label: "Sudah Tutup" };
    }

    return { key: "open", label: "Dibuka" };
  }

  function normalize(item) {
    if (!item || !item.id || !item.name) return null;

    return {
      id: String(item.id),
      name: String(item.name),
      organization: String(item.organization || "Penyelenggara"),
      level: String(item.level || "Perguruan tinggi"),
      location: String(item.location || "Indonesia"),
      funding: String(item.funding || "Sesuai program"),
      period: String(item.period || ""),
      start: String(item.start || ""),
      deadline: String(item.deadline || ""),
      description: String(item.description || ""),
      requirements: Array.isArray(item.requirements)
        ? item.requirements.map(String)
        : [],
      benefit: String(item.benefit || ""),
      applyUrl: String(item.applyUrl || item.infoUrl || "#"),
      infoUrl: String(item.infoUrl || item.applyUrl || "#"),
      linkType: String(item.linkType || "unknown"),
      source: String(item.source || "FJIS")
    };
  }

  function mergeData(localData, feedData) {
    const map = new Map();

    localData
      .map(normalize)
      .filter(Boolean)
      .forEach(item => map.set(item.id, item));

    feedData
      .map(normalize)
      .filter(Boolean)
      .forEach(item => map.set(item.id, item));

    return Array.from(map.values());
  }

  function sortData(data) {
    const order = {
      open: 0,
      upcoming: 1,
      closed: 2
    };

    return data
      .map(item => ({
        ...item,
        status: getStatus(item)
      }))
      .sort((a, b) => {
        const statusDiff =
          order[a.status.key] - order[b.status.key];

        if (statusDiff !== 0) return statusDiff;

        if (a.status.key === "open") {
          return String(a.deadline || "9999-99-99")
            .localeCompare(String(b.deadline || "9999-99-99"));
        }

        if (a.status.key === "upcoming") {
          return String(a.start || "9999-99-99")
            .localeCompare(String(b.start || "9999-99-99"));
        }

        return String(b.deadline || "")
          .localeCompare(String(a.deadline || ""));
      });
  }

  async function loadFeed() {
    try {
      const response = await fetch(FEED_URL, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      const json = await response.json();

      if (Array.isArray(json)) return json;

      if (Array.isArray(json.scholarships)) {
        return json.scholarships;
      }

      return [];
    } catch (error) {
      console.warn(
        "[FJIS] Feed beasiswa tidak tersedia. Database lokal tetap digunakan.",
        error
      );
      return [];
    }
  }

  async function refresh() {
    const feedData = await loadFeed();
    const merged = mergeData(LOCAL_DATA, feedData);
    const sorted = sortData(merged);

    window.FJIS_SCHOLARSHIPS = sorted;

    window.FJIS_SCHOLARSHIP_STATS = {
      total: sorted.length,
      open: sorted.filter(x => x.status.key === "open").length,
      upcoming: sorted.filter(x => x.status.key === "upcoming").length,
      closed: sorted.filter(x => x.status.key === "closed").length,
      updatedAt: new Date().toISOString()
    };

    document.dispatchEvent(
      new CustomEvent("fjis:scholarships-updated", {
        detail: {
          scholarships: sorted,
          stats: window.FJIS_SCHOLARSHIP_STATS
        }
      })
    );
  }

  window.FJIS_SCHOLARSHIP_ENGINE = {
    refresh,
    getStatus,
    sortData
  };

  refresh();

  /* Cek feed baru setiap 30 menit. */
  setInterval(refresh, 30 * 60 * 1000);

  /* Cek deadline lebih sering agar status cepat berubah. */
  setInterval(() => {
    if (Array.isArray(window.FJIS_SCHOLARSHIPS)) {
      const refreshed = sortData(window.FJIS_SCHOLARSHIPS);
      window.FJIS_SCHOLARSHIPS = refreshed;

      document.dispatchEvent(
        new CustomEvent("fjis:scholarships-updated", {
          detail: {
            scholarships: refreshed,
            stats: window.FJIS_SCHOLARSHIP_STATS
          }
        })
      );
    }
  }, 60 * 1000);
})();
