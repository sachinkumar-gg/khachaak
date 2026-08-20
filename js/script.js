(function(){

/* =========================================
   LOADER
========================================= */

function hideLoader() {

    const loader = document.querySelector(".loader");

    if (!loader || loader.dataset.hidden === "true") return;

    loader.dataset.hidden = "true";

    loader.style.opacity = "0";

    setTimeout(() => {

        loader.style.display = "none";

    }, 800);
}

window.addEventListener("load", hideLoader);
window.addEventListener("DOMContentLoaded", hideLoader);
setTimeout(hideLoader, 7000);

/* =========================================
   HERO ENGINE
========================================= */

const nav = document.querySelector("nav");

const hero = document.querySelector(".hero");

const heroLogo = document.getElementById("heroLogo");

const heroLogoLink = document.getElementById("heroLogoLink");

const logoTarget = document.querySelector(".logo-target");

if(heroLogoLink){
    heroLogoLink.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

const heroBg = document.querySelector(".hero-bg");

const heroRight = document.querySelector(".hero-right");

const heroScroll = document.querySelector(".hero-scroll");

const isHeroPage =
    !!(hero && heroLogo && logoTarget);

if (!isHeroPage && nav) {

    nav.classList.add("visible", "scrolled");

}

let heroStart = {};

let heroTarget = {};

function measureHero(){

    if(!isHeroPage) return;

    const mobile = window.innerWidth <= 768;

    /* -------------------------
       START POSITION
    ------------------------- */

    const startMargin = 42;

    if(mobile){

        const width = Math.min(
            window.innerWidth * .58,
            220
        );

        heroStart = {

            x: window.innerWidth / 2,

            y: 205,

            width

        };

    }

    else{

        const width = Math.min(
            window.innerWidth * .40,
            530
        );

        heroStart = {

            x: startMargin + width / 2,

            y: window.innerHeight * .50,

            width

        };

    }

    /* -------------------------
       NAVBAR TARGET
    ------------------------- */

    const rect = logoTarget.getBoundingClientRect();

    heroTarget = {

        x: rect.left + rect.width/2,

        y: rect.top + rect.height/2,

        width: rect.width

    };

}

let ticking = false;

function updateHero(){

    if(!isHeroPage) return;

    const scroll = window.scrollY;

    const heroHeight = hero.offsetHeight;

    /* -------------------------
       Progress
    ------------------------- */

    const start = heroHeight * 0.25;

    const end = heroHeight * 0.72;

    let progress = (scroll - start) / (end - start);

    progress = Math.max(0, Math.min(progress,1));

    const ease = 1 - Math.pow(1 - progress, 3);

    /* -------------------------
       Navbar
    ------------------------- */

    if(progress > 0.05){

        nav.classList.add("visible");
        nav.classList.add("scrolled");

    }else{

        nav.classList.remove("visible");
        nav.classList.remove("scrolled");

    }

    /* -------------------------
       Hero Content
    ------------------------- */

    if(heroRight){

        heroRight.style.opacity = 1 - ease;

        heroRight.style.transform =
            `translateY(${-40*ease}px)`;

    }

    if(heroBg){

        heroBg.style.transform =
            `scale(${1+ease*0.06})`;

    }

    /* -------------------------
       Logo
    ------------------------- */

    const x =
        heroStart.x +
        (heroTarget.x - heroStart.x) * ease;

    const y =
        heroStart.y +
        (heroTarget.y - heroStart.y) * ease;

    const w =
        heroStart.width +
        (heroTarget.width - heroStart.width) * ease;

    heroLogo.style.left = `${x}px`;

    heroLogo.style.top = `${y}px`;

    heroLogo.style.width = `${w}px`;

    heroLogo.style.transform =
        `translate(-50%,-50%) scale(${1 - ease * 0.14})`;

    if(heroLogoLink){
        const logoHeight = heroLogo.getBoundingClientRect().height;
        heroLogoLink.style.left = `${x - w / 2}px`;
        heroLogoLink.style.top = `${y - logoHeight / 2}px`;
        heroLogoLink.style.width = `${w}px`;
        heroLogoLink.style.height = `${logoHeight}px`;
        heroLogoLink.style.cursor = "pointer";
        heroLogoLink.style.pointerEvents = "auto";
    }

    heroLogo.style.filter =

        `drop-shadow(
            0 ${25-18*ease}px ${45-30*ease}px rgba(0,0,0,.35)
        )
        drop-shadow(
            0 0 ${25-15*ease}px rgba(199,154,118,.12)
        )`;

}

function requestTick(){

    if(ticking) return;

    ticking = true;

    requestAnimationFrame(()=>{

        updateHero();

        ticking = false;

    });

}

measureHero();

updateHero();

window.addEventListener("scroll",requestTick,{passive:true});

window.addEventListener("resize",()=>{

    measureHero();

    updateHero();

});

window.addEventListener("orientationchange",()=>{

    setTimeout(()=>{

        measureHero();

        updateHero();

    },200);

});

window.addEventListener("load",()=>{

    measureHero();

    updateHero();

});

/* =========================================
   MOBILE MENU
========================================= */

const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const closeMenu = document.querySelector(".close-menu");

if(hamburger && mobileMenu){

    hamburger.addEventListener("click",()=>{

        mobileMenu.classList.add("active");

        document.body.style.overflow="hidden";

    });

}

if(closeMenu){

    closeMenu.addEventListener("click",()=>{

        mobileMenu.classList.remove("active");

        document.body.style.overflow="";

    });

}

document.querySelectorAll(".mobile-menu a").forEach(link=>{

    link.addEventListener("click",()=>{

        mobileMenu.classList.remove("active");

        document.body.style.overflow="";

    });

});


/* =========================================
   HERO SLIDESHOW
========================================= */

const heroImages = [

    "assets/street/1.webp",
    "assets/street/2.webp",
    "assets/street/3.webp",
    "assets/street/4.webp"

];

let heroIndex = 0;

const heroBackground = document.querySelector(".hero-bg");

function changeHeroImage(){

    if(!heroBackground) return;

    heroBackground.style.transition =
        "opacity .8s ease, transform 8s ease";

    heroBackground.style.opacity = "0";

    setTimeout(()=>{

        heroIndex =
            (heroIndex+1)%heroImages.length;

        heroBackground.style.backgroundImage =
            `url("${heroImages[heroIndex]}")`;

        heroBackground.style.opacity = "1";

        heroBackground.style.transform =
            "scale(1.04)";

        requestAnimationFrame(()=>{

            setTimeout(()=>{

                heroBackground.style.transform =
                    "scale(1)";

            },50);

        });

    },800);

}

if(heroBackground){

    heroBackground.style.backgroundImage =
        `url("${heroImages[0]}")`;

    setInterval(changeHeroImage,7000);

}

/* =========================================
   CURSOR GLOW
========================================= */

const glow = document.createElement("div");

glow.classList.add("cursor-glow");

document.body.appendChild(glow);

document.addEventListener("mousemove", (e) => {

    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";

});


/* =========================================
   FADE ANIMATION
========================================= */

const observer = new IntersectionObserver(

    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    },

    {
        threshold: 0.01,

        rootMargin: "200px 0px 200px 0px"
    }

);

document.querySelectorAll("section").forEach(section => {

    section.classList.add("fade-up");

    observer.observe(section);

});

// Fallback: Ensure all sections reveal even if scroll observer fails
setTimeout(() => {

    document.querySelectorAll("section.fade-up").forEach(section => {

        section.classList.add("show");

    });

}, 500);


/* =========================================
   GALLERY FILTERS
========================================= */

const filterButtons =
    document.querySelectorAll(".gallery-filters button");

const galleryItems =
    document.querySelectorAll(".gallery-item");

const isFullGallery =
    document.querySelector(".gallery-page");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        const filter =
            button.textContent
            .toLowerCase()
            .replace(/\s+/g,"-");

        const isMobile = window.innerWidth <= 1024;

        galleryItems.forEach(item => {

            /* gallery.html */
            if(isFullGallery){

                if(filter === "all"){

                    item.style.display = "block";

                }

                else{

                    item.style.display =
                        item.classList.contains(filter)
                        ? "block"
                        : "none";

                }

            }

            /* homepage */
            else{

                /* Mobile → hide non-matching */
                if(isMobile){

                    if(filter === "all"){

                        item.style.display = "block";

                    }

                    else{

                        item.style.display =
                            item.classList.contains(filter)
                            ? "block"
                            : "none";

                    }

                }

                /* Desktop → fade non-matching */
                else{

                    item.style.display = "block";

                    if(filter === "all"){

                        item.classList.remove("dimmed");
                        item.classList.remove("active-filter");

                    }

                    else{

                        if(item.classList.contains(filter)){

                            item.classList.remove("dimmed");
                            item.classList.add("active-filter");

                        }

                        else{

                            item.classList.remove("active-filter");
                            item.classList.add("dimmed");

                        }

                    }

                }

            }

        });

        /* Scroll to first matching image on mobile */
        if(!isFullGallery && isMobile && filter !== "all"){

            const firstMatch =
                document.querySelector(`.gallery-item.${filter}`);

            if(firstMatch){

                firstMatch.scrollIntoView({

                    behavior:"smooth",

                    block:"start"

                });

            }

        }

        /* On desktop/tablet, scroll to and highlight the first matching image */
        if(!isFullGallery && !isMobile && filter !== "all"){

            const firstMatch = document.querySelector(`.gallery-item.${filter}`);

            if(firstMatch){

                firstMatch.scrollIntoView({

                    behavior: "smooth",

                    block: "center"

                });

                firstMatch.classList.add('focus-highlight');

                setTimeout(()=>{

                    firstMatch.classList.remove('focus-highlight');

                },2200);

            }

        }

    });

});



