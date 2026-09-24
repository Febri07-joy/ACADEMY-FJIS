/* ============================================================
   FJIS ACADEMY — TIU PAKET 2
   35 soal | SKD Kedinasan-style | original question bank
   1–27 : verbal, numerik, logika, analitis
   28–35: figural/visual
   ============================================================ */

function svgBox(content, w = 180, h = 110) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect x="1" y="1" width="${w-2}" height="${h-2}" rx="8" fill="white" stroke="#222"/>
    ${content}
  </svg>`;
}
function circle(x,y,r,fill="none",stroke="#111",sw=3){
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}
function rect(x,y,w,h,fill="none",stroke="#111",sw=3,rot=0){
  const cx=x+w/2, cy=y+h/2;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" transform="rotate(${rot} ${cx} ${cy})"/>`;
}
function line(x1,y1,x2,y2,stroke="#111",sw=3){
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>`;
}
function poly(points,fill="none",stroke="#111",sw=3){
  return `<polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
}
function textSvg(x,y,t,size=18){
  return `<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" text-anchor="middle" dominant-baseline="middle">${t}</text>`;
}

function q(id, question, options, correct, explanation, extra={}) {
  return {id, question, options, correct, explanation, ...extra};
}

/* Visual helpers */
const F = {
  seq1: [
    svgBox(circle(45,55,16)+line(45,25,45,85)),
    svgBox(circle(45,55,16)+line(25,55,65,55)),
    svgBox(circle(45,55,16)+line(45,25,45,85)+line(25,55,65,55)),
    svgBox(circle(45,55,16)+line(45,25,45,85)+line(25,55,65,55)+line(34,44,56,66)),
  ],
  seq2: [
    svgBox(poly("45,18 70,55 45,92 20,55")),
    svgBox(poly("45,18 70,55 45,92 20,55")+line(20,55,70,55)),
    svgBox(poly("45,18 70,55 45,92 20,55")+line(20,55,70,55)+line(45,18,45,92)),
    svgBox(poly("45,18 70,55 45,92 20,55")+line(20,55,70,55)+line(45,18,45,92)+circle(45,55,7)),
  ],
  seq3: [
    svgBox(rect(25,35,40,40,"none","#111",3,0)),
    svgBox(rect(25,35,40,40,"none","#111",3,45)),
    svgBox(rect(25,35,40,40,"none","#111",3,90)),
    svgBox(rect(25,35,40,40,"none","#111",3,135)),
  ]
};

const A = (k,t) => ({k,t});
const AV = (k,image) => ({k,t:"",image});

/* ------------------------------------------------------------
   1–27 ANALYTICAL / VERBAL / NUMERICAL / LOGICAL
   ------------------------------------------------------------ */

