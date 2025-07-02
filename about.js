const spotlight = document.getElementById("spotlight");
const text1 = document.getElementById("text1");
const text2 = document.getElementById("text2");
const heroWrapper = document.querySelector(".hero-wrapper");

const scrollEnd = window.innerHeight;
let isReleased = false;

function updateOnScroll() {
  const scrollY = window.scrollY;
  const sectionTop = heroWrapper.offsetTop;
  const progress = Math.min(Math.max((scrollY - sectionTop) / scrollEnd, 0), 1);

  // Animate spotlight
  const spotX = progress * (window.innerWidth / 2);
  spotlight.style.transform = `translateX(${spotX}px)`;

  const text1X = progress * window.innerWidth;
  text1.style.transform = `translate(${text1X}px, -50%)`;

  const text2X = -500 + progress * ((window.innerWidth * 0.10) + 500);
  text2.style.left = `${text2X}px`;

  // Scroll Down Smoothly
  if (progress >= 1 && !isReleased) {
    isReleased = true;
    anime({
      targets: heroWrapper,
      scrollTop: sectionTop + scrollEnd + 1,
      duration: 1000,
      easing: "easeInOutQuad",
    });
  }

  // Scroll Up to Replay
  if (progress < 1 && isReleased) {
    isReleased = false;
    anime({
      targets: heroWrapper,
      scrollTop: sectionTop,
      duration: 800,
      easing: "easeInOutQuad"
    });
  }
}

window.addEventListener("scroll", updateOnScroll);


// Select the correct path elements from your new timeline SVGs
const path1 = document.querySelector('.curve-one path:nth-of-type(2)');
const path2 = document.querySelector('.curve-two path:nth-of-type(2)');

// Get the length of each path
const length1 = path1.getTotalLength();
const length2 = path2.getTotalLength();

// Apply dash style for animation
path1.style.strokeDasharray = length1;
path1.style.strokeDashoffset = length1;

path2.style.strokeDasharray = length2;
path2.style.strokeDashoffset = length2;

// Scroll-driven animation logic
function updateScrollAnimation() {
  const scrollY = window.scrollY;
  const container = document.querySelector('.timeline-container');
  const containerTop = container.offsetTop;
  const containerHeight = container.offsetHeight;
  const windowHeight = window.innerHeight;
  const middleTrigger = containerTop - (windowHeight / 2); // Start when container reaches middle
  const maxScroll = containerHeight - windowHeight;
  const scrollRange = maxScroll * 2; // Increase scroll range to slow down animation

  const progress = Math.min(Math.max((scrollY - middleTrigger) / scrollRange, 0), 1);

  if (progress <= 0.5) {
    // Animate first curve only
    const p1 = progress / 0.5;
    path1.style.strokeDashoffset = length1 * (p1);
    path2.style.strokeDashoffset = 0;
  } else {
    // Animate second curve
    path1.style.strokeDashoffset = length1;
    const p2 = (progress - 0.5) / 0.5;
    path2.style.strokeDashoffset = -length2 * (p2);
  }
}

// Trigger animation on scroll
window.addEventListener('scroll', () => {
  requestAnimationFrame(updateScrollAnimation);
});

// Initial run
updateScrollAnimation();

// Fade in timeline content elements based on gradient fill progress
const timelineContents = document.querySelectorAll('.timeline-content');
const contentPositions = [0.01, 0.2, 0.4, 0.6, 0.8, 1.0]; // Adjusted to appear later

function updateContentVisibility() {
  const scrollY = window.scrollY;
  const container = document.querySelector('.timeline-container');
  const containerTop = container.offsetTop;
  const containerHeight = container.offsetHeight;
  const windowHeight = window.innerHeight;
  const middleTrigger = containerTop - (windowHeight / 2); // Start when container reaches middle
  const maxScroll = containerHeight - windowHeight;
  const scrollRange = maxScroll * 2; // Increase scroll range to slow down animation
  const progress = Math.min(Math.max((scrollY - middleTrigger) / scrollRange, 0), 1);

  timelineContents.forEach((content, index) => {
    const shouldShow = progress >= contentPositions[index];
    if (shouldShow) {
      content.classList.add('visible');
    } else {
      content.classList.remove('visible');
    }
  });
}

window.addEventListener('scroll', () => {
  requestAnimationFrame(() => {
    updateScrollAnimation();
    updateContentVisibility();
  });
});

updateContentVisibility();
