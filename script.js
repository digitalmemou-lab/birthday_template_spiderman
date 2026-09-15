/**
 * ==========================================================
 * SPIDER-MAN BIRTHDAY EXPERIENCE - INTERACTIVE JAVASCRIPT
 * ==========================================================
 */

// --- USER CUSTOMIZATION CONFIG ---
const BIRTHDAY_CONFIG = {
  boyfriendName: "My Superhero",
  nickname: "Peter Parker",
  birthdayDate: "September 15",
  signOffName: "Forever Your Mary Jane ❤️",
  
  // Dialogues for the 3 Spider-Men Pointing Meme
  spideyDialogues: {
    holland: {
      name: "TOM HOLLAND (MCU)",
      quote: "Wait! Mr. Stark told me there's a guy who's 1000% the sweetest, smartest boyfriend in the multiverse... and that's YOU! Happy Birthday!",
      sound: "thwip"
    },
    garfield: {
      name: "ANDREW GARFIELD (TASM)",
      quote: "I checked Earth-120703 and all parallel dimensions: She literally never stops talking about how amazing you are! You're the real hero, man!",
      sound: "thwip"
    },
    maguire: {
      name: "TOBEY MAGUIRE (RAIMI)",
      quote: "Whatever comes our way, whatever battle we have inside us, we always have a choice. And she chooses you every single time. Pizza time!",
      sound: "thwip"
    }
  }
};

// --- WEB AUDIO API SYNTHESIZER ENGINE ---
let audioCtx = null;
let soundEnabled = true;
let musicPlaying = false;
let bgmInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Web-Shooter "THWIP!" Sound (White Noise + Frequency Sweep)
function playThwipSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const bufferSize = ctx.sampleRate * 0.18; // 180ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to give that high-pressure pneumatic web air hiss
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.16);
    filter.Q.setValueAtTime(4.0, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.7, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.17);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

// 2. Spider-Sense Tingling Sound (Oscillating Vibrato Pulse)
function playSpiderSenseSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, ctx.currentTime);

    // Rapid vibrato frequency modulation
    for (let t = 0; t < 0.4; t += 0.04) {
      osc.frequency.setValueAtTime(520, ctx.currentTime + t);
      osc.frequency.setValueAtTime(440, ctx.currentTime + t + 0.02);
    }

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {}
}

// 3. Comic Balloon Pop / Hit Sound
function playPopSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {}
}

// 4. Candle Blowing Breath Whoosh Sound
function playBlowSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.38);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (e) {}
}

// 5. Superhero Fanfare Triumph Chords
function playFanfareSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [
    { freq: 261.63, time: 0.0, dur: 0.2 }, // C4
    { freq: 329.63, time: 0.15, dur: 0.2 }, // E4
    { freq: 392.00, time: 0.3, dur: 0.2 }, // G4
    { freq: 523.25, time: 0.45, dur: 0.7 }, // C5
    { freq: 659.25, time: 0.7, dur: 0.9 }, // E5
  ];

  notes.forEach(note => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      gain.gain.setValueAtTime(0.3, ctx.currentTime + note.time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + note.dur);
    } catch (e) {}
  });
}

// 6. Ambient Superhero Synth Theme Music
function toggleHeroTheme() {
  const ctx = getAudioContext();
  const btn = document.getElementById('musicToggleBtn');

  if (musicPlaying) {
    if (bgmInterval) clearInterval(bgmInterval);
    musicPlaying = false;
    if (btn) btn.classList.remove('active');
    return;
  }

  musicPlaying = true;
  if (btn) btn.classList.add('active');

  // Heroic Chord progression: C - G - Am - F
  const chords = [
    [261.63, 329.63, 392.00], // C
    [196.00, 246.94, 293.66], // G
    [220.00, 261.63, 329.63], // Am
    [174.61, 220.00, 261.63]  // F
  ];
  let chordIdx = 0;

  const playChord = () => {
    if (!musicPlaying || !soundEnabled || !ctx) return;
    const currentChord = chords[chordIdx % chords.length];
    chordIdx++;

    currentChord.forEach(f => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 2.2);
      } catch (e) {}
    });
  };

  playChord();
  bgmInterval = setInterval(playChord, 2200);
}


