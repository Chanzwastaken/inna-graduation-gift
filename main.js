// Main JS logic for Inna Amelia's Graduation Website

document.addEventListener('DOMContentLoaded', () => {
  setupLoadingScreen();
  setupConfetti();
  setupMouseSparkles();
  setupSakuraFall();
  setupScrollReveal();
  setupEnvelope();
  setupGalleryModal();
  setupQuoteCarousel();
  setupCatPlayground();
  setupBgMusic();
});

/* ==========================================================================
   1. LOADING SCREEN
   ========================================================================== */
function setupLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const progressBar = document.getElementById('progress-bar');
  if (!loadingScreen || !progressBar) return;

  let progress = 0;
  let dismissed = false;

  function dismissLoading() {
    if (dismissed) return;
    dismissed = true;

    loadingScreen.style.opacity = '0';
    loadingScreen.style.pointerEvents = 'none';

    // Completely remove from rendering after fade-out transition (0.8s)
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      triggerConfetti(100);
    }, 900);
  }

  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      progressBar.style.width = '100%';
      clearInterval(interval);
      setTimeout(dismissLoading, 500);
      return;
    }
    progressBar.style.width = `${progress}%`;
  }, 100);

  // Hard fallback: dismiss after 4 seconds regardless of interval state
  setTimeout(() => {
    if (!dismissed) {
      clearInterval(interval);
      progressBar.style.width = '100%';
      dismissLoading();
    }
  }, 4000);
}

/* ==========================================================================
   2. CONFETTI EFFECT
   ========================================================================== */
let triggerConfetti = () => {}; // global hook to trigger manually

