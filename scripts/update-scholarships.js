const fs = require("fs");
const path = require("path");

const BASE_URL = "https://satubeasiswa.kemdiktisaintek.go.id";
const SOURCE_URL = `${BASE_URL}/beasiswa`;

const OUTPUT = path.join(
  __dirname,
  "..",
  "pages",
  "kuliah",
  "sources",
  "scholarship-feed.json"
);

const DEBUG_OUTPUT = path.join(
  __dirname,
  "debug-satubeasiswa.html"
);

function clean(text = "") {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#x27;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x2F;/gi, "/")
    .replace(/\s+/g, " ")
    .trim();
}

function slug(text = "") {
  return clean(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ambilStatus(article) {
  const match = article.match(
    /<span[^>]*>\s*(Dibuka|Belum Dimulai|Selesai)\s*<\/span>/i
  );
  return match ? clean(match[1]) : "";
}

function ambilNama(article) {
  const match = article.match(
    /<h3[^>]*>\s*<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>\s*<\/h3>/i
  );

  if (!match) {
    return { name: "", url: "" };
  }

  return {
    name: clean(match[2]),
    url: new URL(match[1], BASE_URL).href
  };
}

function ambilPenyelenggara(article) {
  const match = article.match(
    /<h3[\s\S]*?<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/i
  );

  return match ? clean(match[1]) : "";
}

function ambilMetadata(article) {
  const hasil = [];

  const dlMatch = article.match(
    /<dl[\s\S]*?<\/dl>/i
  );

  if (!dlMatch) return hasil;

  const spans = dlMatch[0].match(
    /<span[^>]*>([\s\S]*?)<\/span>/gi
  );

  if (!spans) return hasil;

  for (const span of spans) {
    const value = clean(span);
    if (value) hasil.push(value);
  }

  return hasil;
}

function ambilDeadline(article) {
  const match = article.match(
    /Batas Pendaftaran[\s\S]{0,500}?(\d{1,2})\s+(Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s+(\d{4})/i
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

  return `${match[3]}-${
    bulan[match[2].toLowerCase()]
  }-${String(match[1]).padStart(2, "0")}`;
}

function parseArticles(html) {
  const hasil = [];

  const articleRegex =
    /<article\b[\s\S]*?<\/article>/gi;

  const articles =
    html.match(articleRegex) || [];

  console.log(
    `[FJIS] Article ditemukan: ${articles.length}`
  );

  for (const article of articles) {
    const info = ambilNama(article);

    if (!info.name) continue;

    const organization =
      ambilPenyelenggara(article);

    const status =
      ambilStatus(article);

    const metadata =
      ambilMetadata(article);

    const deadline =
      ambilDeadline(article);

    hasil.push({
      id: `satubeasiswa-${slug(info.name)}`,
      name: info.name,
      organization:
        organization || "SatuBeasiswa",
      level: metadata[0] || "",
      location: metadata[1] || "Indonesia",
      funding: metadata[2] || "",
      period: deadline
        ? deadline.slice(0, 4)
        : "",
      start: "",
      deadline,
      status,
      description:
        "Informasi beasiswa dari portal resmi SatuBeasiswa.",
      requirements: [
        "Cek persyaratan terbaru pada halaman resmi beasiswa."
      ],
      benefit:
        metadata[2] ||
        "Sesuai ketentuan penyelenggara.",
      applyUrl: info.url,
      infoUrl: info.url,
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

    const key = slug(item.name);

    if (!map.has(key)) {
      map.set(key, item);
      continue;
    }

    const sebelumnya = map.get(key);

    map.set(key, {
      ...sebelumnya,
      ...item,
      requirements:
        item.requirements?.length
          ? item.requirements
          : sebelumnya.requirements
    });
  }

  return [...map.values()];
}

async function ambilHalaman(url) {
  console.log(`[FJIS] Mengambil: ${url}`);

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/142.0.0.0 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language":
        "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
    }
  });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText}`
    );
  }

  return await response.text();
}

function cariTotalBeasiswa(html) {
  const teks = clean(html);

  const match = teks.match(
    /Menampilkan\s+\d+\s+dari\s+(\d+)\s+beasiswa/i
  );

  return match ? Number(match[1]) : 0;
}

function bacaDatabaseLama() {
  let database = {
    version: 3,
    updatedAt: "",
    scholarships: []
  };

  if (!fs.existsSync(OUTPUT)) {
    return database;
  }

  try {
    database = JSON.parse(
      fs.readFileSync(OUTPUT, "utf8")
    );
  } catch {
    console.warn(
      "[FJIS] Feed lama tidak valid. Membuat database baru."
    );
  }

  if (!Array.isArray(database.scholarships)) {
    database.scholarships = [];
  }

  return database;
}

async function main() {
  console.log("=================================");
  console.log(" FJIS SCHOLARSHIP AUTO COLLECTOR");
  console.log("=================================");

  const database = bacaDatabaseLama();

  try {
    console.log(
      "[FJIS] Memulai pengambilan data..."
    );

    let halamanPertama;

    try {
      halamanPertama =
        await ambilHalaman(SOURCE_URL);
    } catch (error) {
      console.warn(
        `[FJIS] SatuBeasiswa tidak dapat diakses: ${error.message}`
      );
      console.warn(
        "[FJIS] Feed lama dipertahankan. Tidak ada data baru yang ditambahkan."
      );
      console.warn(
        "[FJIS] Workflow selesai tanpa mengubah feed."
      );

      console.log(
        `[FJIS] Database tetap: ${database.scholarships.length} beasiswa`
      );
      console.log(
        "[FJIS] UPDATE DILEWATI ℹ️"
      );

      return;
    }

    fs.writeFileSync(
      DEBUG_OUTPUT,
      halamanPertama,
      "utf8"
    );

    console.log(
      `[FJIS] HTML berhasil diambil: ${halamanPertama.length} karakter`
    );

    const total =
      cariTotalBeasiswa(halamanPertama);

    console.log(
      `[FJIS] Total beasiswa terdeteksi: ${total || "tidak diketahui"}`
    );

    let semua = [];

    const pertama =
      parseArticles(halamanPertama);

    semua.push(...pertama);

    console.log(
      `[FJIS] Halaman pertama: ${pertama.length} beasiswa`
    );

    const PER_PAGE = 9;

    const jumlahHalaman =
      total > 0
        ? Math.ceil(total / PER_PAGE)
        : 1;

    console.log(
      `[FJIS] Perkiraan jumlah halaman: ${jumlahHalaman}`
    );

    for (
      let page = 2;
      page <= jumlahHalaman;
      page++
    ) {
      try {
        const url =
          `${SOURCE_URL}?page=${page}`;

        const html =
          await ambilHalaman(url);

        const data =
          parseArticles(html);

        console.log(
          `[FJIS] Halaman ${page}: ${data.length} beasiswa`
        );

        semua.push(...data);
      } catch (error) {
        console.warn(
          `[FJIS] Halaman ${page} gagal: ${error.message}`
        );
      }
    }

    console.log(
      `[FJIS] Total hasil mentah: ${semua.length}`
    );

    if (semua.length === 0) {
      console.warn(
        "[FJIS] Tidak ada data baru yang berhasil diparse."
      );
      console.warn(
        "[FJIS] Feed lama dipertahankan."
      );

      console.log(
        `[FJIS] Database tetap: ${database.scholarships.length} beasiswa`
      );
      return;
    }

    const gabungan =
      gabungkanData(
        database.scholarships || [],
        semua
      );

    database.version = 3;
    database.updatedAt =
      new Date().toISOString();

    database.scholarships =
      gabungan;

    fs.writeFileSync(
      OUTPUT,
      JSON.stringify(
        database,
        null,
        2
      ),
      "utf8"
    );

    console.log(
      `[FJIS] Database sekarang: ${gabungan.length} beasiswa`
    );

    console.log(
      "[FJIS] UPDATE BERHASIL ✅"
    );
  } catch (error) {
    console.error(
      "[FJIS] ERROR:",
      error.message
    );

    process.exitCode = 1;
  }
}

main();











































