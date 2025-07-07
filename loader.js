let progress = 0;
const progressEl = document.getElementById("progress");

function updateProgress() {
  if (progress < 100) {
    progress++;
    progressEl.textContent = progress + "%";
    setTimeout(updateProgress, 20);
  } else {
    animateTransition();
  }
}

const emojiSpan = document.getElementById("emoji");
const emojis = ["🍔", "🍟", "🥤"];
let index = 0;

function animateEmoji() {
  emojiSpan.textContent = emojis[index];

  if (progress > 95) {
    emojiSpan.style.transform = "translateY(0px)";
    emojiSpan.style.opacity = 1;
  } else {
    anime({
      targets: emojiSpan,
      keyframes: [
        { opacity: 0, duration: 0 },
        { translateY: -30, opacity: 1, duration: 150, easing: "easeOutCubic" },
        { translateY: 0, duration: 150, easing: "easeInCubic" },
        { opacity: 0, duration: 150, delay: 150 },
      ],
      complete: () => {
        index = (index + 1) % emojis.length;
        animateEmoji();
      },
    });
  }
}

animateEmoji();

function animateTransition() {
  const loadingContainer = document.querySelector(".loading-container");

  if (loadingContainer) {
    anime({
      targets: loadingContainer,
      translateX: "-100%",
      duration: 1200,

      changeComplete: () => {
        loadingContainer.style.display = "none";
        anime({
          targets: ".transition-line",
          right: "0",
          width: "100%",
          easing: "easeInOutQuad",
          duration: 1000,
          complete: () => {
            anime({
              targets: ".transition-line",
              scaleY: ["10vh", "100vh"],
              height: "100vh",
              top: "0",
              easing: "easeInOutQuad",
              duration: 3000,
              begin: () => {
                animateWord(words[currentWordIndex]);
              },
            });
          },
        });
      },
    });
  }
}

const words = [
  { text: "GRILLING", color: "white" },
  { text: "GREATNESS", color: "white" },
  { text: "SINCE", subText: "2011", color: "yellow", subTextColor: "white" },
];
let currentWordIndex = 0;
const textContainer = document.getElementById("wordRoller");

function animateWord(wordObj) {
  textContainer.innerHTML = "";

  const textElement = document.createElement("div");
  textElement.className = "text";
  textContainer.appendChild(textElement);

  let subTextElement = null;
  if (wordObj.subText) {
    subTextElement = document.createElement("div");
    subTextElement.className = "sub-text";

    subTextElement.textContent = wordObj.subText;

    textElement.appendChild(subTextElement);
  }

  const letters = wordObj.text.split("");
  const letterElements = [];

  letters.forEach((letter, index) => {
    const letterElement = document.createElement("span");
    letterElement.className = "letter";
    if (wordObj.color === "yellow") {
      letterElement.classList.add("yellow");
    }
    letterElement.textContent = letter === " " ? "\u00A0" : letter;
    textElement.appendChild(letterElement);
    letterElements.push(letterElement);
  });

  const targetsIn = [];
  if (subTextElement) {
    targetsIn.push(subTextElement);
  }
  targetsIn.push(...letterElements);

  anime({
    targets: targetsIn,
    translateY: [100, 0],
    opacity: [0, 1],
    easing: "easeOutExpo",
    duration: 250,
    delay: anime.stagger(80),
    complete: function () {
      setTimeout(() => {
        const targetsOut = [];
        if (subTextElement) {
          targetsOut.push(subTextElement);
        }
        targetsOut.push(...letterElements);

        anime({
          targets: targetsOut,
          translateY: -100,
          opacity: [1, 0],
          easing: "easeInOutQuad",
          duration: 250,
          delay: anime.stagger(50),
          begin: function () {
            currentWordIndex++;
            if (currentWordIndex < words.length) {
              animateWord(words[currentWordIndex]);
            } else {
              anime({
                targets: ".loader",
                opacity: [1, 0],
                duration: 300,
                easing: "easeOutQuad",
                complete: function () {
                  document.querySelector(".loader").style.display = "none";
                },
              });
            }
          },
        });
      }, 150);
    },
  });
}

updateProgress();