function setupConfetti() {
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = ['#FFD6E7', '#FFC0CB', '#FFB7D5', '#FF69B4', '#FF85A2', '#FFF5F8'];
  let particles = [];

  class Particle {
    constructor(x, y, isExplosion = false) {
      this.x = x;
      this.y = y;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.size = Math.random() * 8 + 4;
      this.shape = Math.random() > 0.5 ? 'circle' : 'rect';
      
      if (isExplosion) {
        // Burst outwards
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 2; // Upwards bias
      } else {
        // Regular drift down
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 3 + 2;
      }
      
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 4 - 2;
      this.opacity = 1;
      this.fade = Math.random() * 0.015 + 0.005;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.08; // Gravity
      this.vx *= 0.99; // Air resistance
      this.rotation += this.rotationSpeed;
      this.opacity -= this.fade;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;

      if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      }
      ctx.restore();
    }
  }

  // Exposed trigger function
  triggerConfetti = function(count = 50, fromBottom = false) {
    if (fromBottom) {
      // Shoot from bottom corners
      for (let i = 0; i < count / 2; i++) {
        // Left corner shooting right
        const p1 = new Particle(0, height);
        p1.vx = Math.random() * 8 + 5;
        p1.vy = -(Math.random() * 12 + 8);
        particles.push(p1);

        // Right corner shooting left
        const p2 = new Particle(width, height);
        p2.vx = -(Math.random() * 8 + 5);
        p2.vy = -(Math.random() * 12 + 8);
        particles.push(p2);
      }
    } else {
      // Explode from random screen center positions
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(width / 2, height / 3, true));
      }
    }
  };

  // Click event on Hero Button
  const openBtn = document.getElementById('open-special-btn');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      triggerConfetti(120);
      const greetingSection = document.getElementById('greeting-section');
      if (greetingSection) {
        greetingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Click event on Replay Button
  const replayBtn = document.getElementById('replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Reset Letter Envelope
      const envelope = document.getElementById('envelope');
      if (envelope) envelope.classList.remove('open');

      // Re-trigger confetti after scroll starts
      setTimeout(() => {
        triggerConfetti(100);
      }, 500);
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles = particles.filter(p => p.opacity > 0);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  
  animate();
}

/* ==========================================================================
   3. MOUSE SPARKLES EFFECT
   ========================================================================== */
function setupMouseSparkles() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let sparkles = [];

  class Sparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 2;
      this.color = `hsl(${Math.random() * 40 + 330}, 100%, 80%)`; // Pastel pink/rose shades
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5 - 0.5; // slight upward drift
      this.opacity = 1;
      this.decay = Math.random() * 0.02 + 0.015;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.opacity -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      
      // Draw standard star shape
      ctx.beginPath();
      const spikes = 4;
      const outerRadius = this.size;
      const innerRadius = this.size / 2;
      let rot = (Math.PI / 2) * 3;
      let x = this.x;
      let y = this.y;
      let step = Math.PI / spikes;

      ctx.moveTo(this.x, this.y - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = this.x + Math.cos(rot) * outerRadius;
        y = this.y + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = this.x + Math.cos(rot) * innerRadius;
        y = this.y + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(this.x, this.y - outerRadius);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  window.addEventListener('mousemove', (e) => {
    // Only spawn occasionally to avoid cluttering
    if (Math.random() < 0.3) {
      sparkles.push(new Sparkle(e.clientX, e.clientY));
    }
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);
    sparkles = sparkles.filter(s => s.opacity > 0);
    sparkles.forEach(s => {
      s.update();
      s.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   4. SAKURA PETAL FALL
   ========================================================================== */
function setupSakuraFall() {
  const container = document.getElementById('sakura-container');
  if (!container) return;

  const count = 15;
  for (let i = 0; i < count; i++) {
    createPetal(container);
  }
}

function createPetal(container) {
  const petal = document.createElement('div');
  petal.classList.add('sakura-petal');
  
  // Random configurations
  const size = Math.random() * 8 + 6;
  const left = Math.random() * 100;
  const duration = Math.random() * 6 + 4;
  const delay = Math.random() * 5;
  
  petal.style.width = `${size}px`;
  petal.style.height = `${size * 1.3}px`;
  petal.style.left = `${left}%`;
  petal.style.animationDuration = `${duration}s`;
  petal.style.animationDelay = `-${delay}s`;
  
  // Keep cycling petals
  petal.addEventListener('animationiteration', () => {
    petal.style.left = `${Math.random() * 100}%`;
  });

  container.appendChild(petal);
}

/* ==========================================================================
   5. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function setupScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Trigger specific confetti burst if intersecting final section
        if (entry.target.id === 'final-section') {
          triggerConfetti(60, true);
        }
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
  timelineItems.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. SECRET ENVELOPE ANIMATION
   ========================================================================== */
function setupEnvelope() {
  const envelope = document.getElementById('envelope');
  const openBtn = document.getElementById('open-envelope-btn');
  const closeBtn = document.getElementById('close-letter-btn');

  if (!envelope) return;

  function toggleOpen(e) {
    e.stopPropagation();
    envelope.classList.toggle('open');
  }

  envelope.addEventListener('click', toggleOpen);
  if (openBtn) openBtn.addEventListener('click', toggleOpen);

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid re-triggering open
      envelope.classList.remove('open');
    });
  }
}

/* ==========================================================================
   7. GALLERY & POLAROID MODAL POPUP
   ========================================================================== */
function setupGalleryModal() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const polaroidItems = document.querySelectorAll('.polaroid-card');
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modal) return;

  function openModal(imgSrc, captionText) {
    if (modalImg) {
      modalImg.src = imgSrc;
      modalCaption.textContent = captionText;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      const text = item.querySelector('.gallery-text');
      if (img) openModal(img.src, text ? text.textContent : '');
    });
  });

  polaroidItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.polaroid-img');
      const text = item.querySelector('.polaroid-caption');
      if (img) openModal(img.src, text ? text.textContent : '');
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Support escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. QUOTES CAROUSEL
   ========================================================================== */
function setupQuoteCarousel() {
  const slides = document.querySelectorAll('.quote-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval;

  if (slides.length === 0) return;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (index + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startSlideshow() {
    slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 4500);
  }

  function resetSlideshow() {
    clearInterval(slideInterval);
    startSlideshow();
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetSlideshow();
    });
  });

  startSlideshow();
}

/* ==========================================================================
   9. INTERACTIVE CAT PLAYGROUND
   ========================================================================== */