// --- DYNAMIC WEB-SHOOTER CANVAS ---
const canvas = document.getElementById('webCanvas');
const ctx2d = canvas ? canvas.getContext('2d') : null;
let activeWebs = [];
let webShooterActive = true;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class SpiderWebShot {
  constructor(targetX, targetY) {
    this.targetX = targetX;
    this.targetY = targetY;
    // Shoot from bottom-center or nearest corner
    this.startX = window.innerWidth * 0.5;
    this.startY = window.innerHeight;
    this.life = 1.0;
    this.decay = 0.016; // Lasts around ~2 seconds
    this.branches = [];
    
    // Generate web threads radiating from target point
    const rays = 8;
    for (let i = 0; i < rays; i++) {
      const angle = (Math.PI * 2 / rays) * i;
      const length = 40 + Math.random() * 50;
      this.branches.push({
        x: targetX + Math.cos(angle) * length,
        y: targetY + Math.sin(angle) * length,
        angle: angle,
        length: length
      });
    }
  }

  update() {
    this.life -= this.decay;
  }

  draw(context) {
    if (this.life <= 0) return;
    context.save();
    context.globalAlpha = Math.min(1, this.life * 1.5);
    context.strokeStyle = '#ffffff';
    context.lineWidth = 2.5 * this.life;
    context.shadowColor = '#00f0ff';
    context.shadowBlur = 8;

    // Main web line from shooter
    context.beginPath();
    context.moveTo(this.startX, this.startY);
    // Slight curve to make it look organic
    const midX = (this.startX + this.targetX) / 2 + (Math.random() - 0.5) * 20;
    const midY = (this.startY + this.targetY) / 2;
    context.quadraticCurveTo(midX, midY, this.targetX, this.targetY);
    context.stroke();

    // Radiating web star at the impact point
    context.lineWidth = 1.8 * this.life;
    this.branches.forEach(b => {
      context.beginPath();
      context.moveTo(this.targetX, this.targetY);
      context.lineTo(b.x, b.y);
      context.stroke();
    });

    // Concentric spiral web connectors
    for (let r = 15; r <= 45; r += 15) {
      context.beginPath();
      for (let i = 0; i < this.branches.length; i++) {
        const b = this.branches[i];
        const cx = this.targetX + Math.cos(b.angle) * (r * (b.length / 50));
        const cy = this.targetY + Math.sin(b.angle) * (r * (b.length / 50));
        if (i === 0) context.moveTo(cx, cy);
        else context.lineTo(cx, cy);
      }
      context.closePath();
      context.stroke();
    }

    context.restore();
  }
}

function animateWebs() {
  if (!ctx2d) return;
  ctx2d.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = activeWebs.length - 1; i >= 0; i--) {
    activeWebs[i].update();
    activeWebs[i].draw(ctx2d);
    if (activeWebs[i].life <= 0) {
      activeWebs.splice(i, 1);
    }
  }

  requestAnimationFrame(animateWebs);
}
requestAnimationFrame(animateWebs);

function shootWebAt(x, y) {
  if (!webShooterActive) return;
  activeWebs.push(new SpiderWebShot(x, y));
  playThwipSound();
}

// Global click-to-shoot web listener (ignores form elements/buttons if they do specific actions)
window.addEventListener('pointerdown', (e) => {
  // Check if click was on or inside buttons/interactive dialog
  const isInteractive = e.target.closest('button, a, input, dialog, .polaroid-card, .candle');
  if (webShooterActive && !isInteractive) {
    shootWebAt(e.clientX, e.clientY);
  }
});


// --- ENTRANCE GATE INITIALIZATION ---
const entranceModal = document.getElementById('entranceModal');
const enterSiteBtn = document.getElementById('enterSiteBtn');

if (enterSiteBtn && entranceModal) {
  enterSiteBtn.addEventListener('click', () => {
    // Resume audio context
    getAudioContext();
    playSpiderSenseSound();

    // Shoot celebratory webs
    shootWebAt(window.innerWidth * 0.3, window.innerHeight * 0.4);
    setTimeout(() => {
      shootWebAt(window.innerWidth * 0.7, window.innerHeight * 0.4);
    }, 150);

    // Fade out entrance modal
    entranceModal.classList.remove('active');

    // Confetti pop
    fireHeroConfetti();
  });
}


// --- HUD CONTROLS ---
const soundToggleBtn = document.getElementById('soundToggleBtn');
const webShooterModeBtn = document.getElementById('webShooterModeBtn');
const musicToggleBtn = document.getElementById('musicToggleBtn');

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggleBtn.classList.toggle('active', soundEnabled);
    const label = soundToggleBtn.querySelector('.hud-label');
    const icon = soundToggleBtn.querySelector('.hud-icon');
    if (label) label.textContent = soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF';
    if (icon) icon.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playThwipSound();
  });
}

if (webShooterModeBtn) {
  webShooterModeBtn.addEventListener('click', () => {
    webShooterActive = !webShooterActive;
    webShooterModeBtn.classList.toggle('active', webShooterActive);
    const label = webShooterModeBtn.querySelector('.hud-label');
    if (label) label.textContent = webShooterActive ? 'WEB SHOOTER: ON' : 'WEB SHOOTER: OFF';
    if (webShooterActive) playThwipSound();
  });
}