/* =========================================
   LIGHTBOX
========================================= */

const lightbox =
    document.querySelector(".lightbox");

const lightboxImage =
    document.querySelector(".lightbox img");

const closeLightbox =
    document.querySelector(".close-lightbox");

document.querySelectorAll(".gallery-item img")
    .forEach(image => {

        image.addEventListener("click", () => {

            if (!lightbox) return;

            lightbox.classList.add("active");

            lightboxImage.src = image.src;

        });

    });

if (closeLightbox) {

    closeLightbox.addEventListener("click", () => {

        lightbox.classList.remove("active");

    });

}

if (lightbox) {

    lightbox.addEventListener("click", (e) => {

        if (e.target === lightbox) {

            lightbox.classList.remove("active");
        }

    });

}

/* =========================================
   HERO SUBTITLE
========================================= */

const subtitle = document.getElementById("heroSubtitle");

const subtitleWords = [

    "Capture.",

    "Create.",

    "Observe.",

    "Compose.",

    "Lights. Cameras. Khachaak.",

    "Stealth Era."

];

let subtitleIndex = 0;

function rotateSubtitle(){

    if(!subtitle) return;

    subtitle.classList.add("fade");

    setTimeout(()=>{

        subtitleIndex =
            (subtitleIndex + 1) % subtitleWords.length;

        subtitle.textContent =
            subtitleWords[subtitleIndex];

        subtitle.classList.remove("fade");

    },250);

}

