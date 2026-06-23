document.addEventListener('DOMContentLoaded', () => {
  const INITIAL_LOAD = 48;
  const PRELOAD_MARGIN = '500px';
  const PLACEHOLDER =
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22/%3E';

  const grid = document.getElementById('pinterestGrid');
  const filterBar = document.getElementById('galleryFilters');
  const noResults = document.getElementById('noResults');
  const allPins = Array.from(document.querySelectorAll('img.pin'));

  allPins.forEach((img, i) => {
    img.decoding = 'async';

    if (i >= INITIAL_LOAD) {
      img.dataset.src = img.src;
      img.src = PLACEHOLDER;
      img.classList.add('pin-deferred');
    }
  });

  let observer = null;

  function observeImage(img) {
    if (img.dataset.src && observer) observer.observe(img);
  }

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
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
    allPins.forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.remove('pin-deferred');
      }
    });
  }

  if (filterBar) {
    const filterButtons = Array.from(filterBar.querySelectorAll('.filter-btn'));

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        let visibleCount = 0;

        allPins.forEach((img) => {
          const match = filter === 'all' || img.dataset.category === filter;
          img.classList.toggle('pin-hidden', !match);

          if (match) {
            visibleCount++;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              delete img.dataset.src;
              img.classList.remove('pin-deferred');
              if (observer) observer.unobserve(img);
            }
          }
        });

        if (noResults) noResults.classList.toggle('show', visibleCount === 0);

        if (window.innerWidth <= 768) {
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeModalBtn = document.getElementById('modalClose');

  allPins.forEach((img) => {
    img.addEventListener('click', function () {
      const imageSrc = this.dataset.src ? this.dataset.src : this.src;
      modalImg.src = imageSrc;
      modalImg.alt = this.alt || '';
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => {
      modalImg.src = '';
    }, 300);
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeLightbox);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeLightbox();
    }
  });
});