window.TIU_PAKET2 = [
q("TIU2-001",
`Sebuah tim verifikasi terdiri atas 6 orang: Raka, Sinta, Tono, Vina, Wawan, dan Yuni. Setiap orang harus memeriksa tepat satu dari enam berkas A–F. Raka tidak boleh memeriksa A atau F, Sinta harus memeriksa berkas yang alfabetnya lebih awal daripada berkas Tono, dan Vina harus memeriksa tepat dua posisi setelah Wawan. Jika Yuni memeriksa C, susunan manakah yang masih mungkin?`,
[
 A("A","Raka–B, Sinta–A, Tono–D, Vina–E, Wawan–C, Yuni–F"),
 A("B","Raka–C, Sinta–A, Tono–B, Vina–E, Wawan–C, Yuni–F"),
 A("C","Raka–D, Sinta–B, Tono–A, Vina–F, Wawan–D, Yuni–C"),
 A("D","Raka–E, Sinta–B, Tono–D, Vina–C, Wawan–A, Yuni–F"),
 A("E","Raka–C, Sinta–D, Tono–E, Vina–F, Wawan–D, Yuni–C")
], "A",
`Pilihan A memenuhi seluruh syarat: Raka bukan A/F; Sinta (A) berada sebelum Tono (D); Vina (E) tepat dua posisi setelah Wawan (C); dan tidak ada penugasan ganda.`),

q("TIU2-002",
`Sebuah kegiatan berlangsung selama lima hari kerja, Senin sampai Jumat. Empat materi P, Q, R, dan S masing-masing diberikan tepat satu kali. P harus sebelum R, Q tidak boleh pada Senin, dan S harus tepat sehari setelah Q. Jika R diberikan pada Jumat, pasangan hari untuk Q dan S yang mungkin adalah ...`,
[
 A("A","Senin dan Selasa"),
 A("B","Selasa dan Rabu"),
 A("C","Rabu dan Kamis"),
 A("D","Kamis dan Jumat"),
 A("E","Senin dan Jumat")
], "C",
`Karena R sudah Jumat, Q dan S harus berurutan dan Q bukan Senin. Pilihan Rabu–Kamis memenuhi aturan dan masih menyisakan Senin–Selasa untuk P serta satu slot kosong.`),

q("TIU2-003",
`Dalam sebuah seleksi, peserta mendapat nilai awal 72. Nilai akhir dihitung dari nilai awal yang diberi bobot 40%, tes kemampuan 35%, dan wawancara 25%. Peserta memperoleh nilai tes kemampuan 80 dan wawancara 88. Berapakah nilai akhirnya?`,
[
 A("A","77,2"),
 A("B","78,0"),
 A("C","78,8"),
 A("D","79,6"),
 A("E","80,4")
], "C",
`Nilai akhir = 0,40(72) + 0,35(80) + 0,25(88) = 28,8 + 28 + 22 = 78,8.`),

q("TIU2-004",
`Sebuah gudang menerima 480 unit barang. Sebanyak 15% langsung dikirim ke cabang A. Dari sisa barang, 25% dikirim ke cabang B. Setelah itu 30 unit rusak dan tidak dapat digunakan. Barang yang masih tersedia untuk cabang C adalah ...`,
[
 A("A","270"),
 A("B","276"),
 A("C","278"),
 A("D","282"),
 A("E","288")
], "B",
`Setelah A: 480 − 72 = 408. Cabang B menerima 25% × 408 = 102, sehingga tersisa 306. Dikurangi 30 unit rusak menjadi 276. Jadi pilihan B benar.`),

q("TIU2-005",
`Perbandingan jumlah peserta laki-laki dan perempuan dalam suatu pelatihan adalah 5 : 7. Setelah 18 peserta laki-laki dan 6 peserta perempuan bergabung, perbandingannya menjadi 3 : 4. Berapa jumlah peserta semula?`,
[
 A("A","120"),
 A("B","432"),
 A("C","540"),
 A("D","648"),
 A("E","756")
], "D",
`Misalkan laki-laki 5x dan perempuan 7x. (5x+18)/(7x+6)=3/4. Maka 20x+72=21x+18 sehingga x=54. Jumlah semula = 12x = 648.`),

q("TIU2-006",
`Sebuah kendaraan menempuh 180 km. Pada 60 km pertama kecepatannya 40 km/jam, sedangkan 120 km berikutnya ditempuh dengan kecepatan 60 km/jam. Jika tidak ada waktu berhenti, berapa kecepatan rata-rata kendaraan tersebut?`,
[
 A("A","48 km/jam"),
 A("B","50 km/jam"),
 A("C","51,43 km/jam"),
 A("D","52 km/jam"),
 A("E","54 km/jam")
], "C",
`Waktu 60 km pertama = 1,5 jam. Waktu 120 km berikutnya = 2 jam. Total waktu 3,5 jam, sehingga kecepatan rata-rata = 180/3,5 = 51,43 km/jam.`),

q("TIU2-007",
`Enam orang duduk berjajar. P berada di kiri Q tetapi di kanan R. S tidak boleh berdampingan dengan Q. T harus berada tepat di sebelah kanan P, sedangkan U berada di salah satu ujung. Jika R menempati posisi pertama, susunan yang mungkin adalah ...`,
[
 A("A","R–P–T–Q–S–U"),
 A("B","R–S–P–T–Q–U"),
 A("C","R–P–Q–T–S–U"),
 A("D","R–U–P–T–Q–S"),
 A("E","R–P–T–S–Q–U")
], "A",
`A memenuhi R<P<T<Q, T tepat di kanan P, S tidak berdampingan dengan Q, dan U berada di ujung. Pilihan lain melanggar minimal satu syarat.`),

q("TIU2-008",
`Semua analis adalah pembaca teliti. Sebagian pembaca teliti adalah penulis. Tidak ada penulis yang bekerja ceroboh. Kesimpulan manakah yang pasti benar?`,
[
 A("A","Semua pembaca teliti adalah analis."),
 A("B","Sebagian analis pasti penulis."),
 A("C","Sebagian penulis adalah pembaca teliti."),
 A("D","Semua penulis adalah analis."),
 A("E","Semua pembaca teliti adalah penulis.")
], "C",
`Premis menyatakan bahwa sebagian pembaca teliti adalah penulis. Pernyataan tersebut dapat dibalik secara deskriptif menjadi bahwa sebagian penulis merupakan pembaca teliti. Pilihan C adalah kesimpulan yang langsung didukung premis.`),

q("TIU2-009",
`Deret berikut mengikuti pola yang konsisten: 3, 8, 18, 38, 78, ... Setiap suku diperoleh dari suku sebelumnya melalui operasi yang sama. Suku berikutnya adalah ...`,
[
 A("A","148"),
 A("B","156"),
 A("C","158"),
 A("D","160"),
 A("E","162")
], "C",
`Polanya ×2 + 2: 3→8, 8→18, 18→38, 38→78. Maka 78×2+2 = 158.`),

q("TIU2-010",
`Sebuah pekerjaan dapat diselesaikan oleh A dalam 12 hari dan oleh B dalam 18 hari. Mereka bekerja bersama selama 4 hari, kemudian B berhenti dan A melanjutkan pekerjaan sampai selesai. Berapa lama total waktu yang diperlukan?`,
[
 A("A","8 hari"),
 A("B","9⅓ hari"),
 A("C","10 hari"),
 A("D","11 hari"),
 A("E","12 hari")
], "B",
`Laju bersama = 1/12+1/18=5/36 pekerjaan/hari. Dalam 4 hari selesai 20/36=5/9. Sisa 4/9. A membutuhkan (4/9)÷(1/12)=16/3 hari = 5⅓ hari. Total = 9⅓ hari.`),

q("TIU2-011",
`Dalam sebuah kelompok, 40% anggota mengikuti pelatihan A, 55% mengikuti pelatihan B, dan 20% mengikuti keduanya. Jika terdapat 120 anggota, berapa banyak anggota yang mengikuti setidaknya salah satu pelatihan?`,
[
 A("A","78"),
 A("B","84"),
 A("C","90"),
 A("D","96"),
 A("E","102")
], "C",
`Gunakan prinsip inklusi-eksklusi: 40%+55%−20%=75%. Jadi 75% × 120 = 90.`),

q("TIU2-012",
`Lima nilai memiliki rata-rata 76. Setelah satu nilai terendah dikeluarkan, rata-rata empat nilai yang tersisa menjadi 82. Jika nilai terendah tersebut 54, berapa jumlah seluruh nilai semula?`,
[
 A("A","356"),
 A("B","370"),
 A("C","378"),
 A("D","382"),
 A("E","394")
], "D",
`Jumlah lima nilai = 5×76 = 380. Empat nilai tersisa = 4×82 = 328. Dengan nilai terendah 54, jumlah semula adalah 328+54 = 382.`),

q("TIU2-013",
`Sebuah bilangan dua digit memiliki jumlah digit 11. Jika digitnya ditukar, bilangan baru 27 lebih besar daripada bilangan semula. Bilangan tersebut adalah ...`,
[
 A("A","38"),
 A("B","47"),
 A("C","56"),
 A("D","65"),
 A("E","74")
], "B",
`Misalkan bilangan 10a+b. Selisih setelah ditukar = 9(b−a)=27 sehingga b−a=3. Bersama a+b=11 diperoleh a=4 dan b=7. Bilangan = 47.`),

q("TIU2-014",
`Tiga kotak berlabel X, Y, dan Z masing-masing berisi bola merah atau biru. Setiap kotak berisi tepat dua bola. Diketahui jumlah seluruh bola merah adalah 3. Kotak X tidak memiliki dua bola dengan warna sama. Jika kotak Y memiliki dua bola merah, maka isi kotak Z adalah ...`,
[
 A("A","Dua merah"),
 A("B","Satu merah dan satu biru"),
 A("C","Dua biru"),
 A("D","Tidak dapat ditentukan"),
 A("E","Tiga merah")
], "C",
`X berisi satu merah dan satu biru. Y berisi dua merah. Agar total merah 3, Z harus tidak memiliki merah, sehingga Z berisi dua biru.`),

q("TIU2-015",
`Sebuah pola bilangan dibentuk dari dua operasi yang bergantian: suku pertama dikali 2 lalu dikurangi 3, kemudian dikali 2 lalu dikurangi 3, dan seterusnya. Jika suku pertama 7, suku keempat adalah ...`,
[
 A("A","29"),
 A("B","31"),
 A("C","33"),
 A("D","35"),
 A("E","37")
], "D",
`7×2−3=11; 11×2−3=19; 19×2−3=35. Jadi suku keempat adalah 35.`),

q("TIU2-016",
`Sebuah panitia memilih 3 orang dari 8 calon untuk posisi ketua, sekretaris, dan bendahara. Satu orang hanya dapat memegang satu posisi. Berapa banyak susunan berbeda yang mungkin?`,
[
 A("A","56"),
 A("B","112"),
 A("C","168"),
 A("D","336"),
 A("E","512")
], "D",
`Karena posisi berbeda, gunakan permutasi: 8P3 = 8×7×6 = 336.`),

q("TIU2-017",
`Dalam sebuah ujian, jawaban benar bernilai 4, salah −1, dan kosong 0. Seorang peserta menjawab 40 soal dari 50 soal dan memperoleh skor 125. Jika semua soal yang tidak dijawab bernilai 0, berapa banyak jawaban benarnya?`,
[
 A("A","30"),
 A("B","31"),
 A("C","32"),
 A("D","33"),
 A("E","34")
], "D",
`Jika benar x dan salah 40−x, skor = 4x−(40−x)=5x−40. Jadi 5x−40=125 → x=33.`),

q("TIU2-018",
`Enam kandidat memperoleh peringkat berbeda. Gita berada di atas Hani tetapi di bawah Joko. Kiki berada di bawah Hani tetapi di atas Lala. Miko berada di atas Joko. Siapa yang pasti berada di atas Hani?`,
[
 A("A","Gita saja"),
 A("B","Joko saja"),
 A("C","Miko saja"),
 A("D","Joko dan Miko"),
 A("E","Gita, Joko, dan Miko")
], "D",
`Joko > Gita > Hani dan Miko > Joko. Jadi Joko dan Miko pasti berada di atas Hani.`),

q("TIU2-019",
`Sebuah toko memberi diskon 20% lalu tambahan diskon 10% dari harga setelah diskon pertama. Harga awal sebuah barang Rp500.000. Harga yang harus dibayar adalah ...`,
[
 A("A","Rp350.000"),
 A("B","Rp360.000"),
 A("C","Rp370.000"),
 A("D","Rp380.000"),
 A("E","Rp400.000")
], "B",
`Setelah diskon pertama: 500.000×80%=400.000. Diskon kedua 10% dari 400.000 = 40.000. Harga akhir = 360.000.`),

q("TIU2-020",
`Sebuah kelas memiliki 32 siswa. Sebanyak 18 siswa menyukai matematika, 15 menyukai fisika, dan 7 menyukai keduanya. Jika setiap siswa menyukai setidaknya salah satu dari dua mata pelajaran tersebut, berapa siswa yang hanya menyukai matematika?`,
[
 A("A","9"),
 A("B","10"),
 A("C","11"),
 A("D","12"),
 A("E","13")
], "C",
`Yang hanya menyukai matematika = 18−7 = 11, sehingga pilihan C benar.`),

q("TIU2-021",
`Sebuah mesin menghasilkan 240 unit dalam 6 jam. Setelah perawatan, produktivitasnya meningkat 25%. Jika mesin bekerja selama 5 jam setelah perawatan, berapa unit yang dihasilkan?`,
[
 A("A","200"),
 A("B","240"),
 A("C","250"),
 A("D","260"),
 A("E","280")
], "C",
`Produktivitas awal = 240/6 = 40 unit/jam. Naik 25% menjadi 50 unit/jam. Dalam 5 jam menghasilkan 250 unit.`),

q("TIU2-022",
`Empat orang A, B, C, dan D masing-masing menyelesaikan satu tahap pekerjaan. A harus sebelum C, B harus setelah D, dan C harus sebelum B. Urutan yang mungkin adalah ...`,
[
 A("A","A–B–C–D"),
 A("B","D–A–C–B"),
 A("C","A–C–D–B"),
 A("D","C–A–D–B"),
 A("E","D–B–A–C")
], "B",
`B harus setelah D, C harus setelah A, dan B juga harus setelah C. D–A–C–B memenuhi semua hubungan.`),

q("TIU2-023",
`Suatu bilangan jika dibagi 5 bersisa 2, dan jika dibagi 7 bersisa 4. Bilangan terkecil positif yang memenuhi kedua kondisi tersebut adalah ...`,
[
 A("A","12"),
 A("B","18"),
 A("C","22"),
 A("D","27"),
 A("E","32")
], "E",
`Bilangan dapat ditulis 5k+2. Dari syarat modulo 7 diperoleh 5k+2 ≡ 4, sehingga 5k ≡ 2 (mod 7) dan k ≡ 6 (mod 7). Nilai terkecilnya menghasilkan 32, yaitu pilihan E.`),

q("TIU2-024",
`Sebuah investasi meningkat 10% pada tahun pertama dan menurun 10% pada tahun kedua. Jika nilai awal Rp2.000.000 dan tidak ada perubahan lain, nilai akhirnya adalah ...`,
[
 A("A","Rp1.960.000"),
 A("B","Rp1.980.000"),
 A("C","Rp2.000.000"),
 A("D","Rp2.020.000"),
 A("E","Rp2.040.000")
], "B",
`2.000.000×1,10×0,90 = 1.980.000, sehingga pilihan B benar.`),

q("TIU2-025",
`Dalam sebuah lomba, setiap peserta mendapat nomor unik. Roni berada tepat di tengah antara Sari dan Tika, sedangkan Uli berada dua posisi setelah Tika. Jika Sari berada pada posisi ke-4 dan Roni pada posisi ke-7, posisi Uli adalah ...`,
[
 A("A","8"),
 A("B","9"),
 A("C","10"),
 A("D","11"),
 A("E","12")
], "E",
`Roni di posisi 7 tepat di tengah Sari posisi 4 dan Tika, sehingga Tika berada di posisi 10. Uli dua posisi setelah Tika, yaitu posisi 12. Pilihan E benar.`),

q("TIU2-026",
`Dari 10 calon dipilih 4 orang untuk mengikuti pelatihan. Namun A dan B tidak boleh terpilih bersamaan. Berapa banyak kelompok berbeda yang dapat dibentuk?`,
[
 A("A","196"),
 A("B","182"),
 A("C","175"),
 A("D","168"),
 A("E","154")
], "B",
`Total C(10,4)=210. Kelompok yang memuat A dan B: pilih 2 dari 8 lainnya = 28. Jadi 210−28=182.`),

q("TIU2-027",
`Sebuah kode terdiri dari tiga huruf berbeda diikuti dua angka berbeda. Huruf dipilih dari A, B, C, D, E dan angka dari 1, 2, 3, 4. Kode tidak boleh diawali A dan angka terakhir harus genap. Berapa banyak kode yang mungkin?`,
[
 A("A","320"),
 A("B","352"),
 A("C","384"),
 A("D","416"),
 A("E","448")
], "C",
`Posisi huruf: huruf pertama 4 pilihan (B–E), lalu 4 dan 3 = 48. Angka: angka pertama 4 pilihan, angka terakhir 2 pilihan (2 atau 4) = 8. Total 48×8=384.`),

/* ------------------------------------------------------------
   28–35 FIGURAL
   Each item uses a deterministic transformation. Candidate
   options are visual SVGs so the engine can render them.
   ------------------------------------------------------------ */

q("TIU2-028",
`Perhatikan urutan gambar berikut. Pada setiap langkah, satu garis baru ditambahkan melalui pusat lingkaran. Arah garis baru berputar 45° searah jarum jam dari garis yang baru ditambahkan pada langkah sebelumnya. Gambar manakah yang melanjutkan pola?`,
[
 AV("A",svgBox(circle(90,55,22)+line(90,25,90,85)+line(69,34,111,76))),
 AV("B",svgBox(circle(90,55,22)+line(90,25,90,85)+line(69,76,111,34))),
 AV("C",svgBox(circle(90,55,22)+line(60,55,120,55)+line(69,76,111,34))),
 AV("D",svgBox(circle(90,55,22)+line(60,55,120,55)+line(69,34,111,76))),
 AV("E",svgBox(circle(90,55,22)+line(90,25,90,85)+line(60,55,120,55)))
], "B",
`Garis yang ditambahkan bergerak dari vertikal ke diagonal turun-kiri/naik-kanan. Kandidat B mempertahankan arah diagonal yang merupakan rotasi 45° berikutnya.`),

q("TIU2-029",
`Empat gambar awal menunjukkan sebuah persegi yang berputar 45° setiap langkah: 0°, 45°, 90°, 135°. Tidak ada perubahan ukuran atau posisi. Pilih gambar kelima.`,
[
 AV("A",svgBox(rect(60,35,60,40,"none","#111",3,0))),
 AV("B",svgBox(rect(60,35,60,40,"none","#111",3,45))),
 AV("C",svgBox(rect(60,35,60,40,"none","#111",3,90))),
 AV("D",svgBox(rect(60,35,60,40,"none","#111",3,135))),
 AV("E",svgBox(rect(60,35,60,40,"none","#111",3,30)))
], "A",
`Setelah 0°, 45°, 90°, 135°, rotasi berikutnya kembali ke 180°, yang secara visual sama dengan 0°.`),

q("TIU2-030",
`Dalam rangkaian gambar, jumlah titik hitam bertambah satu pada setiap langkah, sedangkan posisi titik berpindah mengikuti urutan atas → kanan → bawah → kiri. Gambar terakhir memiliki tiga titik. Gambar berikutnya harus memiliki ...`,
[
 AV("A",svgBox(circle(90,30,5,"#111")+circle(90,55,5,"#111")+circle(90,80,5,"#111")+circle(90,105,5,"#111"))),
 AV("B",svgBox(circle(115,40,5,"#111")+circle(115,65,5,"#111")+circle(115,90,5,"#111")+circle(90,90,5,"#111"))),
 AV("C",svgBox(circle(90,45,5,"#111")+circle(90,70,5,"#111")+circle(90,95,5,"#111")+circle(65,95,5,"#111"))),
 AV("D",svgBox(circle(65,45,5,"#111")+circle(65,70,5,"#111")+circle(65,95,5,"#111")+circle(90,95,5,"#111"))),
 AV("E",svgBox(circle(90,35,5,"#111")+circle(115,55,5,"#111")+circle(90,75,5,"#111")+circle(65,55,5,"#111")))
], "B",
`Jumlah titik bertambah menjadi empat dan posisi titik tambahan berpindah ke sisi berikutnya dalam urutan. Kandidat B adalah konfigurasi yang memenuhi perpindahan tersebut.`),

q("TIU2-031",
`Perhatikan pola: pada setiap langkah sebuah segitiga diputar 90° berlawanan arah jarum jam, sementara titik di dalamnya berpindah ke sudut yang ditinggalkan segitiga pada langkah sebelumnya. Pilih gambar berikutnya.`,
[
 AV("A",svgBox(poly("90,20 125,80 55,80")+circle(90,38,6,"#111"))),
 AV("B",svgBox(poly("90,20 125,80 55,80")+circle(110,68,6,"#111"))),
 AV("C",svgBox(poly("90,20 125,80 55,80")+circle(70,68,6,"#111"))),
 AV("D",svgBox(poly("55,20 125,55 55,90")+circle(70,55,6,"#111"))),
 AV("E",svgBox(poly("55,55 90,20 125,55")+circle(110,55,6,"#111")))
], "D",
`Rotasi 90° berlawanan arah jarum jam mengubah orientasi segitiga menjadi arah mendatar. Titik ikut berpindah ke sudut yang ditinggalkan, sehingga konfigurasi D memenuhi kedua transformasi.`),

q("TIU2-032",
`Sebuah simbol terdiri atas dua garis tegak dan satu garis mendatar. Pada tiap langkah, garis mendatar bergeser satu posisi ke kanan, sedangkan garis tegak bergantian bertambah dan berkurang satu. Pilih bentuk yang melanjutkan pola.`,
[
 AV("A",svgBox(line(55,30,55,85)+line(90,30,90,85)+line(125,30,125,85)+line(45,60,135,60))),
 AV("B",svgBox(line(55,30,55,85)+line(90,30,90,85)+line(120,30,120,85)+line(55,70,135,70))),
 AV("C",svgBox(line(55,30,55,85)+line(90,30,90,85)+line(125,30,125,85)+line(55,50,135,50))),
 AV("D",svgBox(line(55,30,55,85)+line(90,30,90,85)+line(125,30,125,85)+line(45,60,120,60))),
 AV("E",svgBox(line(55,30,55,85)+line(90,30,90,85)+line(110,30,110,85)+line(55,60,135,60)))
], "B",
`Pada langkah berikutnya garis horizontal berpindah satu tingkat ke kanan/bawah sesuai pola, sementara jumlah garis vertikal tetap mengikuti perubahan bergantian. B adalah satu-satunya kandidat yang mempertahankan perpindahan tersebut.`),

q("TIU2-033",
`Setiap gambar memiliki sebuah persegi dan sebuah titik. Persegi berputar 90° searah jarum jam pada tiap langkah, sedangkan titik bergerak satu sudut berlawanan arah jarum jam. Pilih gambar berikutnya.`,
[
 AV("A",svgBox(rect(60,35,60,40,"none","#111",3,90)+circle(70,45,6,"#111"))),
 AV("B",svgBox(rect(60,35,60,40,"none","#111",3,180)+circle(110,45,6,"#111"))),
 AV("C",svgBox(rect(60,35,60,40,"none","#111",3,270)+circle(110,75,6,"#111"))),
 AV("D",svgBox(rect(60,35,60,40,"none","#111",3,0)+circle(70,75,6,"#111"))),
 AV("E",svgBox(rect(60,35,60,40,"none","#111",3,45)+circle(90,55,6,"#111")))
], "C",
`Orientasi persegi bertambah 90° searah jarum jam. Pada saat yang sama titik berpindah satu sudut berlawanan arah jarum jam. Kombinasi yang sesuai pada langkah berikutnya adalah C.`),

q("TIU2-034",
`Pada rangkaian berikut, jumlah sisi bentuk utama tetap empat. Setiap langkah satu sudut diarsir, dan sudut yang diarsir berpindah searah jarum jam satu posisi. Jika pada gambar terakhir sudut kiri atas diarsir, sudut yang harus diarsir berikutnya adalah ...`,
[
 AV("A",svgBox(poly("55,30 125,30 125,85 55,85","#111")+`<polygon points="55,30 90,30 55,57.5" fill="white"/>`)),
 AV("B",svgBox(poly("55,30 125,30 125,85 55,85","#111")+`<polygon points="125,30 125,58 90,30" fill="white"/>`)),
 AV("C",svgBox(poly("55,30 125,30 125,85 55,85","#111")+`<polygon points="125,85 90,85 125,58" fill="white"/>`)),
 AV("D",svgBox(poly("55,30 125,30 125,85 55,85","#111")+`<polygon points="55,85 55,58 90,85" fill="white"/>`)),
 AV("E",svgBox(poly("55,30 125,30 125,85 55,85","#111")+circle(90,58,10,"white","#111",2)))
], "B",
`Perpindahan satu sudut searah jarum jam dari kiri atas menghasilkan sudut kanan atas. Kandidat B menunjukkan posisi tersebut.`),

q("TIU2-035",
`Dua simbol bergerak secara bersamaan. Panah berputar 90° searah jarum jam pada setiap langkah, sedangkan lingkaran berpindah ke ujung panah yang baru. Pilih konfigurasi berikutnya.`,
[
 AV("A",svgBox(circle(120,55,10,"#111")+line(55,55,105,55)+poly("105,45 120,55 105,65","#111"))),
 AV("B",svgBox(circle(90,25,10,"#111")+line(90,85,90,35)+poly("80,35 90,20 100,35","#111"))),
 AV("C",svgBox(circle(60,55,10,"#111")+line(125,55,75,55)+poly("75,45 60,55 75,65","#111"))),
 AV("D",svgBox(circle(90,85,10,"#111")+line(90,25,90,75)+poly("80,75 90,90 100,75","#111"))),
 AV("E",svgBox(circle(90,55,10,"#111")+line(55,55,125,55)+poly("115,45 125,55 115,65","#111")))
], "B",
`Panah awal bergerak ke kanan, lalu diputar 90° searah jarum jam sehingga mengarah ke bawah. Lingkaran berpindah ke ujung arah baru, yaitu bagian bawah. Kandidat B memenuhi aturan.`)
];

/* Automatic integrity check */
(function validateTIUPaket2(){
  const bank = window.TIU_PAKET2;
  const bad = [];
  const ids = new Set();

  bank.forEach((q,i)=>{
    if(ids.has(q.id)) bad.push(`${q.id}: duplicate id`);
    ids.add(q.id);
    if(!q.question || !q.explanation) bad.push(`${q.id}: missing question/explanation`);
    if(!Array.isArray(q.options) || q.options.length !== 5) bad.push(`${q.id}: options must be 5`);
    else {
      const keys = q.options.map(o=>o.k);
      if(keys.join("") !== "ABCDE") bad.push(`${q.id}: option keys must be ABCDE`);
      if(!keys.includes(q.correct)) bad.push(`${q.id}: invalid correct key`);
    }
  });

  if(bank.length !== 35) bad.push(`Jumlah soal ${bank.length}, seharusnya 35`);

  console.log("TIU Paket 2 dimuat:", bank.length, "soal");
  if(bad.length){
    console.error("Audit TIU Paket 2 menemukan masalah:", bad);
  } else {
    console.log("Audit struktur TIU Paket 2: OK (35 soal, 5 opsi/soal, ID unik).");
  }
})();