setInterval(rotateSubtitle,3200);


/* =========================================
   CAMERA FOCUS
========================================= */

const focusBox = document.querySelector(".hero-focus-box");

function triggerFocus(){

    if(!focusBox) return;

    focusBox.animate([

        {

            opacity:0,

            transform:"translate(-50%,-50%) scale(1.35)"

        },

        {

            opacity:1,

            transform:"translate(-50%,-50%) scale(.94)",

            offset:.45

        },

        {

            opacity:0,

            transform:"translate(-50%,-50%) scale(1)"

        }

    ],{

        duration:700,

        easing:"cubic-bezier(.22,.61,.36,1)"

    });

}

setInterval(triggerFocus,6500);

setTimeout(triggerFocus,1200);

/* =========================================
   HERO PARALLAX
========================================= */

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove",(e)=>{

    mouseX = (e.clientX/window.innerWidth-.5)*20;

    mouseY = (e.clientY/window.innerHeight-.5)*20;

});

/* =========================================
   CAMERA SOUND ENGINE (Web Audio API)
========================================= */

let audioCtx = null;
let soundEnabled = true;

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }
}

function playShutterSound() {
    if (!soundEnabled) return;
    try {
        initAudio();
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const now = audioCtx.currentTime;

        // Mechanical Mirror Flip (Noise burst)
        const bufferSize = audioCtx.sampleRate * 0.05;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(3, now);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.045);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        noise.start(now);
        noise.stop(now + 0.05);

        // Secondary Shutter Snap (Curtain Click)
        setTimeout(() => {
            if (!audioCtx) return;
            const now2 = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const oscGain = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, now2);
            osc.frequency.exponentialRampToValueAtTime(80, now2 + 0.03);

            oscGain.gain.setValueAtTime(0.3, now2);
            oscGain.gain.exponentialRampToValueAtTime(0.01, now2 + 0.03);

            osc.connect(oscGain);
            oscGain.connect(audioCtx.destination);

            osc.start(now2);
            osc.stop(now2 + 0.035);
        }, 35);
    } catch (e) {
        console.warn('Audio play error', e);
    }
}

function triggerCameraFlash() {
    let flashEl = document.querySelector('.camera-flash-overlay');
    if (!flashEl) {
        flashEl = document.createElement('div');
        flashEl.className = 'camera-flash-overlay';
        document.body.appendChild(flashEl);
    }
    flashEl.classList.add('flash-active');
    setTimeout(() => {
        flashEl.classList.remove('flash-active');
    }, 120);
}

/* Wire shutter click to lightbox and buttons */
document.addEventListener('click', (e) => {
    if (e.target.closest('.gallery-item') || e.target.closest('.story-card img') || e.target.closest('.hud-btn') || e.target.closest('.event-register-btn')) {
        playShutterSound();
    }
});