function wrapCharacters(selector) {
  const el = document.querySelector(selector);
  const text = el.textContent;
  el.innerHTML = text
    .split("")
    .map(
      (char) => `<span class="char">${char === " " ? "&nbsp;" : char}</span>`
    )
    .join("");
}

function setupScrollDrivenAnimation() {
  const chars = document.querySelectorAll(".scroll-text .char");
  const video = document.querySelector(".scroll-video");
  const section = document.querySelector(".what-so-good");
  const videoText = document.querySelector(".video-text");

  let videoPlayed = false;

  // Combined timeline
  const scrollTimeline = anime.timeline({
    autoplay: false,
  });

  // Character color animation
  scrollTimeline.add({
    targets: chars,
    color: ["#888", "#000"],
    opacity: [0.7, 1],
    delay: anime.stagger(25),
    duration: 1000,
    easing: "easeOutQuad"
  });

  // Scroll text fade up and disappear
  scrollTimeline.add({
    targets: ".scroll-text",
    translateY: ["0%", "-120%"],
    opacity: [1, 0],
    duration: 1000,
    easing: "easeInOutQuad"
  });

  // Video comes in
  scrollTimeline.add({
    targets: video,
    translateY: ["100%", "0%"],
    width:['80vw', '100vw'],
    opacity: [0, 1],
    duration: 1000,
    easing: "easeOutQuad"
  }, '-=500');

  // Video text fades in
  scrollTimeline.add({
    targets: videoText,
    translateY: ["50px", "0px"],
    opacity: [0, 1],
    duration: 1000,
    easing: "easeOutCubic"
  });
  
  scrollTimeline.add({
    targets: '.video-text h3',
    translateY: ["30px", "0px"],
    opacity:[0,1],
    duration: 500,
    easing: "easeOutCubic"
  });

  // Scroll-based control
  window.addEventListener("scroll", () => {
    const wrapper = document.querySelector(".what-so-good-wrapper");
    const rect = wrapper.getBoundingClientRect();

    const totalScroll = wrapper.offsetHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(0, -rect.top), totalScroll);

    const progress = scrolled / totalScroll;

    scrollTimeline.seek(scrollTimeline.duration * progress);

    if (!videoPlayed && progress > 0.5) {
      video.play();
      videoPlayed = true;
    }
  });
}

// Init
wrapCharacters(".scroll-text");
setupScrollDrivenAnimation();


// heroLoadAnimation();

// Create the scroll-driven timeline (paused for manual control)


const timeline = anime.timeline({
  autoplay: false
});

// Build the timeline animation
timeline
.add({
  targets: '.line',
  width:  ['0%', '80%'],
  duration: 400,
  easing: 'easeInOutCubic'
})
.add({
  targets: '.box',
  height: ['0%', '100%'],
  duration: 800,
  easing: 'easeInOutCubic'
}, '+=400')
.add({
  targets: '.box-text',
  translateY: ['-20px', '0px'],
  opacity: [0, 1],
  duration: 400,
  easing: 'easeOutCubic'
});


// Scroll event to control animation progress
window.addEventListener('scroll', () => {
   const stickyWrapper = document.querySelector('.sticky-wrapper');
  const rect = stickyWrapper.getBoundingClientRect();

  const scrollRange = 1500; // Match longer sticky duration
  const scrolled = Math.min(Math.max(0, -rect.top), scrollRange);
  const progress = scrolled / scrollRange;
  timeline.seek(timeline.duration * progress);
});

// =================================
const blocks = document.querySelectorAll(".image-text-block");
const boxContents = document.querySelectorAll(".box-section img.box-content");
const pContent = document.querySelectorAll("p.box-content");

let currentIndex = 0;
let animating = false;
let lastScrollY = window.scrollY;
let ticking = false;

