/**
 * gallery-loader.js
 * Elvore 2026 Yearbook - Gallery Performance Fix
 *
 * Apa yang dilakukan script ini:
 * 1. Load 48 foto pertama langsung (12 per kolom = ~3 baris awal)
 * 2. Sisanya hanya dimuat saat user scroll mendekati foto tersebut
 * 3. Semua img otomatis pakai async decoding supaya tidak block main thread
 */

document.addEventListener('DOMContentLoaded', () => {
  const INITIAL_LOAD = 48; // Jumlah foto yang langsung ditampilkan saat halaman buka
  const PRELOAD_MARGIN = '500px'; // Mulai load foto 500px sebelum masuk viewport

  // Placeholder 1x1 transparan (tidak akan tampil di layar)
  const PLACEHOLDER =
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22/%3E';

  const allPins = Array.from(document.querySelectorAll('img.pin'));

  // ─── Step 1: Setup semua foto ────────────────────────────────────────────
  allPins.forEach((img, i) => {
    // Async decoding mencegah browser "freeze" saat decode gambar
    img.decoding = 'async';

    if (i >= INITIAL_LOAD) {
      // Simpan src asli ke data-src, ganti src dengan placeholder
      img.dataset.src = img.src;
      img.src = PLACEHOLDER;
      img.classList.add('pin-deferred');
    }
  });

  // ─── Step 2: IntersectionObserver ────────────────────────────────────────
  // Memantau setiap foto deferred, load saat mendekati viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
            img.classList.remove('pin-deferred');
          }
          observer.unobserve(img);
        });
      },
      { rootMargin: PRELOAD_MARGIN }
    );

    allPins.forEach((img, i) => {
      if (i >= INITIAL_LOAD) observer.observe(img);
    });
  } else {
    // Fallback untuk browser lama: load semua langsung
    allPins.forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.remove('pin-deferred');
      }
    });
  }

  // ─── Step 3: Sidebar JS ──────────────────────────────────────────────────
  // Pastikan sidebar.js tetap jalan (tidak perlu ubah apapun di sidebar.js)
});