if (musicToggleBtn) {
  musicToggleBtn.addEventListener('click', () => {
    toggleHeroTheme();
  });
}


// --- 3D TILT EFFECT ON POSTER CARD ---
const posterTiltCard = document.getElementById('posterTiltCard');
if (posterTiltCard) {
  const posterInner = posterTiltCard.querySelector('.poster-inner');

  posterTiltCard.addEventListener('mousemove', (e) => {
    const rect = posterTiltCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    if (posterInner) {
      posterInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  });

  posterTiltCard.addEventListener('mouseleave', () => {
    if (posterInner) {
      posterInner.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }
  });
}


// --- 3 SPIDER-MEN POINTING MEME INTERACTION ---
const hotspots = document.querySelectorAll('.spidey-hotspot');
const memeSpeechBubble = document.getElementById('memeSpeechBubble');

hotspots.forEach(spot => {
  spot.addEventListener('click', (e) => {
    e.stopPropagation();
    const spideyKey = spot.dataset.spidey;
    const data = BIRTHDAY_CONFIG.spideyDialogues[spideyKey];

    if (data && memeSpeechBubble) {
      // Shoot web at spot
      const rect = spot.getBoundingClientRect();
      shootWebAt(rect.left + rect.width / 2, rect.top + rect.height / 2);

      const speakerSpan = memeSpeechBubble.querySelector('.bubble-speaker');
      const textP = memeSpeechBubble.querySelector('.bubble-text');

      if (speakerSpan) speakerSpan.textContent = data.name + ' SAYS:';
      if (textP) textP.textContent = `"${data.quote}"`;

      memeSpeechBubble.classList.add('visible');
    }
  });
});


// --- SPIDER-TRAINING TARGET MINI-GAME ---
const targets = document.querySelectorAll('.game-target');
const gameScoreEl = document.getElementById('gameScore');
let caughtCount = 0;

targets.forEach(target => {
  target.addEventListener('click', (e) => {
    e.stopPropagation();
    if (target.classList.contains('caught')) return;

    const perkKey = target.dataset.perk;
    const rect = target.getBoundingClientRect();

    // Shoot web at target
    shootWebAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
    playPopSound();

    // Mark as caught
    target.classList.add('caught');
    caughtCount++;
    if (gameScoreEl) gameScoreEl.textContent = caughtCount;

    // Unlock corresponding coupon
    const couponCard = document.getElementById(`coupon-${perkKey}`);
    if (couponCard) {
      couponCard.classList.remove('locked');
      couponCard.classList.add('unlocked');
      const statusSpan = couponCard.querySelector('.coupon-status');
      if (statusSpan) statusSpan.textContent = '🎉 UNLOCKED & READY TO REDEEM!';
    }

    // Check if all targets caught
    if (caughtCount === targets.length) {
      setTimeout(() => {
        playFanfareSound();
        fireHeroConfetti();
      }, 500);
    }
  });
});


// --- MAKE A SPIDER-WISH CAKE & CANDLE CEREMONY ---
const blowCandlesBtn = document.getElementById('blowCandlesBtn');
const relightCandlesBtn = document.getElementById('relightCandlesBtn');
const celebrationBanner = document.getElementById('celebrationBanner');
const blastMoreConfettiBtn = document.getElementById('blastMoreConfettiBtn');
const candles = document.querySelectorAll('.candle');

function blowOutAllCandles() {
  playBlowSound();
  let anyExtinguished = false;

  candles.forEach((candle, idx) => {
    const flame = candle.querySelector('.flame');
    const smoke = candle.querySelector('.smoke');
    if (flame && flame.classList.contains('active')) {
      flame.classList.remove('active');
      anyExtinguished = true;
      if (smoke) {
        smoke.classList.add('active');
        setTimeout(() => smoke.classList.remove('active'), 1500);
      }
    }
  });

  if (anyExtinguished) {
    setTimeout(() => {
      playFanfareSound();
      fireHeroConfetti();
      if (celebrationBanner) celebrationBanner.classList.remove('hidden');
      if (blowCandlesBtn) blowCandlesBtn.classList.add('hidden');
      if (relightCandlesBtn) relightCandlesBtn.classList.remove('hidden');
    }, 400);
  }
}

function relightAllCandles() {
  playSpiderSenseSound();
  candles.forEach(candle => {
    const flame = candle.querySelector('.flame');
    if (flame) flame.classList.add('active');
  });

  if (celebrationBanner) celebrationBanner.classList.add('hidden');
  if (blowCandlesBtn) blowCandlesBtn.classList.remove('hidden');
  if (relightCandlesBtn) relightCandlesBtn.classList.add('hidden');
}

// Click on individual candle
candles.forEach(candle => {
  candle.addEventListener('click', (e) => {
    e.stopPropagation();
    const flame = candle.querySelector('.flame');
    const smoke = candle.querySelector('.smoke');
    if (flame && flame.classList.contains('active')) {
      playBlowSound();
      flame.classList.remove('active');
      if (smoke) {
        smoke.classList.add('active');
        setTimeout(() => smoke.classList.remove('active'), 1500);
      }
      
      // Check if all flames are now out
      const remainingFlames = document.querySelectorAll('.flame.active');
      if (remainingFlames.length === 0) {
        setTimeout(() => {
          playFanfareSound();
          fireHeroConfetti();
          if (celebrationBanner) celebrationBanner.classList.remove('hidden');
          if (blowCandlesBtn) blowCandlesBtn.classList.add('hidden');
          if (relightCandlesBtn) relightCandlesBtn.classList.remove('hidden');
        }, 400);
      }
    }
  });
});

if (blowCandlesBtn) blowCandlesBtn.addEventListener('click', blowOutAllCandles);
if (relightCandlesBtn) relightCandlesBtn.addEventListener('click', relightAllCandles);
if (blastMoreConfettiBtn) blastMoreConfettiBtn.addEventListener('click', () => {
  playThwipSound();
  fireHeroConfetti();
});


// --- SUPERHERO CONFETTI ENGINE (WITH CDN & OFFLINE FALLBACK) ---
function fireHeroConfetti() {
  const colors = ['#e23636', '#0066ff', '#ffd32a', '#ffffff', '#00f2fe'];

  // 1. If canvas-confetti library is loaded
  if (typeof confetti === 'function') {
    // Center blast
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: colors
    });

    // Left spider-web streamer
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.7 },
        colors: colors
      });
    }, 200);

    // Right spider-web streamer
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.7 },
        colors: colors
      });
    }, 400);
  } else {
    // 2. Offline Pure JS Confetti Fallback
    for (let i = 0; i < 60; i++) {
      createOfflineConfettiPiece(colors[i % colors.length]);
    }
  }
}

