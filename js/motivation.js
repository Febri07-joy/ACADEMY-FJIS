/* =========================================================
   FJIS ACADEMY — MOTIVATION ROTATOR
   Ganti otomatis setiap 3 detik.
   ID motivasi tidak ditampilkan di website.
   ========================================================= */

(function () {
  "use strict";

  const motivations = [
    {
      id: "ID-01",
      indonesia:
        "Kita tidak bersaing dengan orang lain. Kita sedang bertumbuh menjadi versi diri kita yang lebih baik.",
      english:
        "We are not competing with others. We are growing into a better version of ourselves."
    },

    {
      id: "ID-02",
      indonesia:
        "Hidup bukan perlombaan. Setiap orang punya waktunya masing-masing untuk bertumbuh.",
      english:
        "Life is not a race. Everyone has their own time to grow."
    },

    {
      id: "ID-03",
      indonesia:
        "Nggak ada yang nggak mungkin kalau kamu mau terus mencoba dan belajar.",
      english:
        "Nothing is impossible when you keep trying and learning."
    },

    {
      id: "ID-04",
      indonesia:
        "Pelan bukan berarti tertinggal. Yang penting kamu tetap bergerak.",
      english:
        "Going slowly does not mean falling behind. What matters is that you keep moving."
    },

    {
      id: "ID-05",
      indonesia:
        "Satu halaman yang kamu pahami hari ini bisa menjadi langkah besar untuk masa depanmu.",
      english:
        "One page you understand today can become a big step toward your future."
    },

    {
      id: "ID-06",
      indonesia:
        "Belajar bukan tentang selalu benar. Belajar adalah tentang berani memahami kesalahan.",
      english:
        "Learning is not about always being right. It is about being willing to understand your mistakes."
    },

    {
      id: "ID-07",
      indonesia:
        "Kamu nggak harus tahu semuanya hari ini. Mulai dari satu hal yang ingin kamu pahami.",
      english:
        "You do not have to know everything today. Start with one thing you want to understand."
    },

    {
      id: "ID-08",
      indonesia:
        "Kemajuan kecil tetaplah kemajuan.",
      english:
        "Small progress is still progress."
    },

    {
      id: "ID-09",
      indonesia:
        "Jangan takut memulai dari nol. Semua perjalanan besar juga pernah dimulai dari sana.",
      english:
        "Do not be afraid to start from zero. Every great journey started there too."
    },

    {
      id: "ID-10",
      indonesia:
        "Apa yang kamu pelajari hari ini mungkin akan membantu dirimu di masa yang akan datang.",
      english:
        "What you learn today may help the person you become tomorrow."
    },

    {
      id: "ID-11",
      indonesia:
        "Konsisten sedikit lebih baik daripada semangat besar yang hanya datang sesekali.",
      english:
        "A little consistency is better than great motivation that comes only sometimes."
    },

    {
      id: "ID-12",
      indonesia:
        "Beri dirimu kesempatan untuk berkembang tanpa harus membandingkan prosesmu dengan orang lain.",
      english:
        "Give yourself room to grow without comparing your journey with someone else's."
    },

    {
      id: "ID-13",
      indonesia:
        "Kalau belum paham, bukan berarti kamu tidak mampu. Mungkin kamu hanya perlu cara yang berbeda.",
      english:
        "Not understanding yet does not mean you cannot do it. You may simply need a different approach."
    },

    {
      id: "ID-14",
      indonesia:
        "Hari ini mungkin biasa saja, tetapi satu keputusan untuk belajar bisa membuatnya berarti.",
      english:
        "Today may feel ordinary, but one decision to learn can make it meaningful."
    },

    {
      id: "ID-15",
      indonesia:
        "Terus belajar, terus bertumbuh, dan tetap menjadi dirimu sendiri.",
      english:
        "Keep learning, keep growing, and keep being yourself."
    }
  ];

  let timer = null;
  let currentIndex = -1;

  /* =========================================================
     RANDOM QUOTE
     ========================================================= */

  function getRandomIndex() {
    if (motivations.length <= 1) {
      return 0;
    }

    let next;

    do {
      next = Math.floor(Math.random() * motivations.length);
    } while (next === currentIndex);

    return next;
  }

  /* =========================================================
     RENDER MOTIVATION
     
     PENTING:
     Tidak ada lagi:
     <span class="fjis-motivation-id">
     
     Jadi ID-01, ID-02, dst tidak akan tampil.
     ========================================================= */

  function render(container, item, animate) {
    if (!container || !item) {
      return;
    }

    if (animate) {
      container.classList.remove("is-visible");
      container.classList.add("is-changing");

      setTimeout(function () {

        container.innerHTML = `
          <span class="fjis-motivation-icon">✦</span>

          <span class="fjis-motivation-content">

            <span class="fjis-motivation-indonesia">
              ${item.indonesia}
            </span>

            <span class="fjis-motivation-english">
              ${item.english}
            </span>

          </span>
        `;

        requestAnimationFrame(function () {
          container.classList.remove("is-changing");
          container.classList.add("is-visible");
        });

      }, 180);

    } else {

      container.innerHTML = `
        <span class="fjis-motivation-icon">✦</span>

        <span class="fjis-motivation-content">

          <span class="fjis-motivation-indonesia">
            ${item.indonesia}
          </span>

          <span class="fjis-motivation-english">
            ${item.english}
          </span>

        </span>
      `;

      requestAnimationFrame(function () {
        container.classList.add("is-visible");
      });
    }
  }

  /* =========================================================
     INITIALIZE
     ========================================================= */

  function init(selector) {

    const containers = document.querySelectorAll(
      selector || "[data-fjis-motivation]"
    );

    if (!containers.length) {
      return;
    }

    containers.forEach(function (container) {

      /*
       * Mencegah sistem terpasang dua kali
       */
      if (container.dataset.motivationReady === "true") {
        return;
      }

      container.dataset.motivationReady = "true";

      /*
       * Quote pertama
       */
      currentIndex = getRandomIndex();

      render(
        container,
        motivations[currentIndex],
        false
      );

      /*
       * Ganti setiap 3 detik
       */
      timer = setInterval(function () {

        currentIndex = getRandomIndex();

        render(
          container,
          motivations[currentIndex],
          true
        );

      }, 3000);

    });
  }

  /* =========================================================
     STOP
     ========================================================= */

  function stop() {

    if (timer) {
      clearInterval(timer);
      timer = null;
    }

  }

  /* =========================================================
     PUBLIC API
     ========================================================= */

  window.FJISMotivation = {

    init: init,

    start: init,

    stop: stop,

    quotes: motivations

  };

  /* =========================================================
     AUTO START
     ========================================================= */

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      function () {
        init();
      }
    );

  } else {

    init();

  }

})();