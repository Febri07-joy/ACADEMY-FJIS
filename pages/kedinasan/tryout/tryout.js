/* FJIS ACADEMY — TRYOUT KEDINASAN
   110 soal | 100 menit | TWK 30 | TIU 35 | TKP 45
   Mendukung Paket 1 & Paket 2 serta struktur TKP score-per-option / score-array.
*/
(() => {
  "use strict";

  function injectTryoutStyle() {
    if (document.getElementById("fjsTryoutStyle")) return;
    const style = document.createElement("style");
    style.id = "fjsTryoutStyle";
    style.textContent = `
      .question-grid{display:grid;grid-template-columns:repeat(10,30px);gap:5px;margin:12px auto;width:max-content;max-width:100%;justify-content:center;}
      .question-number{cursor:pointer;border:1px solid #d8dce3;border-radius:6px;background:#fff;width:30px;height:30px;padding:0;font-size:12px;font-weight:600;line-height:30px;text-align:center;}
      .question-number.current{outline:2px solid #111827;outline-offset:1px;}
      .question-number.answered{background:#dff5e5!important;border-color:#39a85a!important;color:#176b2d!important;}
      .question-number.unanswered{background:#fff!important;border-color:#d8dce3!important;color:#374151!important;}
      .question-number.answered.current{outline-color:#176b2d;}
      .fjs-finish-bar{display:flex;justify-content:flex-end;gap:10px;margin:18px 0;position:relative;z-index:20;}
      #fjsFinishBtn{cursor:pointer;border:0;border-radius:9px;padding:10px 16px;font-weight:700;pointer-events:auto;position:relative;z-index:21;}
      #fjsFinishBtn:disabled{opacity:.6;cursor:not-allowed;}
      #fjsResultScreen{padding:20px;margin-top:20px;border-radius:12px;}
      .fjs-result-card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:20px;}
      .fjs-score-grid{display:grid;grid-template-columns:repeat(4,minmax(90px,1fr));gap:10px;margin:16px 0;}
      .fjs-score-grid>div{border:1px solid #e5e7eb;border-radius:10px;padding:12px;text-align:center;}
      .fjs-score-grid b,.fjs-score-grid strong{display:block;}
      .fjs-score-grid strong{font-size:20px;margin-top:4px;}
      @media(max-width:700px){.fjs-score-grid{grid-template-columns:repeat(2,1fr);}}
      .fjs-hidden{display:none!important;}
      @media(max-width:700px){.question-grid{grid-template-columns:repeat(8,30px);gap:4px;}}
    `;
    document.head.appendChild(style);
  }

  const TOTAL_TIME = 100 * 60;
  const EXPECTED = { TWK: 30, TIU: 35, TKP: 45 };
  const LETTERS = ["A", "B", "C", "D", "E"];

  let questions = [], answers = [], current = 0;
  let remaining = TOTAL_TIME, timer = null, started = false, finished = false;

  const $ = id => document.getElementById(id);
  const find = (...ids) => ids.map($).find(Boolean) || null;

  function activePackage() {
    return String(
      window.FJIS_ACTIVE_PACKAGE ??
      window.FJIS_TRYOUT_PACKAGE ??
      window.ACTIVE_TRYOUT_PACKAGE ??
      window.TRYOUT_PACKAGE ??
      ""
    ).toUpperCase().replace(/\s+/g, "");
  }

  function bank(section) {
    const p = activePackage();
    const names = p.includes("2")
      ? { TWK: ["TWK_PAKET2"], TIU: ["TIU_PAKET2"], TKP: ["TKP_PAKET2"] }
      : p.includes("1")
        ? { TWK: ["TWK_QUESTIONS"], TIU: ["TIU_QUESTIONS"], TKP: ["TKP_QUESTIONS"] }
        : {
            TWK: ["TWK_QUESTIONS", "TWK_PAKET2"],
            TIU: ["TIU_QUESTIONS", "TIU_PAKET2"],
            TKP: ["TKP_QUESTIONS", "TKP_PAKET2"]
          };
    for (const key of names[section]) if (Array.isArray(window[key])) return window[key];
    return null;
  }

  function normalizeOptions(raw) {
    if (Array.isArray(raw)) {
      return raw.map((o, i) => {
        if (typeof o === "string") return { k: LETTERS[i], t: o, score: null };
        if (!o || typeof o !== "object") return null;
        return {
          k: String(o.k ?? o.key ?? o.label ?? LETTERS[i]).toUpperCase(),
          t: String(o.t ?? o.text ?? o.value ?? o.option ?? o.labelText ?? ""),
          score: o.score ?? o.scoring ?? o.nilai ?? o.weight ?? null,
          image: o.image ?? o.imageUrl ?? o.img ?? o.src ?? o.svg ?? o.figure ?? o.visual ?? null
        };
      });
    }
    if (raw && typeof raw === "object") {
      return LETTERS.map(k => {
        const o = raw[k];
        if (typeof o === "string") return { k, t: o, score: null };
        if (o && typeof o === "object") return {
          k,
          t: String(o.t ?? o.text ?? o.value ?? ""),
          score: o.score ?? o.scoring ?? o.nilai ?? o.weight ?? null,
          image: o.image ?? o.imageUrl ?? o.img ?? o.src ?? o.svg ?? o.figure ?? o.visual ?? null
        };
        return { k, t: "", score: null };
      });
    }
    return [];
  }

  function normalizeQuestion(q, section, index) {
    const options = normalizeOptions(q?.options ?? q?.choices ?? q?.answers);
    const optionScores = options.map(o => o?.score == null ? null : Number(o.score));
    const rawScore = q?.score ?? q?.scores ?? q?.scoring ?? q?.nilai ?? q?.weights ?? null;
    return {
      ...q,
      id: q?.id || `${section}-${String(index + 1).padStart(3, "0")}`,
      section,
      question: String(q?.question ?? q?.text ?? ""),
      options,
      correct: String(q?.correct ?? q?.answer ?? "").toUpperCase(),
      explanation: String(q?.explanation ?? q?.pembahasan ?? ""),
      score: Array.isArray(rawScore) ? rawScore.map(Number) : (section === "TKP" ? optionScores : null),
      image: q?.image ?? q?.imageUrl ?? q?.img ?? q?.src ?? q?.svg ?? q?.figure ?? q?.visual ?? null
    };
  }

  function loadBanks() {
    const twk = bank("TWK"), tiu = bank("TIU"), tkp = bank("TKP");
    if (!twk || !tiu || !tkp) throw new Error("Bank soal belum lengkap.");
    if (twk.length !== 30 || tiu.length !== 35 || tkp.length !== 45) {
      throw new Error(`Jumlah bank tidak sesuai. TWK=${twk.length}, TIU=${tiu.length}, TKP=${tkp.length}.`);
    }
    questions = [
      ...twk.map((q,i) => normalizeQuestion(q,"TWK",i)),
      ...tiu.map((q,i) => normalizeQuestion(q,"TIU",i)),
      ...tkp.map((q,i) => normalizeQuestion(q,"TKP",i))
    ];
    answers = Array(questions.length).fill(null);

    const invalid = [];
    questions.forEach(q => {
      if (q.options.length !== 5) invalid.push(`${q.id}: opsi=${q.options.length}`);
      if (q.section === "TKP") {
        if (!Array.isArray(q.score) || q.score.length !== 5 || q.score.some(v => ![1,2,3,4,5].includes(Number(v)))) {
          invalid.push(`${q.id}: score TKP tidak valid`);
        }
      } else if (!LETTERS.includes(q.correct)) {
        invalid.push(`${q.id}: kunci=${q.correct}`);
      }
    });
    if (invalid.length) throw new Error("Format soal tidak valid:\n" + invalid.slice(0,20).join("\n"));
    console.log(`[FJIS] Tryout siap: 30 TWK + 35 TIU + 45 TKP = 110`);
  }

  function esc(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  }
  function visual(v) {
    if (typeof v !== "string" || !v.trim()) return "";
    const x = v.trim();
    if (x.startsWith("<svg")) return `<div class="tryout-visual">${x}</div>`;
    if (/^https?:\/\//i.test(x) || /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(x)) return `<div class="tryout-visual"><img src="${esc(x)}" alt="Visual soal"></div>`;
    return "";
  }

  function setupExistingUI() {
    const root = find("questionArea","questionContainer","questionsContainer","question-area","soalContainer");
    if (!root) return false;

    // Pakai struktur HTML yang sudah ada; jangan mengganti seluruh halaman.
    let grid = $("questionGrid");
    if (!grid) {
      grid = document.createElement("div"); grid.id = "questionGrid"; grid.className = "question-grid";
      root.parentNode?.insertBefore(grid, root);
    }
    return true;
  }

  function renderTabs() {
    const tabs = $("sectionTabs");
    if (!tabs) return;
    tabs.innerHTML = "";
    ["TWK","TIU","TKP"].forEach(section => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = section;
      b.className = "section-tab" + (questions[current]?.section === section ? " active" : "");
      b.onclick = () => {
        const i = questions.findIndex(q => q.section === section);
        if (i >= 0) { current = i; render(); }
      };
      tabs.appendChild(b);
    });
  }

  function renderNavigator() {
    const grid = $("questionGrid") || $("questionNavigator");
    if (!grid) return;
    grid.innerHTML = "";
    questions.forEach((q,i) => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = i + 1;
      b.className = "question-number";
      if (i === current) b.classList.add("current");
      if (answers[i] !== null) b.classList.add("answered");
      else b.classList.add("unanswered");
      b.title = `${q.section} — ${q.id}`;
      b.onclick = () => { current = i; render(); };
      grid.appendChild(b);
    });
  }

  function renderQuestion() {
    const q = questions[current];
    const root = find("questionArea","questionContainer","questionsContainer","question-area","soalContainer");
    if (!q || !root) return;

    root.innerHTML = `
      <div class="question-meta"><span>${q.section}</span><span>Soal ${current + 1} dari ${questions.length}</span></div>
      <h2>${esc(q.question)}</h2>
      ${visual(q.image)}
      <div id="fjsOptions"></div>`;

    const options = $("fjsOptions");
    q.options.forEach(o => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "option" + (answers[current] === o.k ? " selected" : "");
      b.innerHTML = `<strong>${esc(o.k)}.</strong><span>${esc(o.t)}${visual(o.image)}</span>`;
      b.onclick = () => { answers[current] = o.k; render(); };
      options.appendChild(b);
    });

    const prev = find("prevBtn","fjsPrev");
    const next = find("nextBtn","fjsNext");
    if (prev) { prev.disabled = current === 0; prev.onclick = () => { if (current > 0) { current--; render(); } }; }
    if (next) {
      next.textContent = current === questions.length - 1 ? "Selesai" : "Selanjutnya →";
      next.onclick = () => current === questions.length - 1 ? finish(false) : (current++, render());
    }

    let finishBar = $("fjsFinishBar");
    if (!finishBar) {
      finishBar = document.createElement("div");
      finishBar.id = "fjsFinishBar";
      finishBar.className = "fjs-finish-bar";
      root.parentNode?.insertBefore(finishBar, root.nextSibling);
    }
    let finishButton = $("fjsFinishBtn");
    if (!finishButton) {
      finishButton = document.createElement("button");
      finishButton.id = "fjsFinishBtn";
      finishButton.type = "button";
      finishButton.textContent = "Selesai & Lihat Hasil";
      finishBar.appendChild(finishButton);
    }
    finishButton.disabled = finished;
    finishButton.onclick = (ev) => { ev.preventDefault(); ev.stopPropagation(); finish(false); };

    renderNavigator(); renderTabs(); updateProgress();
  }

  function render() { renderQuestion(); }

  function updateProgress() {
    const n = answers.filter(v => v !== null).length;
    const blank = questions.length - n;
    ["answeredCount","jumlahTerjawab"].forEach(id => { if ($(id)) $(id).textContent = n; });
    ["unansweredCount","jumlahBelumDijawab"].forEach(id => { if ($(id)) $(id).textContent = blank; });
    if ($("progressText")) $("progressText").textContent = `${n}/${questions.length}`;
  }

  function updateTimer() {
    const m = Math.floor(Math.max(0,remaining)/60), s = Math.max(0,remaining)%60;
    const text = `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
    ["timer","timerDisplay","countdown"].forEach(id => { if ($(id)) $(id).textContent = text; });
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!started || finished) return;
      remaining--; updateTimer();
      if (remaining <= 0) finish(true);
    },1000);
  }

  function sectionScore(section) {
    let score = 0;
    questions.forEach((q,i) => {
      if (q.section !== section || answers[i] == null) return;
      if (section === "TKP") {
        const idx = q.options.findIndex(o => o.k === answers[i]);
        if (idx >= 0) score += Number(q.score[idx]) || 0;
      } else if (answers[i] === q.correct) score += 5;
    });
    return score;
  }

  function resultData() {
    const twk = sectionScore("TWK"), tiu = sectionScore("TIU"), tkp = sectionScore("TKP");
    return {
      twk, tiu, tkp, total: twk + tiu + tkp,
      correctTWK: questions.filter((q,i) => q.section === "TWK" && answers[i] === q.correct).length,
      correctTIU: questions.filter((q,i) => q.section === "TIU" && answers[i] === q.correct).length,
      answered: answers.filter(v => v !== null).length,
      blank: answers.filter(v => v === null).length
    };
  }

  function finish(auto) {
    if (finished) return;
    finished = true; clearInterval(timer);
    const r = resultData();
    const questionRoot = find("questionArea","questionContainer","questionsContainer","question-area","soalContainer");
    const navRoot = $("questionGrid");
    const tabs = $("sectionTabs");
    const finishBar = $("fjsFinishBar");
    if (questionRoot) questionRoot.classList.add("fjs-hidden");
    if (navRoot) navRoot.classList.add("fjs-hidden");
    if (tabs) tabs.classList.add("fjs-hidden");
    if (finishBar) finishBar.classList.add("fjs-hidden");

    // Selalu buat layar hasil sendiri agar tidak bergantung pada ID HTML tertentu.
    let root = $("fjsResultScreen");
    if (!root) {
      root = document.createElement("section");
      root.id = "fjsResultScreen";
      root.className = "fjs-result-screen";
      const host = questionRoot?.parentNode || document.querySelector("main") || document.body;
      host.appendChild(root);
    }
    root.classList.remove("fjs-hidden");
    root.style.display = "block";
    root.innerHTML = `<div class="fjs-result-card"><h2>Hasil Tryout</h2>
      <p>${auto ? "Waktu habis. Jawaban dikumpulkan otomatis." : "Tryout selesai."}</p>
      <div class="fjs-score-grid">
        <div><b>TWK</b><strong>${r.twk}/150</strong></div>
        <div><b>TIU</b><strong>${r.tiu}/175</strong></div>
        <div><b>TKP</b><strong>${r.tkp}/225</strong></div>
        <div><b>Total</b><strong>${r.total}/550</strong></div>
      </div>
      <p>Terjawab: <b>${r.answered}</b> · Kosong: <b>${r.blank}</b></p>
      <div id="fjsReview"></div></div>`;
    renderReview($("fjsReview"));
    root.scrollIntoView({behavior:"smooth",block:"start"});
    console.log("[FJIS] Tryout selesai:", r);
    document.dispatchEvent(new CustomEvent("fjs:tryoutFinished", {detail:{result:r,questions,answers}}));
  }

  function renderReview(root) {
    if (!root) return;
    root.innerHTML = "<h3>Pembahasan</h3>";
    questions.forEach((q,i) => {
      const selected = answers[i] || "—";
      let status = "";
      let key = "";
      if (q.section === "TKP") {
        const idx = q.options.findIndex(o => o.k === selected);
        const score = idx >= 0 ? q.score[idx] : 0;
        status = `Skor pilihan: ${score}/5`;
      } else {
        key = q.correct;
        status = selected === key ? "Benar" : "Salah/Kosong";
      }
      const d = document.createElement("div"); d.className = "review-question";
      d.innerHTML = `<p><strong>${i+1}. ${esc(q.section)} — ${esc(q.id)}</strong></p>
        <p>${esc(q.question)}</p>
        <p>Jawaban Anda: <b>${esc(selected)}</b>${key ? ` · Kunci: <b>${esc(key)}</b>` : ""} · ${status}</p>
        <p>${esc(q.explanation)}</p>`;
      root.appendChild(d);
    });
  }

  function exposeAPI() {
    window.FJIS_TRYOUT = {
      start() {
        if (started) return;
        started = true; finished = false; current = 0; remaining = TOTAL_TIME;
        updateTimer(); render(); startTimer();
      },
      submit() { finish(false); },
      getState() { return {current,remaining,started,finished,answers:[...answers],total:questions.length}; }
    };
  }

  function init() {
    try {
      injectTryoutStyle();
      loadBanks();
      if (!setupExistingUI()) {
        // Fallback jika HTML belum memiliki questionArea.
        const host = document.querySelector("main") || document.body;
        const root = document.createElement("div"); root.id = "questionArea"; host.appendChild(root);
        setupExistingUI();
      }
      exposeAPI();
      const submit = find("finishBtn","submitBtn","submitButton","btnSubmit");
      if (submit) submit.onclick = () => finish(false);
      const start = find("startBtn","startButton","btnStart");
      if (start) start.onclick = () => window.FJIS_TRYOUT.start();
      window.FJIS_TRYOUT.start();
    } catch (err) {
      console.error("[FJIS] Gagal memuat tryout:", err);
      const box = $("fjsEngineError") || document.createElement("div");
      box.id = "fjsEngineError";
      box.innerHTML = `<strong>Tryout gagal dimuat.</strong><pre>${esc(err.message)}</pre>`;
      if (!box.parentNode) document.body.prepend(box);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
