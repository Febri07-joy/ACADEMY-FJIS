const fs = require("fs");
const path = require("path");

const SOURCE_URL =
  "https://satubeasiswa.kemdiktisaintek.go.id/beasiswa";

const OUTPUT = path.join(
  __dirname,
  "..",
  "pages",
  "kuliah",
  "sources",
  "scholarship-feed.json"
);

function clean(text = "") {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function slug(text = "") {
  return clean(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ambilNama(block) {
  const match = block.match(
    /<(h1|h2|h3|h4|strong)[^>]*>([\s\S]*?)<\/\1>/i
  );

  return match ? clean(match[2]) : "";
}

function ambilTanggal(text) {
  const match = text.match(
    /(\d{1,2})\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+(\d{4})/i
  );

  if (!match) return "";

  const bulan = {
    januari: "01",
    februari: "02",
    maret: "03",
    april: "04",
    mei: "05",
    juni: "06",
    juli: "07",
    agustus: "08",
    september: "09",
    oktober: "10",
    november: "11",
    desember: "12"
  };

  return `${match[3]}-${bulan[match[2].toLowerCase()]}-${String(
    match[1]
  ).padStart(2, "0")}`;
}

function parseBeasiswa(html) {
  const hasil = [];

  const regex =
    /<a[^>]+href=["']([^"']*\/beasiswa\/[^"']+)["'][^>]*>([\s\S]{0,12000}?)<\/a>/gi;

  let match;

  while ((match = regex.exec(html)) !== null) {
    const url = new URL(
      match[1],
      SOURCE_URL
    ).href;

    const block = match[2];
    const nama = ambilNama(block);
    const teks = clean(block);

    if (!nama || nama.length < 4) continue;

    const deadline = ambilTanggal(teks);

    hasil.push({
      id: `satubeasiswa-${slug(nama)}`,
      name: nama,
      organization: "SatuBeasiswa",
      level: "",
      location: "Indonesia",
      funding: "",
      period: deadline ? deadline.slice(0, 4) : "",
      start: "",
      deadline: deadline,
      description:
        "Data beasiswa dari portal SatuBeasiswa.",
      requirements: [
        "Cek persyaratan terbaru pada sumber resmi."
      ],
      benefit:
        "Sesuai ketentuan penyelenggara.",
      applyUrl: url,
      infoUrl: url,
      linkType: "official",
      source: "SatuBeasiswa"
    });
  }

  return hasil;
}

function gabungkanData(lama, baru) {
  const map = new Map();

  for (const item of [...lama, ...baru]) {
    if (!item || !item.name) continue;

    const key =
      `${slug(item.name)}|${slug(item.organization || "")}`;

    if (!map.has(key)) {
      map.set(key, item);
    } else {
      const sebelumnya = map.get(key);

      map.set(key, {
        ...sebelumnya,
        ...item
      });
    }
  }

  return [...map.values()];
}

async function main() {
  console.log("=================================");
  console.log(" FJIS SCHOLARSHIP AUTO COLLECTOR");
  console.log("=================================");

  try {
    console.log("[FJIS] Mengambil data...");

    const response = await fetch(SOURCE_URL, {
      headers: {
        "User-Agent":
          "FJIS-Academy-Scholarship-Collector/1.0"
      }
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();

    console.log(
      `[FJIS] Halaman berhasil diambil: ${html.length} karakter`
    );

    const baru = parseBeasiswa(html);

    console.log(
      `[FJIS] Beasiswa ditemukan: ${baru.length}`
    );

    let database = {
      version: 2,
      updatedAt: "",
      scholarships: []
    };

    if (fs.existsSync(OUTPUT)) {
      database = JSON.parse(
        fs.readFileSync(OUTPUT, "utf8")
      );
    }

    const gabungan = gabungkanData(
      database.scholarships || [],
      baru
    );

    database.version = 2;
    database.updatedAt =
      new Date().toISOString().slice(0, 10);
    database.scholarships = gabungan;

    fs.writeFileSync(
      OUTPUT,
      JSON.stringify(database, null, 2),
      "utf8"
    );

    console.log(
      `[FJIS] Database sekarang: ${gabungan.length} beasiswa`
    );

    console.log("[FJIS] UPDATE BERHASIL ✅");

  } catch (error) {
    console.error(
      "[FJIS] ERROR:",
      error.message
    );

    process.exitCode = 1;
  }
}

main();