function setupCatPlayground() {
  const container = document.getElementById('interactive-cat-container');
  const counterSpan = document.getElementById('hug-counter');
  const bubble = document.getElementById('meow-bubble');
  
  if (!container || !counterSpan) return;

  // Retrieve counter from localStorage or default to 0
  let hugCount = parseInt(localStorage.getItem('inna_virtual_hugs') || '0', 10);
  counterSpan.textContent = hugCount;

  const meowMessages = [
    "Purr... Meow! ❤️",
    "Sayang Kak Inna! 🥰",
    "Inna Hebat Wisuda! 🎓",
    "Meoww! Pelukan hangat! 💕",
    "Nyammm.. Nyaman sekali! 🐱",
    "Mew! Sukses selalu! ✨",
    "Meowww! Proud of you!"
  ];

  let isJumping = false;

  container.addEventListener('click', (e) => {
    if (isJumping) return;
    isJumping = true;

    // 1. Play synthesize cute meow sound
    playMeowSynth();

    // 2. Animate jump class
    container.classList.add('jump');
    
    // 3. Increment counter with localstorage save
    hugCount++;
    localStorage.setItem('inna_virtual_hugs', hugCount);
    counterSpan.textContent = hugCount;
    counterSpan.style.animation = 'none';
    // Trigger reflow
    void counterSpan.offsetWidth;
    counterSpan.style.animation = 'pop 0.3s ease';

    // 4. Change meow bubble message
    const msg = meowMessages[Math.floor(Math.random() * meowMessages.length)];
    bubble.textContent = msg;
    bubble.classList.add('show');

    // 5. Spawn floating playground hearts/sparkles
    const rect = container.getBoundingClientRect();
    for (let i = 0; i < 4; i++) {
      spawnPlaygroundHeart(e.clientX - rect.left, e.clientY - rect.top, container);
    }

    // Reset animations
    setTimeout(() => {
      container.classList.remove('jump');
      isJumping = false;
    }, 550);

    setTimeout(() => {
      bubble.classList.remove('show');
    }, 2000);
  });
}

// Generate cute meow synth sounds procedurally
function playMeowSynth() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // We use a triangle oscillator for a soft warm core and a soft sawtooth for texture
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sawtooth';

    // Mew frequency bend
    // "Mee" -> starts lower, ramps up to peak, slides down on "oww"
    const startFreq = 480;
    const peakFreq = 950;
    const endFreq = 620;

    osc1.frequency.setValueAtTime(startFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(peakFreq, now + 0.12);
    osc1.frequency.exponentialRampToValueAtTime(endFreq, now + 0.5);

    osc2.frequency.setValueAtTime(startFreq, now);
    osc2.frequency.exponentialRampToValueAtTime(peakFreq, now + 0.12);
    osc2.frequency.exponentialRampToValueAtTime(endFreq, now + 0.5);

    // Warm cut filter to tone down sawtooth harshness
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(700, now + 0.5);

    // Gain Envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.08); // rapid fade-in
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.55); // long fade-out

    // Connections
    osc1.connect(gainNode);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Start & Stop
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
  } catch (err) {
    console.log("Audio not allowed or supported by browser policy", err);
  }
}

function spawnPlaygroundHeart(x, y, parent) {
  const heart = document.createElement('span');
  const symbols = ['❤️', '💖', '✨', '🌸', '🐾'];
  heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  heart.classList.add('playground-heart');
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  
  // Random directions for CSS variables
  const rot = Math.random() * 40 - 20;
  const dir = Math.random() * 80 - 40;
  heart.style.setProperty('--rot', `${rot}deg`);
  heart.style.setProperty('--dir', `${dir}px`);

  parent.appendChild(heart);

  // Remove element after animation
  setTimeout(() => {
    heart.remove();
  }, 1200);
}

/* ==========================================================================
   10. BACKGROUND MUSIC (HTML5 AUDIO CONTROL)
   ========================================================================== */
function setupBgMusic() {
  const toggleBtn = document.getElementById('music-toggle');
  const playIcon = toggleBtn.querySelector('.music-icon.play');
  const muteIcon = toggleBtn.querySelector('.music-icon.mute');
  const audio = document.getElementById('bg-music');
  
  let isPlaying = false;

  if (toggleBtn && audio) {
    toggleBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        audio.play().then(() => {
          playIcon.classList.add('hidden');
          muteIcon.classList.remove('hidden');
        }).catch(err => {
          console.warn("Audio playback failed. Please check if song.mp3 exists inside assets folder.", err);
          isPlaying = false;
        });
      } else {
        audio.pause();
        playIcon.classList.remove('hidden');
        muteIcon.classList.add('hidden');
      }
    });
  }
}
