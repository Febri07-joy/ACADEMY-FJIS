/* ============================================================
   FJIS ACADEMY — SCHOLARSHIP ENGINE v3
   Hosting-ready

   Fungsi:
   - Database lokal tetap dipakai sebagai fallback
   - Feed otomatis dibaca dari:
     ./sources/scholarship-feed.json
   - Menggabungkan database lokal + feed
   - Mencegah duplikat berdasarkan nama beasiswa
   - Feed terbaru menggantikan data lama dengan nama yang sama
   - Status otomatis:
       OPEN      = Dibuka
       UPCOMING  = Belum Dibuka
       CLOSED    = Sudah Tutup
   - Data lama tetap dipertahankan
   - Data aktif diurutkan di atas
   - Data tutup diurutkan di bawah
   - Feed diperbarui setiap 30 menit
   - Status tanggal diperbarui setiap 60 detik
   - Mengirim event ke kuliah.js
============================================================ */

(function () {
  "use strict";

  const LOCAL_DATA =
    Array.isArray(window.SCHOLARSHIPS_KULIAH)
      ? window.SCHOLARSHIPS_KULIAH
      : [];

  /*
    PENTING:
    fetch() menghitung path relatif terhadap halaman HTML,
    bukan terhadap lokasi file JavaScript.

    kuliah.html berada di:
      pages/kuliah/kuliah.html

    feed berada di:
      pages/kuliah/sources/scholarship-feed.json

    Maka path yang benar:
      ./sources/scholarship-feed.json
  */
  const FEED_URL = "./sources/scholarship-feed.json";

  function parseDate(value, endOfDay = false) {
    if (!value) {
      return null;
    }

    const match =
      String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) {
      return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);

    return endOfDay
      ? new Date(year, month, day, 23, 59, 59, 999)
      : new Date(year, month, day, 0, 0, 0, 0);
  }

  function getStatus(item) {
    const now = new Date();

    const start = parseDate(item.start);
    const deadline = parseDate(item.deadline, true);

    if (start && now < start) {
      return {
        key: "upcoming",
        label: "Belum Dibuka"
      };
    }

    if (deadline && now > deadline) {
      return {
        key: "closed",
        label: "Sudah Tutup"
      };
    }

    return {
      key: "open",
      label: "Dibuka"
    };
  }

  function makeId(name) {
    return (
      "fjis-" +
      String(name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  }

  function normalize(item) {
    if (!item || !item.name) {
      return null;
    }

    const name = String(item.name).trim();

    return {
      id: String(item.id || makeId(name)),

      name,

      organization: String(
        item.organization || "Penyelenggara"
      ),

      level: String(
        item.level || "Perguruan tinggi"
      ),

      location: String(
        item.location || "Indonesia"
      ),

      funding: String(
        item.funding || "Sesuai program"
      ),

      period: String(
        item.period || ""
      ),

      start: String(
        item.start || ""
      ),

      deadline: String(
        item.deadline || ""
      ),

      description: String(
        item.description || ""
      ),

      requirements: Array.isArray(item.requirements)
        ? item.requirements.map(value => String(value))
        : [],

      benefit: String(
        item.benefit || ""
      ),

      applyUrl: String(
        item.applyUrl ||
        item.infoUrl ||
        "#"
      ),

      infoUrl: String(
        item.infoUrl ||
        item.applyUrl ||
        "#"
      ),

      linkType: String(
        item.linkType || "unknown"
      ),

      source: String(
        item.source || "FJIS"
      )
    };
  }

  function nameKey(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function mergeData(localData, feedData) {
    const map = new Map();

    localData
      .map(normalize)
      .filter(Boolean)
      .forEach(item => {
        const key = nameKey(item.name);

        if (!key) {
          return;
        }

        map.set(key, item);
      });

    feedData
      .map(normalize)
      .filter(Boolean)
      .forEach(item => {
        const key = nameKey(item.name);

        if (!key) {
          return;
        }

        const previous = map.get(key);

        if (!previous) {
          map.set(key, item);
          return;
        }

        map.set(key, {
          ...previous,
          ...item,

          requirements:
            item.requirements.length
              ? item.requirements
              : previous.requirements,

          applyUrl:
            item.applyUrl !== "#"
              ? item.applyUrl
              : previous.applyUrl,

          infoUrl:
            item.infoUrl !== "#"
              ? item.infoUrl
              : previous.infoUrl
        });
      });

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
          order[a.status.key] -
          order[b.status.key];

        if (statusDiff !== 0) {
          return statusDiff;
        }

        if (a.status.key === "open") {
          return String(a.deadline || "9999-99-99")
            .localeCompare(
              String(b.deadline || "9999-99-99")
            );
        }

        if (a.status.key === "upcoming") {
          return String(a.start || "9999-99-99")
            .localeCompare(
              String(b.start || "9999-99-99")
            );
        }

        return String(b.deadline || "")
          .localeCompare(
            String(a.deadline || "")
          );
      });
  }

  async function loadFeed() {
    try {
      const response = await fetch(
        FEED_URL,
        {
          cache: "no-store"
        }
      );

      if (!response.ok) {
        throw new Error(
          "HTTP " + response.status
        );
      }

      const json = await response.json();

      if (Array.isArray(json)) {
        return json;
      }

      if (
        json &&
        Array.isArray(json.scholarships)
      ) {
        return json.scholarships;
      }

      console.warn(
        "[FJIS] Format scholarship-feed.json tidak dikenali."
      );

      return [];
    } catch (error) {
      console.warn(
        "[FJIS] Feed beasiswa tidak tersedia. Database lokal tetap digunakan.",
        error
      );

      return [];
    }
  }

  function buildStats(sorted) {
    return {
      total: sorted.length,

      open: sorted.filter(
        item => item.status.key === "open"
      ).length,

      upcoming: sorted.filter(
        item => item.status.key === "upcoming"
      ).length,

      closed: sorted.filter(
        item => item.status.key === "closed"
      ).length,

      updatedAt: new Date().toISOString()
    };
  }

  function publish(sorted) {
    const stats = buildStats(sorted);

    window.FJIS_SCHOLARSHIPS = sorted;
    window.FJIS_SCHOLARSHIP_STATS = stats;

    document.dispatchEvent(
      new CustomEvent(
        "fjis:scholarships-updated",
        {
          detail: {
            scholarships: sorted,
            stats
          }
        }
      )
    );

    console.log(
      `[FJIS] Scholarship Engine: ` +
      `${stats.total} data | ` +
      `Dibuka: ${stats.open} | ` +
      `Belum dibuka: ${stats.upcoming} | ` +
      `Sudah tutup: ${stats.closed}`
    );
  }

  async function refresh() {
    const feedData = await loadFeed();

    const merged = mergeData(
      LOCAL_DATA,
      feedData
    );

    const sorted = sortData(
      merged
    );

    publish(sorted);
  }

  window.FJIS_SCHOLARSHIP_ENGINE = {
    refresh,
    getStatus,
    sortData,
    loadFeed
  };

  refresh();

  /* Feed baru setiap 30 menit. */
  setInterval(
    refresh,
    30 * 60 * 1000
  );

  /* Status tanggal diperiksa setiap 60 detik. */
  setInterval(
    () => {
      if (
        !Array.isArray(
          window.FJIS_SCHOLARSHIPS
        )
      ) {
        return;
      }

      const refreshed = sortData(
        window.FJIS_SCHOLARSHIPS
      );

      publish(refreshed);
    },
    60 * 1000
  );
})();