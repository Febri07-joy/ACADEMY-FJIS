/* =========================================================
   FJIS ACADEMY — STARTER STUDENT EXPERIENCE
   90 SMA + 90 KULIAH
   =========================================================
   File:
   js/starter-stories.js

   Fungsi:
   - Menyediakan 180 starter experience
   - 90 experience SMA
   - 90 experience Kuliah
   - Data starter diberi label starter: true
   - Setiap story memiliki avatar berbeda
   - Bisa dipakai oleh pages/berbagi.html
   ========================================================= */

"use strict";


/* =========================================================
   STARTER STORIES
   ========================================================= */

const STARTER_STORIES = [

    /* =====================================================
       SMA 001 - 090
       ===================================================== */

    {
        id: "sma_001",
        author: "A***a",
        level: "SMA",
        text: "Gue kelas 10 dan masih adaptasi banget sama ritme SMA. Ternyata beda jauh sama SMP wkwk.",
        createdAt: new Date("2026-09-10T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_002",
        author: "H****l",
        level: "SMA",
        text: "Awalnya bingung mau mulai belajar dari mana. Sekarang gue coba cicil dikit-dikit tiap hari.",
        createdAt: new Date("2026-09-11T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_003",
        author: "O*****w",
        level: "SMA",
        text: "Kelas 10 baru sadar kalau belajar sehari sebelum ulangan tuh ternyata nggak cukup 😭",
        createdAt: new Date("2026-09-12T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_004",
        author: "V***h",
        level: "SMA",
        text: "Gue masih nyari cara belajar yang cocok. Kadang pake rangkuman, kadang langsung latihan soal.",
        createdAt: new Date("2026-09-13T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_005",
        author: "C****s",
        level: "SMA",
        text: "Ada yang ngerasa pelajaran SMA mulai banyak banget nggak sih? Baru selesai satu, udah ada tugas lain 😭",
        createdAt: new Date("2026-09-14T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_006",
        author: "J*****d",
        level: "SMA",
        text: "Menurut gue kelas 10 tuh waktunya cari pola belajar dulu, jangan langsung maksain harus sempurna.",
        createdAt: new Date("2026-09-15T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_007",
        author: "Q***o",
        level: "SMA",
        text: "Gue tipe yang kalau belajar harus sambil nulis. Kalau cuma baca biasanya lima menit kemudian lupa wkwk.",
        createdAt: new Date("2026-09-16T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_008",
        author: "X****z",
        level: "SMA",
        text: "Kelas 10 jangan terlalu santai juga ternyata. Nilai dari awal tetap harus dijaga.",
        createdAt: new Date("2026-09-10T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_009",
        author: "E*****k",
        level: "SMA",
        text: "Gue baru mulai suka belajar kalau udah ngerti konsepnya. Kalau belum ngerti rasanya males banget.",
        createdAt: new Date("2026-09-11T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_010",
        author: "L***v",
        level: "SMA",
        text: "Ada yang belajar pakai timer juga? Gue sekarang coba 25 menit fokus terus istirahat sebentar.",
        createdAt: new Date("2026-09-12T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_011",
        author: "S****g",
        level: "SMA",
        text: "Masuk kelas 11 mulai kerasa kalau tugas sama materi makin serius.",
        createdAt: new Date("2026-09-13T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_012",
        author: "Z*****r",
        level: "SMA",
        text: "Kelas 11 menurut gue mulai harus mikirin target setelah lulus. Tapi jujur gue masih bingung mau ke mana 😭",
        createdAt: new Date("2026-09-14T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_013",
        author: "G***c",
        level: "SMA",
        text: "Gue baru sadar kalau catatan dari kelas 10 ternyata masih kepake sampai sekarang.",
        createdAt: new Date("2026-09-15T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_014",
        author: "N****n",
        level: "SMA",
        text: "Pelajaran yang awalnya gue benci malah sekarang jadi salah satu yang paling gue suka. Aneh juga ya 😂",
        createdAt: new Date("2026-09-16T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_015",
        author: "U*****y",
        level: "SMA",
        text: "Gue mulai belajar bukan karena takut nilai jelek, tapi karena pengen beneran ngerti.",
        createdAt: new Date("2026-09-10T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_016",
        author: "B***j",
        level: "SMA",
        text: "Kelas 11 tuh kayak masa di mana lu mulai ditanya terus, 'mau kuliah di mana?' Padahal gue sendiri belum tau wkwk.",
        createdAt: new Date("2026-09-11T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_017",
        author: "I****u",
        level: "SMA",
        text: "Kalau lagi males belajar gue biasanya mulai dari soal yang gampang dulu. Setelah panas baru lanjut.",
        createdAt: new Date("2026-09-12T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_018",
        author: "P*****f",
        level: "SMA",
        text: "Menurut gue yang susah bukan mulai belajar, tapi konsisten balik lagi besoknya.",
        createdAt: new Date("2026-09-13T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_019",
        author: "W***q",
        level: "SMA",
        text: "Pernah nggak sih udah belajar lama tapi pas ngerjain soal malah blank? Gue sering banget 😭",
        createdAt: new Date("2026-09-14T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_020",
        author: "D****b",
        level: "SMA",
        text: "Gue sekarang lebih sering latihan soal daripada cuma baca materi. Ternyata lumayan membantu.",
        createdAt: new Date("2026-09-15T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_021",
        author: "K*****m",
        level: "SMA",
        text: "Kelas 11 ada yang mulai persiapan TKA dari sekarang? Gue pengen mulai tapi belum tau urutannya.",
        createdAt: new Date("2026-09-16T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_022",
        author: "R***x",
        level: "SMA",
        text: "Gue suka bikin target kecil. Misalnya hari ini cuma satu bab. Kalau kebanyakan malah nggak jalan.",
        createdAt: new Date("2026-09-10T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_023",
        author: "Y****i",
        level: "SMA",
        text: "Kadang gue minder lihat teman yang udah jauh belajar. Tapi akhirnya gue coba fokus sama progres sendiri.",
        createdAt: new Date("2026-09-11T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_024",
        author: "F*****t",
        level: "SMA",
        text: "Belajar bareng teman ternyata cocok juga buat gue. Kalau sendirian suka ngantuk 😭",
        createdAt: new Date("2026-09-12T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_025",
        author: "M***e",
        level: "SMA",
        text: "Gue baru ngerti pentingnya tidur cukup. Dulu malah begadang sebelum ujian.",
        createdAt: new Date("2026-09-13T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_026",
        author: "T****p",
        level: "SMA",
        text: "Ada fase di mana gue ngerasa belajar gue nggak maju-maju. Ternyata gue cuma perlu ganti cara belajar.",
        createdAt: new Date("2026-09-14T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_027",
        author: "A*****a",
        level: "SMA",
        text: "Gue lebih gampang ngerti matematika kalau langsung latihan soal. Kalau baca rumus doang suka nggak masuk.",
        createdAt: new Date("2026-09-15T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_028",
        author: "H***l",
        level: "SMA",
        text: "Kalau udah stuck biasanya gue tinggalin dulu sebentar. Balik lagi malah kadang langsung ketemu jawabannya.",
        createdAt: new Date("2026-09-16T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_029",
        author: "O****w",
        level: "SMA",
        text: "Kelas 11 ngajarin gue kalau nilai bagus itu bukan cuma soal pintar, tapi soal kebiasaan juga.",
        createdAt: new Date("2026-09-10T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_030",
        author: "V*****h",
        level: "SMA",
        text: "Gue lagi belajar buat nggak panik kalau salah. Salah satu soal bukan berarti gue nggak bisa semuanya.",
        createdAt: new Date("2026-09-11T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_031",
        author: "C***s",
        level: "SMA",
        text: "Kelas 12 sekarang rasanya waktu cepet banget. Tiba-tiba udah mikirin kuliah, TKA, dan segala macam.",
        createdAt: new Date("2026-09-12T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_032",
        author: "J****d",
        level: "SMA",
        text: "Jujur gue takut nggak keterima di pilihan yang gue mau. Tapi sekarang coba fokus persiapan dulu.",
        createdAt: new Date("2026-09-13T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_033",
        author: "Q*****o",
        level: "SMA",
        text: "Kelas 12 bikin gue sadar kalau waktu belajar harus lebih teratur. Nggak bisa asal nanti-nanti lagi.",
        createdAt: new Date("2026-09-14T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_034",
        author: "X***z",
        level: "SMA",
        text: "Ada yang masih bingung antara belajar materi dulu atau langsung tryout? Gue kadang masih muter-muter di situ.",
        createdAt: new Date("2026-09-15T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_035",
        author: "E****k",
        level: "SMA",
        text: "Gue mulai bikin daftar materi yang belum dikuasai. Lumayan jadi kelihatan mana yang harus dikejar.",
        createdAt: new Date("2026-09-16T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_036",
        author: "L*****v",
        level: "SMA",
        text: "TKA makin dekat tapi gue masih belum pede 😭 Ada yang ngerasain hal yang sama?",
        createdAt: new Date("2026-09-10T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_037",
        author: "S***g",
        level: "SMA",
        text: "Sekarang gue lebih suka evaluasi kesalahan daripada cuma lihat skor. Dari situ baru tau bagian yang lemah.",
        createdAt: new Date("2026-09-11T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_038",
        author: "Z****r",
        level: "SMA",
        text: "Gue pernah dapat nilai jelek dan sempat malu. Tapi ternyata itu malah bikin gue mulai belajar lebih serius.",
        createdAt: new Date("2026-09-12T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_039",
        author: "G*****c",
        level: "SMA",
        text: "Kalau lagi capek banget gue nggak maksa belajar berjam-jam. Biasanya sedikit tapi tetap jalan.",
        createdAt: new Date("2026-09-13T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_040",
        author: "N***n",
        level: "SMA",
        text: "Menurut gue persiapan itu bukan siapa yang paling cepat, tapi siapa yang bisa terus jalan.",
        createdAt: new Date("2026-09-14T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_041",
        author: "U****y",
        level: "SMA",
        text: "Gue kelas 12 dan baru sadar banyak materi kelas sebelumnya yang ternyata nyambung.",
        createdAt: new Date("2026-09-15T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_042",
        author: "B*****j",
        level: "SMA",
        text: "Kalau belajar pagi gue lebih fokus. Malam biasanya baru buka buku udah pengen tidur 😂",
        createdAt: new Date("2026-09-16T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_043",
        author: "I***u",
        level: "SMA",
        text: "Gue lagi coba ngurangin kebiasaan buka HP pas belajar. Ternyata susah juga wkwk.",
        createdAt: new Date("2026-09-10T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_044",
        author: "P****f",
        level: "SMA",
        text: "Salah satu hal yang gue pelajari: jangan malu nanya kalau memang belum ngerti.",
        createdAt: new Date("2026-09-11T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_045",
        author: "W*****q",
        level: "SMA",
        text: "Dulu gue kira teman yang pintar itu saingan. Sekarang malah sering belajar bareng dan saling bantu.",
        createdAt: new Date("2026-09-12T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_046",
        author: "D***b",
        level: "SMA",
        text: "Gue kalau belajar suka bikin pertanyaan sendiri. Entah kenapa jadi lebih gampang inget.",
        createdAt: new Date("2026-09-13T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_047",
        author: "K****m",
        level: "SMA",
        text: "Kelas 10 dulu gue terlalu santai. Sekarang kelas 12 baru kerasa kenapa konsisten dari awal itu penting.",
        createdAt: new Date("2026-09-14T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_048",
        author: "R*****x",
        level: "SMA",
        text: "Kalau ada satu materi yang nggak ngerti, gue biasanya cari cara penjelasan lain sampai nemu yang klik.",
        createdAt: new Date("2026-09-15T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_049",
        author: "Y***i",
        level: "SMA",
        text: "Gue paling takut sama soal yang kelihatannya gampang tapi ternyata jebakan 😭",
        createdAt: new Date("2026-09-16T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_050",
        author: "F****t",
        level: "SMA",
        text: "Sekarang gue mulai catat kesalahan yang sering muncul. Jadi pas latihan lagi nggak ngulang kesalahan yang sama.",
        createdAt: new Date("2026-09-10T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_051",
        author: "M*****e",
        level: "SMA",
        text: "Ada nggak yang lebih suka belajar sambil denger musik? Gue kalau terlalu sepi malah nggak fokus.",
        createdAt: new Date("2026-09-11T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_052",
        author: "T***p",
        level: "SMA",
        text: "Gue mulai ngerti kalau setiap orang punya cara belajar beda. Jadi sekarang nggak terlalu bandingin diri sama orang lain.",
        createdAt: new Date("2026-09-12T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_053",
        author: "A****a",
        level: "SMA",
        text: "Kadang satu hari produktif banget, besoknya drop. Kayaknya yang penting jangan berhenti total.",
        createdAt: new Date("2026-09-13T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_054",
        author: "H*****l",
        level: "SMA",
        text: "Gue sekarang mulai pakai jadwal mingguan. Nggak selalu berhasil, tapi setidaknya tau harus ngapain.",
        createdAt: new Date("2026-09-14T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_055",
        author: "O***w",
        level: "SMA",
        text: "Kelas 12 itu ternyata bukan cuma soal belajar, tapi juga belajar ngatur tekanan sendiri.",
        createdAt: new Date("2026-09-15T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_056",
        author: "V****h",
        level: "SMA",
        text: "Gue masih sering overthinking soal masa depan. Tapi sekarang coba fokus satu langkah dulu.",
        createdAt: new Date("2026-09-16T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_057",
        author: "C*****s",
        level: "SMA",
        text: "Kalau udah selesai satu target kecil rasanya seneng juga. Ternyata progress kecil bikin semangat.",
        createdAt: new Date("2026-09-10T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_058",
        author: "J***d",
        level: "SMA",
        text: "Gue pernah ngerasa ketinggalan jauh. Tapi pas dilihat lagi ternyata gue juga udah berkembang.",
        createdAt: new Date("2026-09-11T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_059",
        author: "Q****o",
        level: "SMA",
        text: "Yang bikin gue semangat belajar biasanya kalau udah ngerti sesuatu yang sebelumnya bikin bingung.",
        createdAt: new Date("2026-09-12T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_060",
        author: "X*****z",
        level: "SMA",
        text: "Sekarang gue lebih pilih belajar sedikit tapi rutin daripada nunggu mood datang.",
        createdAt: new Date("2026-09-13T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_061",
        author: "E***k",
        level: "SMA",
        text: "Gue masih kelas 10, tapi udah mulai mikirin mau ambil jurusan apa nanti. Bingung tapi seru juga.",
        createdAt: new Date("2026-09-14T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_062",
        author: "L****v",
        level: "SMA",
        text: "Kelas 11 bikin gue belajar kalau nggak semua tugas harus dikerjain sekaligus. Cicil ternyata lebih manusiawi 😂",
        createdAt: new Date("2026-09-15T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_063",
        author: "S*****g",
        level: "SMA",
        text: "Gue suka kalau habis latihan soal langsung tau pembahasannya. Jadi kesalahannya nggak cuma lewat.",
        createdAt: new Date("2026-09-16T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_064",
        author: "Z***r",
        level: "SMA",
        text: "Kalau ketemu materi susah gue biasanya jangan langsung nyerah. Istirahat sebentar terus coba lagi.",
        createdAt: new Date("2026-09-10T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_065",
        author: "G****c",
        level: "SMA",
        text: "Gue baru sadar belajar efektif itu nggak harus lama. Yang penting benar-benar fokus.",
        createdAt: new Date("2026-09-11T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_066",
        author: "N*****n",
        level: "SMA",
        text: "Kadang gue buka materi cuma karena niat belajar, tapi ujung-ujungnya malah bersihin meja 😂",
        createdAt: new Date("2026-09-12T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_067",
        author: "U***y",
        level: "SMA",
        text: "Yang paling membantu gue justru nanya ke guru ketika udah mentok.",
        createdAt: new Date("2026-09-13T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_068",
        author: "B****j",
        level: "SMA",
        text: "Gue masih belajar buat nggak takut sama soal susah. Kadang memang harus salah beberapa kali dulu.",
        createdAt: new Date("2026-09-14T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_069",
        author: "I*****u",
        level: "SMA",
        text: "Kelas 12 bikin gue makin menghargai waktu kosong. Dulu santai, sekarang lima belas menit aja bisa kepake buat belajar.",
        createdAt: new Date("2026-09-15T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_070",
        author: "P***f",
        level: "SMA",
        text: "Gue belajar paling enak kalau targetnya jelas. Misalnya 'selesai 20 soal', bukan cuma 'belajar matematika'.",
        createdAt: new Date("2026-09-16T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_071",
        author: "W****q",
        level: "SMA",
        text: "Ada yang suka ngerasa bersalah kalau sehari nggak belajar? Gue dulu sering begitu. Sekarang coba lebih seimbang.",
        createdAt: new Date("2026-09-10T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_072",
        author: "D*****b",
        level: "SMA",
        text: "Menurut gue istirahat juga bagian dari persiapan. Kalau capek banget malah nggak masuk apa-apa.",
        createdAt: new Date("2026-09-11T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_073",
        author: "K***m",
        level: "SMA",
        text: "Gue paling suka kalau belajar terus tiba-tiba 'ohhh ternyata begini' 😭✨",
        createdAt: new Date("2026-09-12T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_074",
        author: "R****x",
        level: "SMA",
        text: "Dulu gue malu kalau jawabanku salah di kelas. Sekarang yaudah, salah kan bisa diperbaiki.",
        createdAt: new Date("2026-09-13T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_075",
        author: "Y*****i",
        level: "SMA",
        text: "Gue mulai belajar lebih serius setelah lihat teman-teman juga berjuang. Bukan buat saingan, lebih ke saling nyemangatin.",
        createdAt: new Date("2026-09-14T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_076",
        author: "F***t",
        level: "SMA",
        text: "Kalau lagi stuck parah, gue biasanya pindah materi dulu. Nanti balik lagi kalau kepala udah lebih enak.",
        createdAt: new Date("2026-09-15T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_077",
        author: "M****e",
        level: "SMA",
        text: "Gue sekarang mulai ngerti kenapa orang bilang jangan bandingin proses. Ternyata tiap orang beda banget ritmenya.",
        createdAt: new Date("2026-09-16T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_078",
        author: "T*****p",
        level: "SMA",
        text: "Persiapan TKA bikin gue belajar disiplin. Walaupun kadang malesnya masih menang 😭",
        createdAt: new Date("2026-09-10T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_079",
        author: "A***a",
        level: "SMA",
        text: "Gue nggak selalu bisa belajar sesuai jadwal, tapi sekarang kalau meleset gue coba lanjut lagi daripada berhenti.",
        createdAt: new Date("2026-09-11T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_080",
        author: "H****l",
        level: "SMA",
        text: "Yang penting buat gue sekarang bukan kelihatan sibuk belajar, tapi benar-benar ngerti apa yang dipelajari.",
        createdAt: new Date("2026-09-12T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_081",
        author: "O*****w",
        level: "SMA",
        text: "Gue kelas 10 dan masih sering salah ngatur waktu. Tapi pelan-pelan mulai ketemu polanya.",
        createdAt: new Date("2026-09-13T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_082",
        author: "V***h",
        level: "SMA",
        text: "Kelas 11 sekarang gue mulai nyiapin materi dari jauh-jauh hari. Ternyata lebih tenang pas ujian.",
        createdAt: new Date("2026-09-14T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_083",
        author: "C****s",
        level: "SMA",
        text: "Kelas 12 tuh campur aduk. Senang mau lulus, tapi juga takut sama langkah berikutnya.",
        createdAt: new Date("2026-09-15T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_084",
        author: "J*****d",
        level: "SMA",
        text: "Gue suka nyatet progres kecil. Hari ini 10 soal, besok 15. Nggak terasa lama-lama banyak juga.",
        createdAt: new Date("2026-09-16T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_085",
        author: "Q***o",
        level: "SMA",
        text: "Kalau belum paham bukan berarti nggak bisa. Kadang memang butuh penjelasan dengan cara yang beda.",
        createdAt: new Date("2026-09-10T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_086",
        author: "X****z",
        level: "SMA",
        text: "Gue belajar buat lebih menghargai proses sendiri. Dulu dikit-dikit lihat orang lain udah sampai mana.",
        createdAt: new Date("2026-09-11T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_087",
        author: "E*****k",
        level: "SMA",
        text: "Sekarang gue lebih berani bilang 'gue belum ngerti'. Ternyata itu lebih membantu daripada pura-pura ngerti.",
        createdAt: new Date("2026-09-12T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_088",
        author: "L***v",
        level: "SMA",
        text: "Gue masih punya banyak yang harus dikejar, tapi setidaknya sekarang udah mulai dari satu per satu.",
        createdAt: new Date("2026-09-13T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_089",
        author: "S****g",
        level: "SMA",
        text: "Nggak semua hari produktif. Yang penting besok masih mau coba lagi.",
        createdAt: new Date("2026-09-14T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "sma_090",
        author: "Z*****r",
        level: "SMA",
        text: "Buat gue belajar sekarang bukan lagi soal siapa yang paling pintar. Lebih ke siapa yang mau terus belajar.",
        createdAt: new Date("2026-09-15T21:18:00+07:00").getTime(),
        starter: true
    },


    /* =====================================================
       KULIAH 001 - 090
       ===================================================== */

    {
        id: "kuliah_001",
        author: "G***c",
        level: "Kuliah",
        text: "Gimana nih para maba, shock kah ketika masuk kuliah? Wkwk.",
        createdAt: new Date("2026-09-16T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_002",
        author: "N****n",
        level: "Kuliah",
        text: "Ternyata dunia kuliah ngajarin gue buat lebih mandiri dan bisa ngatur waktu sendiri.",
        createdAt: new Date("2026-09-10T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_003",
        author: "U*****y",
        level: "Kuliah",
        text: "Tugas memang banyak, tapi lama-lama mulai ngerti cara ngatur prioritas.",
        createdAt: new Date("2026-09-11T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_004",
        author: "B***j",
        level: "Kuliah",
        text: "Maba di sini masih suka bingung bedain tugas yang penting sama yang bisa dikerjain nanti 😭",
        createdAt: new Date("2026-09-12T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_005",
        author: "I****u",
        level: "Kuliah",
        text: "Gue kira kuliah bakal lebih santai daripada SMA. Ternyata... ya nggak juga wkwk.",
        createdAt: new Date("2026-09-13T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_006",
        author: "P*****f",
        level: "Kuliah",
        text: "Hal yang paling susah buat gue awal kuliah itu bangun dan ngatur semuanya sendiri.",
        createdAt: new Date("2026-09-14T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_007",
        author: "W***q",
        level: "Kuliah",
        text: "Dulu takut nggak punya teman pas masuk kuliah. Ternyata pelan-pelan ketemu circle juga.",
        createdAt: new Date("2026-09-15T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_008",
        author: "D****b",
        level: "Kuliah",
        text: "Gue baru sadar kalau dosen nggak bakal selalu ngingetin tugas. Harus punya inisiatif sendiri.",
        createdAt: new Date("2026-09-16T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_009",
        author: "K*****m",
        level: "Kuliah",
        text: "Kuliah sambil organisasi ternyata seru, tapi jadwal harus bener-bener diatur.",
        createdAt: new Date("2026-09-10T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_010",
        author: "R***x",
        level: "Kuliah",
        text: "Gue tipe yang harus nyatet pas dosen jelasin. Kalau cuma denger kadang pulang-pulang lupa.",
        createdAt: new Date("2026-09-11T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_011",
        author: "Y****i",
        level: "Kuliah",
        text: "Semester awal gue sempat ngerasa salah jurusan. Setelah dipelajari lebih dalam ternyata ada bagian yang gue suka.",
        createdAt: new Date("2026-09-12T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_012",
        author: "F*****t",
        level: "Kuliah",
        text: "Yang bikin kaget bukan cuma tugasnya, tapi cara belajarnya. Harus lebih banyak cari dan baca sendiri.",
        createdAt: new Date("2026-09-13T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_013",
        author: "M***e",
        level: "Kuliah",
        text: "Gue sekarang mulai pakai kalender buat catat deadline. Kalau nggak bisa-bisa kelupaan.",
        createdAt: new Date("2026-09-14T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_014",
        author: "T****p",
        level: "Kuliah",
        text: "Ternyata tugas kelompok itu bukan cuma soal ngerjain tugas, tapi juga belajar komunikasi.",
        createdAt: new Date("2026-09-15T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_015",
        author: "A*****a",
        level: "Kuliah",
        text: "Pernah nggak udah ngerjain tugas berjam-jam terus pas dicek ternyata salah format 😭",
        createdAt: new Date("2026-09-16T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_016",
        author: "H***l",
        level: "Kuliah",
        text: "Gue belajar buat nggak takut ngomong di kelas. Awalnya deg-degan banget.",
        createdAt: new Date("2026-09-10T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_017",
        author: "O****w",
        level: "Kuliah",
        text: "Kalau ada materi yang nggak ngerti gue sekarang lebih berani tanya teman atau dosen.",
        createdAt: new Date("2026-09-11T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_018",
        author: "V*****h",
        level: "Kuliah",
        text: "Semester pertama gue terlalu sering nunda tugas. Sekarang mulai sadar akibatnya kalau numpuk.",
        createdAt: new Date("2026-09-12T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_019",
        author: "C***s",
        level: "Kuliah",
        text: "Gue suka belajar di perpustakaan karena kalau di kos malah gampang terdistraksi.",
        createdAt: new Date("2026-09-13T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_020",
        author: "J****d",
        level: "Kuliah",
        text: "Kuliah ngajarin gue kalau nggak semua hal harus dikerjain sendiri. Kadang minta bantuan itu perlu.",
        createdAt: new Date("2026-09-14T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_021",
        author: "Q*****o",
        level: "Kuliah",
        text: "Ada yang ngerasa semester awal paling susah adaptasi? Gue awalnya sering banget bingung.",
        createdAt: new Date("2026-09-15T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_022",
        author: "X***z",
        level: "Kuliah",
        text: "Gue mulai ngerti pola dosen setelah beberapa pertemuan. Jadi bisa lebih siap sebelum kelas.",
        createdAt: new Date("2026-09-16T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_023",
        author: "E****k",
        level: "Kuliah",
        text: "Organisasi ngajarin gue banyak hal yang nggak selalu gue dapat dari kelas.",
        createdAt: new Date("2026-09-10T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_024",
        author: "L*****v",
        level: "Kuliah",
        text: "Gue pernah keteteran karena terlalu banyak ambil kegiatan. Sekarang belajar bilang nggak.",
        createdAt: new Date("2026-09-11T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_025",
        author: "S***g",
        level: "Kuliah",
        text: "Menurut gue IPK penting, tapi pengalaman selama kuliah juga nggak kalah penting.",
        createdAt: new Date("2026-09-12T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_026",
        author: "Z****r",
        level: "Kuliah",
        text: "Gue sekarang mulai bikin prioritas mingguan. Kalau cuma mengandalkan ingatan, berantakan 😂",
        createdAt: new Date("2026-09-13T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_027",
        author: "G*****c",
        level: "Kuliah",
        text: "Praktikum pertama bikin deg-degan. Setelah beberapa kali ternyata mulai terbiasa.",
        createdAt: new Date("2026-09-14T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_028",
        author: "N***n",
        level: "Kuliah",
        text: "Gue paling suka kalau tugasnya berbentuk proyek. Capek, tapi rasanya lebih nyata belajarnya.",
        createdAt: new Date("2026-09-15T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_029",
        author: "U****y",
        level: "Kuliah",
        text: "Semakin semester atas makin sadar kalau waktu ternyata cepat banget.",
        createdAt: new Date("2026-09-16T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_030",
        author: "B*****j",
        level: "Kuliah",
        text: "Sekarang gue mulai mikirin skill yang mau dibawa setelah lulus, bukan cuma nilai.",
        createdAt: new Date("2026-09-10T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_031",
        author: "I***u",
        level: "Kuliah",
        text: "Ternyata belajar di kuliah lebih banyak mandirinya. Dosen kasih arah, sisanya kita yang cari.",
        createdAt: new Date("2026-09-11T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_032",
        author: "P****f",
        level: "Kuliah",
        text: "Gue dulu takut presentasi. Sekarang masih deg-degan sih, tapi udah nggak separah dulu 😂",
        createdAt: new Date("2026-09-12T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_033",
        author: "W*****q",
        level: "Kuliah",
        text: "Kalau lagi banyak tugas gue biasanya kerjain yang deadline-nya paling dekat dulu.",
        createdAt: new Date("2026-09-13T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_034",
        author: "D***b",
        level: "Kuliah",
        text: "Gue belajar kalau jangan terlalu bergantung sama satu teman untuk tugas. Kita tetap harus ngerti juga.",
        createdAt: new Date("2026-09-14T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_035",
        author: "K****m",
        level: "Kuliah",
        text: "Semester awal gue sering ngerasa semua orang lebih pintar. Lama-lama sadar ternyata semua orang juga belajar.",
        createdAt: new Date("2026-09-15T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_036",
        author: "R*****x",
        level: "Kuliah",
        text: "Gue mulai menikmati kuliah setelah berhenti terlalu mikirin apakah gue dibanding-bandingin sama orang lain.",
        createdAt: new Date("2026-09-16T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_037",
        author: "Y***i",
        level: "Kuliah",
        text: "Tugas akhir masih jauh tapi kadang udah kepikiran duluan 😭",
        createdAt: new Date("2026-09-10T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_038",
        author: "F****t",
        level: "Kuliah",
        text: "Gue mulai belajar pakai referensi dari beberapa sumber. Ternyata pemahaman jadi lebih luas.",
        createdAt: new Date("2026-09-11T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_039",
        author: "M*****e",
        level: "Kuliah",
        text: "Kalau lagi capek kuliah gue biasanya istirahat dulu. Besok baru lanjut daripada maksa tapi nggak masuk.",
        createdAt: new Date("2026-09-12T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_040",
        author: "T***p",
        level: "Kuliah",
        text: "Yang paling gue pelajari di kuliah bukan cuma materi, tapi cara bertanggung jawab sama pilihan sendiri.",
        createdAt: new Date("2026-09-13T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_041",
        author: "A****a",
        level: "Kuliah",
        text: "Pernah ada masa gue ngerasa salah jurusan. Ternyata setelah ikut beberapa kegiatan gue nemu sisi lain yang gue suka.",
        createdAt: new Date("2026-09-14T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_042",
        author: "H*****l",
        level: "Kuliah",
        text: "Gue baru sadar networking itu nggak harus selalu formal. Kenalan sama teman baru aja udah mulai dari situ.",
        createdAt: new Date("2026-09-15T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_043",
        author: "O***w",
        level: "Kuliah",
        text: "Kuliah sambil kegiatan lain bikin gue belajar banget soal prioritas.",
        createdAt: new Date("2026-09-16T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_044",
        author: "V****h",
        level: "Kuliah",
        text: "Gue kalau ada tugas besar biasanya pecah jadi beberapa bagian. Jadi nggak terlalu berat.",
        createdAt: new Date("2026-09-10T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_045",
        author: "C*****s",
        level: "Kuliah",
        text: "Satu hal yang gue pelajari: jangan malu mulai dari nol walaupun teman lain kelihatannya udah jago.",
        createdAt: new Date("2026-09-11T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_046",
        author: "J***d",
        level: "Kuliah",
        text: "Gue suka diskusi sama teman karena kadang satu konsep yang nggak gue ngerti jadi jelas setelah dijelasin dengan bahasa mereka.",
        createdAt: new Date("2026-09-12T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_047",
        author: "Q****o",
        level: "Kuliah",
        text: "Dulu gue pikir harus selalu produktif. Sekarang lebih ngerti kapan harus istirahat.",
        createdAt: new Date("2026-09-13T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_048",
        author: "X*****z",
        level: "Kuliah",
        text: "Ada yang kalau deadline tinggal sehari malah baru fokus? Gue jangan ditiru ya wkwk.",
        createdAt: new Date("2026-09-14T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_049",
        author: "E***k",
        level: "Kuliah",
        text: "Sekarang gue mulai biasain baca materi sebelum kelas. Jadi pas dosen jelasin nggak terlalu blank.",
        createdAt: new Date("2026-09-15T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_050",
        author: "L****v",
        level: "Kuliah",
        text: "Menurut gue pengalaman ikut kepanitiaan lumayan bikin gue belajar kerja sama dan komunikasi.",
        createdAt: new Date("2026-09-16T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_051",
        author: "S*****g",
        level: "Kuliah",
        text: "Gue pernah terlalu banyak ambil kegiatan sampai tugas kuliah berantakan. Sekarang lebih selektif.",
        createdAt: new Date("2026-09-10T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_052",
        author: "Z***r",
        level: "Kuliah",
        text: "Semester atas bikin gue makin sadar kalau skill komunikasi juga penting banget.",
        createdAt: new Date("2026-09-11T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_053",
        author: "G****c",
        level: "Kuliah",
        text: "Gue masih sering bingung soal karier setelah lulus. Tapi sekarang mulai cari tahu pelan-pelan.",
        createdAt: new Date("2026-09-12T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_054",
        author: "N*****n",
        level: "Kuliah",
        text: "Kalau nggak ngerti materi, gue sekarang nggak langsung menyimpulkan 'gue nggak bisa'. Coba cari cara lain dulu.",
        createdAt: new Date("2026-09-13T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_055",
        author: "U***y",
        level: "Kuliah",
        text: "Yang paling susah kadang bukan tugasnya, tapi mulai ngerjainnya 😭",
        createdAt: new Date("2026-09-14T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_056",
        author: "B****j",
        level: "Kuliah",
        text: "Gue mulai belajar bikin deadline pribadi sebelum deadline asli. Lumayan mengurangi panik.",
        createdAt: new Date("2026-09-15T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_057",
        author: "I*****u",
        level: "Kuliah",
        text: "Ada hari di mana kuliah rasanya berat banget. Tapi biasanya setelah selesai satu tugas kecil jadi agak lega.",
        createdAt: new Date("2026-09-16T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_058",
        author: "P***f",
        level: "Kuliah",
        text: "Gue mulai belajar ngomong di depan orang dari presentasi kecil. Sekarang lumayan lebih pede.",
        createdAt: new Date("2026-09-10T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_059",
        author: "W****q",
        level: "Kuliah",
        text: "Ternyata teman kuliah bisa datang dari background yang beda-beda banget. Seru belajar dari mereka.",
        createdAt: new Date("2026-09-11T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_060",
        author: "D*****b",
        level: "Kuliah",
        text: "Gue sekarang lebih berani ikut diskusi walaupun kadang takut jawaban gue salah.",
        createdAt: new Date("2026-09-12T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_061",
        author: "K***m",
        level: "Kuliah",
        text: "Awal kuliah gue kaget sama banyaknya bacaan. Sekarang mulai bisa pilih mana yang harus dibaca dulu.",
        createdAt: new Date("2026-09-13T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_062",
        author: "R****x",
        level: "Kuliah",
        text: "Gue belajar kalau jangan nunggu mood buat ngerjain tugas. Kalau nunggu, bisa nggak selesai-selesai.",
        createdAt: new Date("2026-09-14T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_063",
        author: "Y*****i",
        level: "Kuliah",
        text: "Praktikum bikin gue belajar lebih teliti. Salah satu langkah aja kadang bisa ngaruh ke hasil.",
        createdAt: new Date("2026-09-15T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_064",
        author: "F***t",
        level: "Kuliah",
        text: "Gue pernah gagal presentasi dan malu banget. Tapi setelah itu malah tahu bagian mana yang harus diperbaiki.",
        createdAt: new Date("2026-09-16T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_065",
        author: "M****e",
        level: "Kuliah",
        text: "Menurut gue kuliah itu tempat buat coba banyak hal. Nggak harus langsung tahu semuanya.",
        createdAt: new Date("2026-09-10T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_066",
        author: "T*****p",
        level: "Kuliah",
        text: "Gue mulai bikin folder khusus buat materi tiap mata kuliah. Dulu semua file campur aduk 😭",
        createdAt: new Date("2026-09-11T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_067",
        author: "A***a",
        level: "Kuliah",
        text: "Kalau belajar kelompok harus ada pembagian tugas yang jelas. Kalau nggak biasanya malah bingung.",
        createdAt: new Date("2026-09-12T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_068",
        author: "H****l",
        level: "Kuliah",
        text: "Gue mulai belajar bilang kalau memang belum bisa. Lebih enak minta arahan daripada pura-pura paham.",
        createdAt: new Date("2026-09-13T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_069",
        author: "O*****w",
        level: "Kuliah",
        text: "Kuliah bikin gue lebih sadar kalau keputusan kecil sehari-hari ternyata ngaruh ke banyak hal.",
        createdAt: new Date("2026-09-14T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_070",
        author: "V***h",
        level: "Kuliah",
        text: "Gue mulai belajar nyusun prioritas antara kuliah, organisasi, istirahat, dan kehidupan pribadi.",
        createdAt: new Date("2026-09-15T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_071",
        author: "C****s",
        level: "Kuliah",
        text: "Ada masa gue merasa tertinggal karena teman-teman udah punya banyak pengalaman. Sekarang gue fokus bangun pengalaman gue sendiri.",
        createdAt: new Date("2026-09-16T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_072",
        author: "J*****d",
        level: "Kuliah",
        text: "Gue suka kalau dapat tugas yang bikin mikir, walaupun awalnya kesel karena susah 😂",
        createdAt: new Date("2026-09-10T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_073",
        author: "Q***o",
        level: "Kuliah",
        text: "Sekarang gue mulai ngerti kalau nilai jelek sekali bukan akhir dari semuanya. Yang penting evaluasi.",
        createdAt: new Date("2026-09-11T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_074",
        author: "X****z",
        level: "Kuliah",
        text: "Gue paling nyaman belajar bareng teman setelah masing-masing baca materi dulu.",
        createdAt: new Date("2026-09-12T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_075",
        author: "E*****k",
        level: "Kuliah",
        text: "Maba dulu gue takut salah pilih teman. Ternyata nggak perlu terlalu dipikirin, kenalan aja dulu.",
        createdAt: new Date("2026-09-13T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_076",
        author: "L***v",
        level: "Kuliah",
        text: "Gue belajar bahwa kemampuan ngatur waktu ternyata sama pentingnya dengan kemampuan akademik.",
        createdAt: new Date("2026-09-14T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_077",
        author: "S****g",
        level: "Kuliah",
        text: "Sekarang gue lebih sering review materi sebelum ujian daripada belajar semuanya semalam.",
        createdAt: new Date("2026-09-15T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_078",
        author: "Z*****r",
        level: "Kuliah",
        text: "Kadang kuliah bikin capek, tapi ada momen tertentu yang bikin gue ngerasa, 'oh ternyata gue berkembang juga'.",
        createdAt: new Date("2026-09-16T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_079",
        author: "G***c",
        level: "Kuliah",
        text: "Gue sekarang mulai lebih terbuka sama kritik. Awalnya sakit hati, tapi ternyata banyak yang bisa dipelajari.",
        createdAt: new Date("2026-09-10T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_080",
        author: "N****n",
        level: "Kuliah",
        text: "Yang paling gue syukuri dari kuliah adalah ketemu banyak orang dengan cara pikir yang beda.",
        createdAt: new Date("2026-09-11T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_081",
        author: "U*****y",
        level: "Kuliah",
        text: "Gue masih belajar buat nggak terlalu takut sama masa depan. Sekarang coba nikmatin prosesnya juga.",
        createdAt: new Date("2026-09-12T21:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_082",
        author: "B***j",
        level: "Kuliah",
        text: "Kalau lagi banyak deadline gue biasanya tulis semuanya dulu. Setelah kelihatan baru mulai satu-satu.",
        createdAt: new Date("2026-09-13T08:17:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_083",
        author: "I****u",
        level: "Kuliah",
        text: "Gue belajar kalau nggak semua kesempatan harus diambil. Pilih yang memang sesuai tujuan.",
        createdAt: new Date("2026-09-14T09:42:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_084",
        author: "P*****f",
        level: "Kuliah",
        text: "Semester atas makin sering mikirin apa yang mau dilakukan setelah lulus. Masih cari jawabannya sih.",
        createdAt: new Date("2026-09-15T10:31:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_085",
        author: "W***q",
        level: "Kuliah",
        text: "Gue pernah ngerasa nggak cukup pintar buat jurusan ini. Ternyata kemampuan bisa berkembang kalau terus dilatih.",
        createdAt: new Date("2026-09-16T12:06:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_086",
        author: "D****b",
        level: "Kuliah",
        text: "Menurut gue jangan takut mulai organisasi atau kegiatan baru cuma karena belum pengalaman.",
        createdAt: new Date("2026-09-10T14:18:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_087",
        author: "K*****m",
        level: "Kuliah",
        text: "Gue masih sering belajar dari kesalahan. Bedanya sekarang nggak langsung nyalahin diri sendiri.",
        createdAt: new Date("2026-09-11T16:24:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_088",
        author: "R***x",
        level: "Kuliah",
        text: "Kuliah ternyata bukan cuma tentang dapat gelar. Banyak banget hal kecil yang bikin kita berubah.",
        createdAt: new Date("2026-09-12T18:47:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_089",
        author: "Y****i",
        level: "Kuliah",
        text: "Nggak semua semester bakal terasa gampang. Yang penting jangan merasa harus melewati semuanya sendirian.",
        createdAt: new Date("2026-09-13T20:12:00+07:00").getTime(),
        starter: true
    },

    {
        id: "kuliah_090",
        author: "F*****t",
        level: "Kuliah",
        text: "Pelan-pelan gue mulai ngerti: kuliah itu bukan lomba siapa paling cepat, tapi proses masing-masing buat berkembang.",
        createdAt: new Date("2026-09-14T21:18:00+07:00").getTime(),
        starter: true
    }

];


/* =========================================================
   STARTER AVATAR SYSTEM
   =========================================================
   Setiap story starter mendapatkan avatar berbeda.
   Avatar ini dipakai oleh halaman Berbagi.
   ========================================================= */

const STARTER_AVATAR_POOL = [

    "🧑🏻",
    "👩🏻",
    "🧑🏽",
    "👨🏻",
    "👩🏽",
    "🧑🏿",
    "👨🏽",
    "👩🏿",

    "🧑🏼‍🎓",
    "👩🏻‍🎓",
    "👨🏽‍🎓",
    "🧑🏿‍🎓",
    "👨🏻‍🎓",
    "👩🏽‍🎓",

    "🧑🏻‍💻",
    "👩🏻‍💻",
    "👨🏽‍💻",
    "🧑🏽‍💻",
    "👨🏿‍💻",
    "👩🏿‍💻",

    "🧑🏻‍🔬",
    "👩🏽‍🔬",
    "👨🏻‍🔬",
    "🧑🏿‍🔬",

    "🧑🏻‍🏫",
    "👩🏽‍🏫",
    "👨🏿‍🏫",
    "🧑🏽‍🏫",

    "🧑🏻‍🚀",
    "👩🏽‍🚀",
    "👨🏻‍🚀"

];


/* =========================================================
   ASSIGN AVATAR TO ALL STARTER STORIES
   ========================================================= */

STARTER_STORIES.forEach(function(story, index) {

    story.avatar =
        STARTER_AVATAR_POOL[
            (index * 7) %
            STARTER_AVATAR_POOL.length
        ];

});


/* =========================================================
   VALIDATION
   ========================================================= */

const SMA_STARTER_COUNT =
    STARTER_STORIES.filter(function(story) {
        return story.level === "SMA";
    }).length;


const KULIAH_STARTER_COUNT =
    STARTER_STORIES.filter(function(story) {
        return story.level === "Kuliah";
    }).length;


console.log(
    "FJIS Starter Stories:",
    STARTER_STORIES.length,
    "stories"
);


console.log(
    "FJIS Starter SMA:",
    SMA_STARTER_COUNT,
    "stories"
);


console.log(
    "FJIS Starter Kuliah:",
    KULIAH_STARTER_COUNT,
    "stories"
);


console.log(
    "FJIS Starter Avatars:",
    STARTER_AVATAR_POOL.length,
    "avatar variants"
);


console.log(
    "FJIS Starter Avatar Assignment: completed"
);


/* =========================================================
   GLOBAL EXPORT
   ========================================================= */

window.FJISStarterStories =
    STARTER_STORIES;


window.FJISStarterAvatarPool =
    STARTER_AVATAR_POOL;