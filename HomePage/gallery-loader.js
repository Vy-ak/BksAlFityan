document.addEventListener('DOMContentLoaded', () => {
  const INITIAL_LOAD = 48;
  const PRELOAD_MARGIN = '500px'; 
  const PLACEHOLDER =
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22/%3E';

  const allPins = Array.from(document.querySelectorAll('img.pin'));

  allPins.forEach((img, i) => {
    img.decoding = 'async';

    if (i >= INITIAL_LOAD) {
      img.dataset.src = img.src;
      img.src = PLACEHOLDER;
      img.classList.add('pin-deferred');
    }
  });

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
    allPins.forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.remove('pin-deferred');
      }
    });
  }

  const modalImg = document.getElementById('modalImage');
  const closeModalBtn = document.getElementById('modalClose');

  allPins.forEach(img => {
    img.addEventListener('click', function() {
      const imageSrc = this.dataset.src ? this.dataset.src : this.src;
      modalImg.src = imageSrc;
      modal.classList.add('show');
      
      document.body.style.overflow = 'hidden'; 
    });
  });

  function closeLightbox() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    setTimeout(() => { modalImg.src = ''; }, 300); 
  }

  closeModalBtn.addEventListener('click', closeLightbox);

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeLightbox();
    }
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeLightbox();
    }
  });
});