function createOfflineConfettiPiece(color) {
  const piece = document.createElement('div');
  piece.style.position = 'fixed';
  piece.style.top = '-20px';
  piece.style.left = Math.random() * 100 + 'vw';
  piece.style.width = (8 + Math.random() * 8) + 'px';
  piece.style.height = (8 + Math.random() * 8) + 'px';
  piece.style.backgroundColor = color;
  piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
  piece.style.zIndex = '99999';
  piece.style.pointerEvents = 'none';
  piece.style.transition = 'transform 3s cubic-bezier(0.25, 1, 0.5, 1), opacity 3s ease';

  document.body.appendChild(piece);

  setTimeout(() => {
    piece.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${window.innerHeight + 50}px) rotate(${Math.random() * 720}deg)`;
    piece.style.opacity = '0';
  }, 20);

  setTimeout(() => {
    if (piece.parentNode) piece.parentNode.removeChild(piece);
  }, 3200);
}


// --- PHOTO LIGHTBOX DIALOG ---
const photoDialog = document.getElementById('photoDialog');
const closeDialogBtn = document.getElementById('closeDialogBtn');
const dialogTitle = document.getElementById('dialogTitle');
const dialogImg = document.getElementById('dialogImg');
const dialogCaption = document.getElementById('dialogCaption');
const dialogDate = document.getElementById('dialogDate');

const polaroidCards = document.querySelectorAll('.polaroid-card');
polaroidCards.forEach(card => {
  card.addEventListener('click', (e) => {
    e.stopPropagation();
    const title = card.dataset.title || card.querySelector('h4')?.textContent;
    const caption = card.dataset.caption || card.querySelector('p')?.textContent;
    const date = card.dataset.date || card.querySelector('.polaroid-date')?.textContent;
    const imgSrc = card.querySelector('img')?.getAttribute('src');

    if (dialogTitle) dialogTitle.textContent = title;
    if (dialogCaption) dialogCaption.textContent = caption;
    if (dialogDate) dialogDate.textContent = date;
    if (dialogImg) dialogImg.src = imgSrc;

    playSpiderSenseSound();
    if (photoDialog) photoDialog.showModal();
  });
});

if (closeDialogBtn && photoDialog) {
  closeDialogBtn.addEventListener('click', () => {
    photoDialog.close();
  });
}

// Close modal when clicking outside on backdrop
if (photoDialog) {
  photoDialog.addEventListener('click', (e) => {
    const rect = photoDialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      photoDialog.close();
    }
  });
}

console.log("🕷️ Spider-Man Birthday Template 2 successfully initialized!");