/* Lightbox enhancement with camera flash & sound */
document.querySelectorAll('.gallery-item img, .month-img-wrap img').forEach(img => {
    img.addEventListener('click', () => {
        triggerCameraFlash();
    });
});

/* =========================================
   CAMERA HUD CONTROLS
========================================= */

function setupHUDControls() {
    let hudBar = document.querySelector('.hud-controls-bar');
    if (!hudBar) {
        hudBar = document.createElement('div');
        hudBar.className = 'hud-controls-bar';
        hudBar.innerHTML = `
            <button class="hud-btn shutter-sound-btn active" title="Toggle Shutter Click Sound">
                <span>🔊 SHUTTER SOUND</span>
            </button>
            <button class="hud-btn rule-grid-btn" title="Toggle Rule of Thirds Grid">
                <span>📐 GRID</span>
            </button>
        `;
        document.body.appendChild(hudBar);
    }

    const soundBtn = hudBar.querySelector('.shutter-sound-btn');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                soundBtn.classList.add('active');
                soundBtn.innerHTML = '<span>🔊 SHUTTER SOUND</span>';
                playShutterSound();
            } else {
                soundBtn.classList.remove('active');
                soundBtn.innerHTML = '<span>MUTE SHUTTER</span>';
            }
        });
    }

    const gridBtn = hudBar.querySelector('.rule-grid-btn');
    let gridOverlay = document.querySelector('.rule-of-thirds-grid');
    if (!gridOverlay) {
        gridOverlay = document.createElement('div');
        gridOverlay.className = 'rule-of-thirds-grid';
        document.body.appendChild(gridOverlay);
    }

    if (gridBtn) {
        gridBtn.addEventListener('click', () => {
            gridOverlay.classList.toggle('active');
            gridBtn.classList.toggle('active');
        });
    }
}

document.addEventListener('DOMContentLoaded', setupHUDControls);
setupHUDControls();

/* =========================================
   EVENTS FILTERING & MODAL
========================================= */

const eventFilterBtns = document.querySelectorAll('.event-filter-btn');
const eventCards = document.querySelectorAll('.event-card');

eventFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        eventFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        eventCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'flex';
                card.style.animation = 'fadeInUp 0.4s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

/* Event Registration Modal */
const registerBtns = document.querySelectorAll('.event-register-btn');
const modalBackdrop = document.querySelector('.modal-backdrop');
const modalClose = document.querySelector('.modal-close-btn');
const modalForm = document.querySelector('.modal-form');
const eventTitleTarget = document.getElementById('modalEventTitle');

registerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const eventName = btn.dataset.eventName || 'Khachaak Event';
        if (eventTitleTarget) eventTitleTarget.textContent = `Register for ${eventName}`;
        if (modalBackdrop) modalBackdrop.classList.add('active');
    });
});

if (modalClose && modalBackdrop) {
    modalClose.addEventListener('click', () => {
        modalBackdrop.classList.remove('active');
    });

    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) modalBackdrop.classList.remove('active');
    });
}

if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        playShutterSound();
        triggerCameraFlash();
        alert('🎉 Registration Successful! See you through the lens.');
        if (modalBackdrop) modalBackdrop.classList.remove('active');
        modalForm.reset();
    });
}

/* =========================================
   LIVE COUNTDOWN TIMER
========================================= */

function updateCountdown() {
    const daysEl = document.getElementById('timerDays');
    const hoursEl = document.getElementById('timerHours');
    const minsEl = document.getElementById('timerMins');
    const secsEl = document.getElementById('timerSecs');

    if (!daysEl) return;

    // Target date: Aperture 2026 flagship event (Sept 25, 2026)
    const targetDate = new Date('2026-09-25T10:00:00+05:30').getTime();
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minsEl.textContent = String(mins).padStart(2, '0');
        secsEl.textContent = String(secs).padStart(2, '0');
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* =========================================
   PHOTOS OF THE MONTH LIKES
========================================= */

document.querySelectorAll('.like-btn').forEach((btn, idx) => {
    const countEl = btn.querySelector('.like-count');
    const storageKey = `khachaak_like_${idx}`;
    let likes = parseInt(localStorage.getItem(storageKey) || (142 + idx * 37), 10);
    countEl.textContent = likes;

    btn.addEventListener('click', () => {
        if (!btn.classList.contains('liked')) {
            likes++;
            btn.classList.add('liked');
            localStorage.setItem(storageKey, likes);
            countEl.textContent = likes;
            playShutterSound();
        }
    });
});

/* =========================================
   3D TILT EFFECT FOR CARDS
========================================= */

document.querySelectorAll('.story-card, .event-card, .month-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / (rect.height / 2)) * -6;
        const tiltY = (x / (rect.width / 2)) * 6;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
});

})();

