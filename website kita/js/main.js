/**
 * Love Story Website - Mas & Ade
 * Animasi: landing, floating hearts, scroll, lightbox, musik
 */

(function () {
  'use strict';

  const landing = document.getElementById('landing');
  const mainContent = document.getElementById('mainContent');
  const btnEnter = document.getElementById('btnEnter');
  const btnMusic = document.getElementById('btnMusic');
  const bgMusic = document.getElementById('bgMusic');
  const galeriGrid = document.getElementById('galeriGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const suratContent = document.getElementById('suratContent');
  const musicTracks = document.querySelectorAll('.music-track');
  const musicNowEl = document.getElementById('musicNow');
  const iconMusic = document.getElementById('iconMusic');
  const musicModal = document.getElementById('musicModal');
  const musicModalBackdrop = document.getElementById('musicModalBackdrop');
  const musicConfirmBtn = document.getElementById('musicConfirmBtn');
  const pageLinks = document.querySelectorAll('.page-link');
  const pageSections = document.querySelectorAll('.page-section');

  // ---------- Landing → Main ----------
  if (btnEnter && landing && mainContent) {
    document.body.classList.add('landing-open');
    btnEnter.addEventListener('click', function () {
      landing.classList.remove('active');
      mainContent.classList.add('visible');
      document.body.classList.remove('landing-open');
      document.body.style.overflow = '';
      showPage('pesan');
      startInitialMusicSelection();
      // Trigger animasi section setelah masuk
      setTimeout(initScrollAnimations, 100);
      setTimeout(createSectionHearts, 300);
    });
  }

  // ---------- Floating hearts ----------
  const HEART_SYMBOLS = ['❤️', '💕', '💗', '💖', '🌸', '✨'];

  function createHearts(container, count) {
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'heart-float';
      heart.textContent = HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)];
      // randomize position and animation for a lively, organic look
      heart.style.left = Math.random() * 100 + '%';
      heart.style.top = Math.random() * 100 + '%';
      heart.style.animationDelay = (Math.random() * 4) + 's';
      heart.style.animationDuration = (5 + Math.random() * 6) + 's';
      // vary size and opacity for depth
      const size = (0.9 + Math.random() * 1.6).toFixed(2) + 'rem';
      heart.style.fontSize = size;
      heart.style.opacity = (0.35 + Math.random() * 0.6).toFixed(2);
      heart.style.willChange = 'transform, opacity';
      container.appendChild(heart);
    }
  }

  // Hearts di landing (saat halaman load)
  const landingHearts = document.querySelector('.landing-hearts');
  if (landingHearts) createHearts(landingHearts, 12);

  // Hearts di section (setelah masuk main)
  function createSectionHearts() {
    document.querySelectorAll('.section-hearts').forEach(function (el) {
      if (el && !el.querySelector('.heart-float')) createHearts(el, 8);
    });
  }

  // ---------- GSAP Scroll Animations ----------
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      fadeInFallback();
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Section titles
    gsap.utils.toArray('.section-title').forEach(function (title) {
      gsap.from(title, {
        scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none reverse' },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out'
      });
    });

    // Pesan card paragraphs
    const pesanParagraphs = document.querySelectorAll('.pesan-card p');
    if (pesanParagraphs.length) {
      gsap.from(pesanParagraphs, {
        scrollTrigger: { trigger: '.pesan-card', start: 'top 80%', toggleActions: 'play none none reverse' },
        y: 15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: 'power2.out'
      });
    }

    // Surat (love letter) paragraphs - fade in
    const suratParagraphs = document.querySelectorAll('.surat-content p');
    if (suratParagraphs.length) {
      gsap.from(suratParagraphs, {
        scrollTrigger: { trigger: '.surat-box', start: 'top 75%', toggleActions: 'play none none reverse' },
        y: 12,
        opacity: 0,
        duration: 0.55,
        stagger: 0.15,
        ease: 'power2.out'
      });
    }

    // (Galeri dan sosial tampil penuh di tiap "halaman", jadi tanpa animasi scroll khusus)
  }

  // Fallback tanpa GSAP: fade in sederhana
  function fadeInFallback() {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.pesan-card p, .surat-content p').forEach(function (el) {
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  // ---------- Galeri: Carousel + Grid + Lightbox ----------
  const galeriCarouselWrap = document.getElementById('galeriCarouselWrap');
  const galeriCarouselTrack = document.getElementById('galeriCarouselTrack');
  const galeriGridWrap = document.getElementById('galeriGridWrap');
  const galeriCarouselDots = document.getElementById('galeriCarouselDots');

  const GALERI_PHOTOS = [
    { src: 'assets/foto 1.png', alt: 'Foto kita 1' },
    { src: 'assets/foto 2.png', alt: 'Foto kita 2' },
    { src: 'assets/foto 3.jpeg', alt: 'Foto kita 3' },
    { src: 'assets/foto 4.jpeg', alt: 'Foto kita 4' },
    { src: 'assets/foto 5.jpeg', alt: 'Foto kita 5' },
    { src: 'assets/foto 6.png', alt: 'Foto kita 6' }
  ];
  const GALERI_TOTAL = GALERI_PHOTOS.length;

  let galeriIndex = 0;

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Foto';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('lightbox-open');
  }

  function updateGaleriCarousel() {
    if (!galeriCarouselTrack) return;
    galeriCarouselTrack.style.transform = 'translateX(-' + (galeriIndex * 100) + '%)';
    if (galeriCarouselDots) {
      galeriCarouselDots.querySelectorAll('.galeri-carousel-dot').forEach(function (dot, i) {
        dot.classList.toggle('active', i === galeriIndex);
      });
    }
    if (galeriArrowLeft) {
      galeriArrowLeft.style.visibility = galeriIndex === 0 ? 'hidden' : 'visible';
    }
  }

  function switchToGaleriGrid() {
    if (!galeriCarouselWrap || !galeriGridWrap) return;
    galeriCarouselWrap.style.display = 'none';
    galeriGridWrap.style.display = 'block';
  }

  function buildGaleriDots() {
    if (!galeriCarouselDots) return;
    galeriCarouselDots.innerHTML = '';
    for (let i = 0; i < GALERI_TOTAL; i++) {
      const dot = document.createElement('span');
      dot.className = 'galeri-carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Foto ' + (i + 1));
      galeriCarouselDots.appendChild(dot);
    }
  }

  const galeriArrowLeft = document.getElementById('galeriArrowLeft');
  const galeriArrowRight = document.getElementById('galeriArrowRight');

  if (galeriCarouselTrack && galeriCarouselDots) {
    buildGaleriDots();
    updateGaleriCarousel();
  }

  if (galeriArrowLeft) {
    galeriArrowLeft.addEventListener('click', function (e) {
      e.stopPropagation();
      if (galeriIndex > 0) {
        galeriIndex--;
        updateGaleriCarousel();
      }
    });
  }

  if (galeriArrowRight) {
    galeriArrowRight.addEventListener('click', function (e) {
      e.stopPropagation();
      if (galeriIndex < GALERI_TOTAL - 1) {
        galeriIndex++;
        updateGaleriCarousel();
      } else if (galeriIndex === GALERI_TOTAL - 1) {
        switchToGaleriGrid();
      }
    });
  }

  galeriCarouselTrack && galeriCarouselTrack.addEventListener('click', function (e) {
    if (e.target.closest('.galeri-arrow')) return;
    const slide = e.target.closest('.galeri-carousel-slide');
    const img = slide ? slide.querySelector('img') : null;
    if (!img) return;
    e.preventDefault();
    openLightbox(img.src, img.alt);
  });

  if (galeriGrid && lightbox && lightboxImg) {
    galeriGrid.addEventListener('click', function (e) {
      const img = e.target.closest('.galeri-item img');
      if (!img) return;
      e.preventDefault();
      openLightbox(img.src, img.alt);
    });
  }

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      document.body.classList.remove('lightbox-open');
    }
  }

  // ---------- Video untuk Ade ----------
  const videoKita = document.getElementById('videoKita');
  const videoOverlay = document.getElementById('videoOverlay');
  const videoPlayBtn = document.getElementById('videoPlayBtn');
  const videoOverlayTextInitial = document.querySelector('.video-overlay-text-initial');
  const videoOverlayTextReplay = document.querySelector('.video-overlay-text-replay');

  // flag untuk tahu apakah musik sedang berjalan sebelum video mulai
  let wasMusicPlayingBeforeVideo = false;

  function startVideoWithTransition() {
    if (!videoKita || !videoOverlay || !videoPlayBtn) return;
    videoOverlay.classList.remove('hidden');
    videoOverlay.classList.add('video-overlay--exiting');
    videoKita.classList.add('video-player--entering');
    videoOverlay.addEventListener('animationend', function onExit() {
      videoOverlay.removeEventListener('animationend', onExit);
      videoOverlay.classList.remove('video-overlay--exiting');
      videoOverlay.classList.add('hidden');
      videoKita.classList.remove('video-player--entering');
      videoKita.currentTime = 0;
      videoKita.play();
      // jika musik latar sedang dimainkan, hentikan agar tidak tumpang tindih
      if (bgMusic && !bgMusic.paused) {
        wasMusicPlayingBeforeVideo = true;
        pauseMusic();
      }
    }, { once: true });
  }

  function showVideoReplayOverlay() {
    if (!videoOverlay || !videoOverlayTextInitial || !videoOverlayTextReplay) return;
    videoOverlayTextInitial.style.display = 'none';
    videoOverlayTextReplay.style.display = '';
    videoOverlay.classList.remove('hidden');
  }

  if (videoKita && videoOverlay && videoPlayBtn) {
    videoPlayBtn.addEventListener('click', startVideoWithTransition);
    videoKita.addEventListener('ended', function () {
      showVideoReplayOverlay();
      // setelah video usai, jika musik sebelumnya dimainkan, lanjutkan lagi
      if (wasMusicPlayingBeforeVideo) {
        playMusic();
        wasMusicPlayingBeforeVideo = false;
      }
    });
    // hentikan musik saat video mulai (misalnya replay manual tanpa overlay)
    videoKita.addEventListener('play', function () {
      if (bgMusic && !bgMusic.paused) {
        wasMusicPlayingBeforeVideo = true;
        pauseMusic();
      }
    });
    // kalau video dijeda sebelum selesai, juga lanjutkan musik bila perlu
    videoKita.addEventListener('pause', function () {
      if (wasMusicPlayingBeforeVideo) {
        playMusic();
        wasMusicPlayingBeforeVideo = false;
      }
    });
  }

  // ---------- Background Music ----------
  // Dua lagu di panel; saat ade pilih judul, musik mulai dari ref (data-start).
  let currentTrackEl = null;
  let currentSrcKey = '';
  let hasChosenInitialTrack = false;
  let isInInitialMusicFlow = false;
  let audioGainNode = null;
  let audioContext = null;

  function setupAudioGain() {
    if (!bgMusic || audioGainNode) return;
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaElementSource(bgMusic);
      audioGainNode = audioContext.createGain();
      source.connect(audioGainNode);
      audioGainNode.connect(audioContext.destination);
    } catch (e) {}
  }

  function setAudioGain(gain) {
    if (!audioGainNode) return;
    audioGainNode.gain.value = Math.min(Math.max(gain, 0), 3);
  }

  function startInitialMusicSelection() {
    if (!musicModal || !musicTracks.length) return;
    isInInitialMusicFlow = true;
    openMusicModal();
  }

  function updateMusicUI(playing, trackLabel) {
    if (btnMusic) {
      if (iconMusic) iconMusic.textContent = playing ? '⏸' : '🎵';
      const label = btnMusic.querySelector('.label-music');
      if (label) label.textContent = playing ? 'Jeda' : 'Musik';
    }
    if (musicNowEl) {
      musicNowEl.textContent = playing && trackLabel ? 'Sedang diputar: ' + trackLabel : '';
      musicNowEl.classList.toggle('visible', Boolean(playing && trackLabel));
    }
  }

  function getTrackLabel(el) {
    return (el && el.dataset.label) ? el.dataset.label : '';
  }

  function playMusic() {
    if (!bgMusic || !btnMusic) return;
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    bgMusic.play().then(function () {
      btnMusic.classList.add('playing');
      updateMusicUI(true, getTrackLabel(currentTrackEl));
    }).catch(function () {
      updateMusicUI(false);
      const label = btnMusic.querySelector('.label-music');
      if (label) label.textContent = 'Putar';
    });
  }

  function pauseMusic() {
    if (!bgMusic || !btnMusic) return;
    bgMusic.pause();
    btnMusic.classList.remove('playing');
    updateMusicUI(false);
  }

  function setTrack(trackEl, autoplayFromChorus) {
    if (!trackEl || !bgMusic) return;
    const src = trackEl.dataset.src;
    const start = parseFloat(trackEl.dataset.start || '0');
    const gain = parseFloat(trackEl.dataset.gain || '1');
    if (!src) return;

    if (!audioGainNode) setupAudioGain();
    setAudioGain(gain);

    currentTrackEl = trackEl;
    musicTracks.forEach(function (btn) {
      btn.classList.toggle('active', btn === trackEl);
      const icon = btn.querySelector('.music-track-icon');
      if (icon) icon.textContent = btn === trackEl ? '❤️' : '🎵';
    });

    const srcKey = src + '|' + start;
    const needsNewSrc = srcKey !== currentSrcKey;
    currentSrcKey = srcKey;

    function seekAndMaybePlay() {
      if (!isNaN(start) && start > 0) {
        try {
          bgMusic.currentTime = start;
        } catch (e) {}
      }
      if (autoplayFromChorus) {
        playMusic();
      } else {
        updateMusicUI(false);
      }
    }

    if (needsNewSrc) {
      bgMusic.src = src;
      bgMusic.load();
      const onLoaded = function () {
        bgMusic.removeEventListener('loadedmetadata', onLoaded);
        seekAndMaybePlay();
      };
      bgMusic.addEventListener('loadedmetadata', onLoaded);
    } else if (autoplayFromChorus) {
      seekAndMaybePlay();
    }
  }

  if (musicTracks.length && bgMusic) {
    musicTracks.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTrack(btn, true);
      });
    });
    const activeTrack = document.querySelector('.music-track.active');
    if (activeTrack) {
      const icon = activeTrack.querySelector('.music-track-icon');
      if (icon) icon.textContent = '❤️';
      currentTrackEl = activeTrack;
    }
  }

  if (musicConfirmBtn && bgMusic) {
    musicConfirmBtn.addEventListener('click', function () {
      if (!currentTrackEl) return;
      setTrack(currentTrackEl, true);
      hasChosenInitialTrack = true;
      isInInitialMusicFlow = false;
      closeMusicModal();
    });
  }

  function openMusicModal() {
    if (musicModal) {
      musicModal.classList.add('active');
      musicModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMusicModal() {
    if (isInInitialMusicFlow && !hasChosenInitialTrack) {
      return;
    }
    if (musicModal) {
      musicModal.classList.remove('active');
      musicModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (btnMusic && bgMusic) {
    btnMusic.addEventListener('click', function () {
      if (musicModal && musicModal.classList.contains('active')) {
        if (isInInitialMusicFlow && !hasChosenInitialTrack) {
          return;
        }
        closeMusicModal();
        return;
      }
      if (!bgMusic.paused) {
        pauseMusic();
        return;
      }
      openMusicModal();
    });
  }

  if (musicModalBackdrop) {
    musicModalBackdrop.addEventListener('click', function () {
      closeMusicModal();
    });
  }

  // Sinkronkan icon nav saat lagu selesai (ended) atau pause dari luar
  if (bgMusic) {
    bgMusic.addEventListener('pause', function () {
      if (!bgMusic.paused) return;
      btnMusic.classList.remove('playing');
      updateMusicUI(false);
    });
    bgMusic.addEventListener('play', function () {
      btnMusic.classList.add('playing');
      updateMusicUI(true, getTrackLabel(currentTrackEl));
    });
  }

  // ---------- Navigasi antar "halaman" ----------

  // ---------- Fitur pembacaan suara (Pembukaan & Surat) ----------
  const btnRead = document.getElementById('btnRead');
  const audioPembukaan = document.getElementById('audioPembukaan');
  const btnReadSurat = document.getElementById('btnReadSurat');
  const audioSurat = document.getElementById('audioSurat');

  let wasMusicPlayingBeforeAudio = false;

  function getIdleReadLabel(btn) {
    if (!btn) return 'Mas bacain ya sayang';
    const initialLabel = btn.dataset.initialLabel || 'Mas bacain ya sayang';
    const replayLabel = btn.dataset.replayLabel || initialLabel;
    return btn.dataset.hasCompleted === '1' ? replayLabel : initialLabel;
  }

  function setupAudioButton(btn, audio, labels) {
    if (!btn || !audio) return;
    const initialLabel = (labels && labels.initialLabel) ? labels.initialLabel : 'Mas bacain ya sayang';
    const replayLabel = (labels && labels.replayLabel) ? labels.replayLabel : initialLabel;
    const initiallyCompleted = Boolean(labels && labels.initiallyCompleted);

    btn.dataset.initialLabel = initialLabel;
    btn.dataset.replayLabel = replayLabel;
    btn.dataset.hasCompleted = initiallyCompleted ? '1' : '0';
    btn.textContent = getIdleReadLabel(btn);

    btn.addEventListener('click', function () {
      if (audio.paused) {
        if (audioPembukaan && audioPembukaan !== audio && !audioPembukaan.paused) {
          audioPembukaan.pause();
        }
        if (audioSurat && audioSurat !== audio && !audioSurat.paused) {
          audioSurat.pause();
        }
        if (bgMusic && !bgMusic.paused) {
          wasMusicPlayingBeforeAudio = true;
          pauseMusic();
        }
        audio.currentTime = 0;
        audio.play();
        btn.classList.add('playing');
        btn.textContent = 'Sedang dibacakan...';
      } else {
        audio.pause();
        btn.classList.remove('playing');
        btn.textContent = getIdleReadLabel(btn);
      }
    });
    audio.addEventListener('ended', function () {
      btn.classList.remove('playing');
      btn.dataset.hasCompleted = '1';
      btn.textContent = getIdleReadLabel(btn);
      if (wasMusicPlayingBeforeAudio) {
        playMusic();
        wasMusicPlayingBeforeAudio = false;
      }
    });
  }

  setupAudioButton(btnRead, audioPembukaan, {
    initialLabel: 'Mas bacain ya sayang',
    replayLabel: 'Mas bacain lagi ya',
    initiallyCompleted: false
  });
  setupAudioButton(btnReadSurat, audioSurat, {
    initialLabel: 'Mas bacain lagi ya',
    replayLabel: 'Mas bacain lagi ya',
    initiallyCompleted: true
  });

  function showPage(id) {
    // stop pembacaan audio jika berpindah halaman
    if (audioPembukaan && !audioPembukaan.paused) {
      audioPembukaan.pause();
      const btn = document.getElementById('btnRead');
      if (btn) {
        btn.classList.remove('playing');
        btn.textContent = getIdleReadLabel(btn);
      }
    }
    if (audioSurat && !audioSurat.paused) {
      audioSurat.pause();
      const btn = document.getElementById('btnReadSurat');
      if (btn) {
        btn.classList.remove('playing');
        btn.textContent = getIdleReadLabel(btn);
      }
    }
    if (!pageSections.length) return;
    pageSections.forEach(function (sec) {
      sec.classList.toggle('active-page', sec.id === id);
    });
    pageLinks.forEach(function (btn) {
      const target = btn.getAttribute('data-page-target');
      btn.classList.toggle('active', target === id);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (pageLinks.length && pageSections.length) {
    pageLinks.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = btn.getAttribute('data-page-target');
        if (target) showPage(target);
      });
    });
    // Default page jika user langsung masuk tanpa landing
    const anyActive = document.querySelector('.page-section.active-page');
    if (!anyActive) {
      showPage('pesan');
    }
  }

  // Prevent body scroll saat landing aktif
  if (landing && landing.classList.contains('active')) {
    document.body.classList.add('landing-open');
  }
})();
