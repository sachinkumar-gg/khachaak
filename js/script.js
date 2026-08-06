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

                if(entry.target.id === "gallery"){

                    balanceHomeGalleryColumns();

                }
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

function balanceHomeGalleryColumns(){

    const galleryGrid = document.querySelector(".gallery-grid");

    if(!galleryGrid || document.querySelector(".gallery-page")) return;

    if(galleryGrid.clientWidth === 0) return;

    const items = Array.from(galleryGrid.querySelectorAll(".gallery-item"));

    if(items.length === 0) return;

    const minColumnWidth = 320;

    const columnCount = Math.max(1, Math.min(4, Math.floor((galleryGrid.clientWidth + 22) / (minColumnWidth + 22))));

    const columns = Array.from({length: columnCount},() => {

        const col = document.createElement("div");

        col.className = "gallery-column";

        return col;

    });

    // Clear grid and create columns
    galleryGrid.textContent = "";
    columns.forEach(col => galleryGrid.appendChild(col));

    items.forEach(item => {

        // choose the column with the smallest scrollHeight; if tie, pick the one with fewer items
        let target = columns[0];
        for(let i=1;i<columns.length;i++){
            const col = columns[i];
            if(col.scrollHeight < target.scrollHeight || (col.scrollHeight === target.scrollHeight && col.children.length < target.children.length)){
                target = col;
            }
        }

        target.appendChild(item);

    });

}

window.addEventListener("load", balanceHomeGalleryColumns);

window.addEventListener("resize", () => {

    const galleryGrid = document.querySelector(".gallery-grid");

    if(!galleryGrid || document.querySelector(".gallery-page")) return;

    galleryGrid.querySelectorAll(".gallery-column").forEach(col => {

        while(col.firstChild) galleryGrid.appendChild(col.firstChild);

        col.remove();

    });

    balanceHomeGalleryColumns();

});


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

})();
