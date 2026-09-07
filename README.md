<p align="center">
  <img src="https://raw.githubusercontent.com/expo/expo/main/templates/expo-template-blank/assets/icon.png" width="100" alt="QuitTogether Logo"/>
</p>

<h1 align="center">🚭 QuitTogether App</h1>

<p align="center">
  <b>Aplikasi Mobile Pelacak Kebiasaan Berhenti Merokok Berbasis Pendampingan Kolaboratif & Gamifikasi Interaktif</b>
</p>

<p align="center">
  <a href="https://reactnative.dev/"><img src="https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native" /></a>
  <a href="https://expo.dev/"><img src="https://img.shields.io/badge/Expo-SDK%2054-000000?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK 54" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/NativeWind-Tailwind%20CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="NativeWind" /></a>
  <img src="https://img.shields.io/badge/SUS%20Score-72.88%20(Good)-4CAF50?style=for-the-badge" alt="SUS Score" />
</p>

---

## 📌 Daftar Isi

* [📖 Tentang Proyek](#-tentang-proyek)
* [🎯 Tujuan Proyek](#-tujuan-proyek)
* [✨ Fitur Utama](#-fitur-utama)
* [🛠️ Teknologi & Tech Stack](#️-teknologi--tech-stack)
* [📁 Struktur Proyek](#-struktur-proyek)
* [🚀 Panduan Memulai](#-panduan-memulai-getting-started)

  * [1. Prasyarat](#1-prasyarat)
  * [2. Clone Repository](#2-clone-repository)
  * [3. Pengaturan Variabel Lingkungan](#3-pengaturan-variabel-lingkungan-env)
  * [4. Instalasi Dependensi](#4-instalasi-dependensi)
  * [5. Menjalankan Aplikasi](#5-menjalankan-aplikasi)
* [🗄️ Skema Database](#️-skema-database-firebase-firestore)
* [📊 Pengujian Pengguna](#-pengujian-pengguna-uat--sus)
* [👥 Tim Pengembang](#-tim-pengembang)
* [📜 Lisensi](#-lisensi)

---

## 📖 Tentang Proyek

**QuitTogether** adalah aplikasi mobile yang dirancang untuk membantu individu dalam proses berhenti merokok melalui kombinasi **habit tracking, dukungan sosial, craving management, dan gamifikasi**.

Berbeda dengan aplikasi berhenti merokok yang hanya berfokus pada perkembangan individu, QuitTogether menggunakan pendekatan **Dual-Role System**, yaitu mempertemukan pengguna yang sedang berhenti merokok (**Smoker**) dengan orang terdekat yang berperan sebagai pendamping (**Companion**).

Melalui sistem ini, proses berhenti merokok tidak dilakukan secara sendirian. Companion dapat memantau perkembangan Smoker dan memberikan dukungan secara berkala, sementara Smoker dapat mencatat craving, melihat perkembangan, serta memperoleh motivasi melalui sistem gamifikasi.

### 🌟 Konsep Utama

QuitTogether menggabungkan tiga pendekatan utama:

**🤝 Social Support**

Memberikan ruang bagi pengguna untuk mendapatkan dukungan dari pasangan, teman, keluarga, atau orang terdekat selama proses berhenti merokok.

**📊 Habit & Progress Tracking**

Mencatat perkembangan pengguna secara terukur, termasuk waktu bebas rokok, jumlah rokok yang berhasil dihindari, dan estimasi uang yang berhasil dihemat.

**🌳 Gamification**

Mengubah proses berhenti merokok menjadi pengalaman yang lebih interaktif melalui sistem **Promise Tree** dan **Water Points**.

---

## 🎯 Tujuan Proyek

QuitTogether dikembangkan dengan beberapa tujuan utama:

1. Membantu pengguna memantau perkembangan proses berhenti merokok secara lebih terstruktur.
2. Memberikan dukungan sosial melalui sistem **Smoker–Companion**.
3. Membantu pengguna mengenali dan menghadapi situasi yang memicu craving.
4. Meningkatkan motivasi pengguna melalui elemen gamifikasi.
5. Menyediakan data perkembangan yang dapat digunakan untuk melakukan evaluasi terhadap kebiasaan merokok.
6. Menciptakan pengalaman berhenti merokok yang lebih interaktif, personal, dan kolaboratif.

---

## ✨ Fitur Utama

### 1. 👥 Dual-Role System

QuitTogether memiliki dua jenis pengguna:

#### 🚭 Smoker

Pengguna yang sedang menjalani proses berhenti merokok.

Fitur utama:

* Melihat *clean streak*
* Melihat waktu sejak berhenti merokok
* Mencatat craving
* Mengikuti proses *craving coping*
* Mengembangkan Promise Tree
* Melihat statistik perkembangan
* Menghubungkan akun dengan Companion

#### 🤝 Companion

Orang yang memberikan dukungan kepada Smoker.

Fitur utama:

* Memantau perkembangan Smoker
* Melihat *clean streak*
* Melihat waktu bebas rokok
* Melihat jumlah rokok yang berhasil dihindari
* Melihat uang yang berhasil dihemat
* Melihat aktivitas craving terbaru

---

### 2. ⏱️ Habit & Financial Tracker

QuitTogether secara otomatis menghitung perkembangan pengguna berdasarkan data awal yang diberikan.

Data yang ditampilkan meliputi:

* **Time Since Quit** — waktu sejak pengguna berhenti merokok
* **Cigarettes Avoided** — estimasi jumlah rokok yang berhasil dihindari
* **Money Saved** — estimasi uang yang berhasil dihemat
* **Clean Streak** — jumlah hari bebas rokok

Informasi tersebut diperbarui berdasarkan waktu dan data pengguna.

---

### 3. 🧘 Craving Coping Mechanism

Ketika pengguna mengalami keinginan untuk merokok, QuitTogether menyediakan **Craving Window**, yaitu alur interaktif yang membantu pengguna melewati periode craving.

Proses ini terdiri dari beberapa tahap untuk membantu pengguna:

1. Mengenali craving
2. Mengidentifikasi pemicu
3. Memilih strategi coping
4. Menjalani proses penanganan craving
5. Menentukan hasil akhir
6. Mencatat hasil ke dalam sistem

Hasil akhir craving dicatat sebagai:

* ✅ **Survived**
* 🔄 **Relapsed**

Data tersebut kemudian dapat digunakan untuk melihat pola dan perkembangan kebiasaan pengguna.

---

### 4. 🌳 Promise Tree

**Promise Tree** merupakan elemen gamifikasi utama dalam QuitTogether.

Pohon akan berkembang berdasarkan **Water Points** yang diperoleh pengguna melalui aktivitas dalam aplikasi.

Sistem poin:

| Aktivitas                     | Water Points |
| ----------------------------- | -----------: |
| Successfully survived craving |          +50 |
| Relapsed                      |          +15 |

Meskipun relapse tetap memberikan poin, jumlah poin yang lebih kecil digunakan sebagai bentuk **positive reinforcement**, sehingga pengguna tetap terdorong untuk melanjutkan proses tanpa merasa gagal sepenuhnya.

Promise Tree memiliki **6 tahap pertumbuhan** yang merepresentasikan perkembangan pengguna.

---

### 5. 📊 Statistics & Analytics

QuitTogether menyediakan halaman statistik untuk membantu pengguna memahami perkembangan mereka.

Informasi yang dapat ditampilkan meliputi:

* Riwayat craving
* Riwayat kebiasaan harian
* Clean streak
* Longest streak
* Persentase keberhasilan
* Perkembangan bulanan
* Jumlah rokok yang dihindari
* Estimasi uang yang dihemat

Visualisasi ini membantu pengguna melihat perkembangan secara lebih konkret.

---

## 🛠️ Teknologi & Tech Stack

| Kategori                 | Teknologi                 | Deskripsi                                                      |
| :----------------------- | :------------------------ | :------------------------------------------------------------- |
| **Mobile Framework**     | React Native 0.81.5       | Framework utama untuk membangun aplikasi mobile cross-platform |
| **Development Platform** | Expo SDK 54               | Tooling dan ecosystem untuk pengembangan React Native          |
| **Programming Language** | TypeScript 5.9.2          | Bahasa pemrograman utama dengan static typing                  |
| **Styling**              | NativeWind / Tailwind CSS | Utility-first styling untuk React Native                       |
| **Backend**              | Firebase                  | Backend service untuk authentication dan database              |
| **Authentication**       | Firebase Authentication   | Mengelola autentikasi pengguna                                 |
| **Database**             | Cloud Firestore           | Menyimpan data pengguna dan aktivitas aplikasi                 |
| **Local Storage**        | AsyncStorage              | Menyimpan state dan data lokal tertentu                        |
| **Graphics**             | React Native SVG          | Digunakan untuk visualisasi Promise Tree                       |

---

## 📁 Struktur Proyek

```text
QuitTogether/
│
├── quit-together-app/
│   │
│   ├── assets/
│   │   └── # Asset gambar, ikon, dan splash screen
│   │
│   ├── docs/
│   │   └── Laporan_Sprint_dan_UAT.md
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── craving/
│   │   │   │   └── CravingModal.tsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   └── ScreenWrapper.tsx
│   │   │   │
│   │   │   └── tree/
│   │   │       └── PohonJanji.tsx
│   │   │
│   │   ├── firebase/
│   │   │   └── config.ts
│   │   │
│   │   ├── navigation/
│   │   │   ├── RootNavigator.tsx
│   │   │   ├── SmokerTabs.tsx
│   │   │   └── CompanionTabs.tsx
│   │   │
│   │   └── screens/
│   │       │
│   │       ├── auth/
│   │       │   ├── LoginScreen.tsx
│   │       │   └── RegisterScreen.tsx
│   │       │
│   │       ├── onboarding/
│   │       │   └── ...
│   │       │
│   │       ├── smoker/
│   │       │   ├── HomeScreen.tsx
│   │       │   ├── StatisticsScreen.tsx
│   │       │   ├── CompanionScreen.tsx
│   │       │   └── ProfileScreen.tsx
│   │       │
│   │       └── companion/
│   │           ├── DashboardScreen.tsx
│   │           └── ProfileScreen.tsx
│   │
│   ├── .env
│   ├── app.json
│   ├── App.tsx
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

# 🚀 Panduan Memulai (Getting Started)

## 1. Prasyarat

Pastikan environment pengembangan telah terpasang:

* **Node.js** versi LTS 18.x atau lebih baru
* **npm** atau **yarn**
* **Git**
* **Expo Go** pada smartphone Android/iOS

### Alternatif

Untuk menjalankan aplikasi menggunakan emulator:

* **Android Studio** untuk Android Emulator
* **Xcode** untuk iOS Simulator *(macOS diperlukan)*

---

## 2. Clone Repository

Clone repository menggunakan Git:

```bash
git clone https://github.com/lynxangels/QuitTogether.git
```

Masuk ke direktori aplikasi:

```bash
cd QuitTogether/quit-together-app
```

---

## 3. Pengaturan Variabel Lingkungan (.env)

Buat file `.env` di dalam direktori:

```text
QuitTogether/quit-together-app/.env
```

Kemudian masukkan konfigurasi Firebase:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> **⚠️ Important:** Jangan mengunggah file `.env` yang berisi konfigurasi atau credentials sensitif ke repository publik.

Pastikan `.env` telah dimasukkan ke dalam `.gitignore`:

```gitignore
.env
.env.local
```

---

## 4. Instalasi Dependensi

Setelah berada di dalam direktori aplikasi, jalankan:

```bash
npm install
```

Perintah tersebut akan menginstal seluruh dependency yang dibutuhkan oleh aplikasi.

---

## 5. Menjalankan Aplikasi

Jalankan Expo development server:

```bash
npm start
```

Setelah server berjalan, QR code akan muncul pada terminal.

### 📱 Android / iOS — Expo Go

1. Install **Expo Go** pada smartphone.
2. Pastikan smartphone dan komputer berada pada jaringan yang sama.
3. Scan QR code yang muncul pada terminal.
4. Aplikasi akan terbuka melalui Expo Go.

### 🤖 Android Emulator

Pastikan Android Emulator telah berjalan, kemudian tekan:

```text
a
```

pada terminal Expo.

### 🍎 iOS Simulator

Pada macOS dengan Xcode terpasang, tekan:

```text
i
```

pada terminal Expo.

---

# 🗄️ Skema Database (Firebase Cloud Firestore)

QuitTogether menggunakan arsitektur **Flat NoSQL Document** menggunakan Firebase Cloud Firestore.

Struktur collection utama:

### `users`

Menyimpan informasi dasar pengguna.

```text
users/
└── {uid}
    ├── uid
    ├── email
    ├── role
    └── createdAt
```

---

### `smokerProfiles`

Menyimpan informasi dan konfigurasi profil pengguna Smoker.

```text
smokerProfiles/
└── {userId}
    ├── userId
    ├── quitStartDate
    ├── cigsPerDay
    ├── packPrice
    ├── cigsPerPack
    ├── companionCode
    ├── waterPoints
    └── treeStage
```

---

### `companionLinks`

Menyimpan hubungan antara Smoker dan Companion.

```text
companionLinks/
└── {linkId}
    ├── smokerId
    ├── companionId
    └── linkedAt
```

---

### `cravingLogs`

Menyimpan riwayat craving pengguna.

```text
cravingLogs/
└── {logId}
    ├── logId
    ├── smokerId
    ├── status
    ├── triggers
    ├── copingUsed
    └── createdAt
```

### 🔗 Relasi Sederhana

```text
                ┌──────────────┐
                │    users     │
                └──────┬───────┘
                       │
             ┌─────────┴─────────┐
             │                   │
        ┌────▼─────┐       ┌─────▼────┐
        │  Smoker  │       │ Companion │
        └────┬─────┘       └─────┬────┘
             │                   │
             └───────┬───────────┘
                     │
             ┌───────▼────────┐
             │ companionLinks │
             └────────────────┘

        Smoker
           │
     ┌─────┴──────────┐
     │                │
┌────▼────────┐ ┌─────▼──────────┐
│smokerProfile│ │  cravingLogs   │
└─────────────┘ └────────────────┘
```

---

# 📊 Pengujian Pengguna (UAT & SUS)

User Acceptance Testing (**UAT**) QuitTogether telah dilaksanakan pada:

**📅 8 Juni 2026**

dengan melibatkan:

**👥 20 responden**

Evaluasi usability dilakukan menggunakan metode **System Usability Scale (SUS)**.

## 🏆 Final SUS Score

<p align="center">
  <h2 align="center">72.88</h2>
  <p align="center"><b>Kategori: GOOD / BAIK</b></p>
</p>

Hasil tersebut menunjukkan bahwa aplikasi memperoleh tingkat usability yang baik berdasarkan evaluasi pengguna.

### 📈 Highlight Hasil Evaluasi

| Aspek                                      |       Skor      | Interpretasi                                                                               |
| :----------------------------------------- | :-------------: | :----------------------------------------------------------------------------------------- |
| **Kemudahan Penggunaan (Q3)**              | **4.05 / 5.00** | Menjadi aspek dengan skor tertinggi dan menunjukkan bahwa interface relatif mudah dipahami |
| **Kejelasan Integrasi Fitur (Q5)**         | **3.95 / 5.00** | Menunjukkan bahwa integrasi dan hubungan antarfitur dapat dipahami pengguna                |
| **Tingkat Kepercayaan Diri Pengguna (Q9)** | **3.90 / 5.00** | Menunjukkan tingkat kenyamanan dan kepercayaan pengguna dalam menggunakan aplikasi         |

### 💡 Kesimpulan UAT

Berdasarkan hasil pengujian, QuitTogether memperoleh **SUS Score sebesar 72.88** dan berada dalam kategori **GOOD**.

Hasil ini menunjukkan bahwa aplikasi telah memiliki tingkat usability yang baik dan dapat digunakan oleh pengguna untuk menjalankan fungsi utama yang tersedia.

---

# 👥 Tim Pengembang

**QuitTogether Team — 2026**

Project ini dikembangkan sebagai bagian dari mata kuliah:

> **Rekayasa Perangkat Lunak (Software Engineering)**

Fokus utama proyek:

**Mobile Application Development · Software Engineering · Firebase · Gamification · Collaborative Support**

---

# 📜 Lisensi

Copyright © 2026 **Tim QuitTogether**.

QuitTogether dikembangkan sebagai bagian dari proyek akademik **Rekayasa Perangkat Lunak (Software Engineering)**.

---

<p align="center">
  🚭 <b>QuitTogether — You Don't Have to Quit Alone.</b> 🤝
</p>