// Helper to animate image transition to/from box
function animateImageTransition(fromIdx, toIdx, direction) {
  // Handle previous box image based on direction
  if (direction > 0) {
    // Forward scroll: dim the previous image
    anime({
      targets: boxContents[fromIdx],
      opacity: [1, 1],
      scale: [1, 0.9],
      duration: 400,
      easing: "easeInOutCubic"
    });
  } else {
    // Reverse scroll: hide the previous image completely
    anime({
      targets: boxContents[fromIdx],
      opacity: [1, 0],
      scale: [1, 0.85],
      duration: 400,
      easing: "easeInOutCubic",
      complete: () => {
        boxContents[fromIdx].style.display = "none";
      }
    });
  }

  // Animate in next image
  boxContents[toIdx].style.display = "block";
  anime.set(boxContents[toIdx], {
    opacity: 0,
    scale: 1.1,
    translateY: direction > 0 ? 40 : -40
  });
  anime({
    targets: boxContents[toIdx],
    opacity: [0, 1],
    scale: [1.1, 1],
    translateY: [direction > 0 ? 40 : -40, 0],
    duration: 700,
    delay: 100,
    easing: "easeOutCubic"
  });
}

function activate(index, direction = 1) {
  if (index === currentIndex || animating) return;
  animating = true;

  const prev = currentIndex;
  const next = index;

  // Animate out current block
  anime({
    targets: blocks[prev],
    opacity: [1, 0],
    translateY: direction > 0 ? [0, -80] : [0, 80],
    duration: 500,
    easing: "easeInOutCubic",
    complete: () => {
      blocks[prev].style.opacity = 0;
      blocks[prev].style.transform = `translateY(${direction > 0 ? -80 : 80}px)`;
    }
  });

  // Animate in next block
  blocks[next].style.opacity = 1;
  blocks[next].style.transform = `translateY(${direction > 0 ? 80 : -80}px)`;
  anime({
    targets: blocks[next],
    opacity: [0, 1],
    translateY: [direction > 0 ? 80 : -80, 0],
    duration: 600,
    delay: 100,
    easing: "easeOutCubic"
  });

  // Animate image transition
  animateImageTransition(prev, next, direction);

  // Animate text content
  if (direction > 0) {
    // Forward scroll: dim the previous text
    anime({
      targets: pContent[prev],
      opacity: [1, 1],
      translateY: [0, 0],
      duration: 400,
      easing: "easeInCubic",
      complete: () => {
        pContent[next].style.display = "block";
        anime.set(pContent[next], {
          opacity: 0,
          translateY: 30
        });
        anime({
          targets: pContent[next],
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 500,
          easing: "easeOutCubic",
          complete: () => {
            currentIndex = next;
            animating = false;
          }
        });
      }
    });
  } else {
    // Reverse scroll: hide the previous text completely
    anime({
      targets: pContent[prev],
      opacity: [1, 0],
      translateY: [0, 30],
      duration: 400,
      easing: "easeInCubic",
      complete: () => {
        pContent[prev].style.display = "none";
        pContent[next].style.display = "block";
        anime.set(pContent[next], {
          opacity: 0,
          translateY: -30
        });
        anime({
          targets: pContent[next],
          opacity: [0, 1],
          translateY: [-30, 0],
          duration: 500,
          easing: "easeOutCubic",
          complete: () => {
            currentIndex = next;
            animating = false;
          }
        });
      }
    });
  }
}

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const section = document.querySelector(".scroll-section");
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress based on section position
      const progress = Math.min(
        Math.max((windowHeight - rect.top) / (windowHeight * blocks.length), 0),
        1
      );

      let index = Math.floor(progress * blocks.length);
      index = Math.min(index, blocks.length - 1);

      // Determine scroll direction
      const direction = window.scrollY > lastScrollY ? 1 : -1;

      if (index !== currentIndex && index >= 0 && index < blocks.length) {
        activate(index, direction);
      }

      lastScrollY = window.scrollY;
      ticking = false;
    });

    ticking = true;
  }
}

window.addEventListener("scroll", onScroll);

// Initial setup
blocks.forEach((block, i) => {
  block.style.opacity = i === 0 ? "1" : "0";
  block.style.transform = i === 0 ? "translateY(0px)" : "translateY(80px)";
});
boxContents.forEach((img, i) => {
  img.style.opacity = i === 0 ? "1" : "0";
  img.style.display = i === 0 ? "block" : "none";
  img.style.transform = "scale(1)";
});
pContent.forEach((p, i) => {
  p.style.display = i === 0 ? "block" : "none";
  p.style.opacity = i === 0 ? "1" : "0";
  p.style.transform = "translateY(0px)";
});