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


// Timeline section scroll animation
function setupTimelineScrollAnimation() {
  const scrollSection = document.querySelector('.scroll-section');
  const imageTextBlocks = document.querySelectorAll('.image-text-block');
  const boxContentImages = document.querySelectorAll('.box-section img.box-content');
  const boxTexts = document.querySelectorAll('p.box-content');
  
  // Set initial states
  imageTextBlocks.forEach((block, index) => {
    if (index === 0) {
      block.style.opacity = '1';
      block.style.transform = 'translateY(0)';
    } else {
      block.style.opacity = '0';
      block.style.transform = 'translateY(250px)';
    }
  });
  
  // Hide boxes initially
  boxContentImages.forEach(img => {
    img.style.opacity = '0';
    img.style.transform = 'scale(0.8)';
  });
  boxTexts.forEach(text => {
    text.style.opacity = '0';
    text.style.transform = 'translateY(20px)';
  });

  // Ensure first block is properly visible and can fade out
  if (imageTextBlocks[0]) {
    imageTextBlocks[0].style.pointerEvents = 'auto';
  }

  let currentBlockIndex = 0;
  let isAnimating = false;
  let lastScrollTop = 0;



  function animateBlock(index, direction = 'forward') {
    if (isAnimating) return;
    isAnimating = true;

    const currentBlock = imageTextBlocks[index];
    const nextBlock = imageTextBlocks[index + 1];
    const prevBlock = imageTextBlocks[index - 1];

    if (direction === 'forward') {
      // Create a timeline for smooth sequential animation
      const timeline = anime.timeline({
        complete: () => {
          isAnimating = false;
        }
      });

      // Fade out current block
      timeline.add({
        targets: currentBlock,
        opacity: [1, 0],
        translateY: ['0px', '-50px'],
        duration: 600,
        easing: 'easeInOutQuad'
      });

      // Show boxes and text for current block - these will stay visible

      timeline.add({
        targets: boxContentImages[index],
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 500,
        easing: 'easeOutBack'
      }, '-=300');

      timeline.add({
        targets: boxTexts[index],
        opacity: [0, 1],
        translateY: ['20px', '0px'],
        duration: 400,
        easing: 'easeOutQuad',
        complete: () => {
          // Also set display to block at the start of the animation
          if (boxTexts[index]) {
            boxTexts[index].style.display = 'block';
          }
        }
      });

      // Show next block if exists
      if (nextBlock) {
        timeline.add({
          targets: nextBlock,
          opacity: [0, 1],
          translateY: ['250px', '0px'],
          duration: 600,
          easing: 'easeOutQuad'
        }, '-=200');
      }
    } else {
      // Reverse animation - start by hiding boxes and content
      const timeline = anime.timeline({
        complete: () => {
          isAnimating = false;
        }
      });

      // Start reverse animation by hiding boxes and content first
      timeline.add({
        targets: boxContentImages[index],
        opacity: [1, 0],
        scale: [1, 0.8],
        duration: 400,
        easing: 'easeInQuad'
      });

      timeline.add({
        targets: boxTexts[index],
        opacity: [1, 0],
        translateY: ['0px', '20px'],
        duration: 400,
        easing: 'easeInQuad',
        complete: () => {
          // Also set display to block at the start of the animation
          if (boxTexts[index]) {
            boxTexts[index].style.display = 'none';
          }
        }
      });


      // Then fade out current block downward
      timeline.add({
        targets: currentBlock,
        opacity: [1, 0],
        translateY: ['0px', '50px'],
        duration: 600,
        easing: 'easeInOutQuad'
      }, '-=200');

      // Finally show the previous block from above (upward to downward)
      if (prevBlock) {
        timeline.add({
          targets: prevBlock,
          opacity: [0, 1],
          translateY: ['-250px', '0px'],
          duration: 600,
          easing: 'easeOutQuad'
        }, '-=300');
        
        // Hide current block's boxes content when previous block fades in
        timeline.add({
          targets: [boxContentImages[index-1], boxTexts[index-1]],
          opacity: [1, 0],
          scale: boxContentImages[index-1] ? [1, 0.8] : undefined,
          translateY: boxTexts[index-1] ? ['0px', '20px'] : undefined, 
          duration: 400,
          easing: 'easeInQuad',
          complete: () => {
            // Also set display to block at the start of the animation
            if (boxTexts[index-1]) {
              boxTexts[index-1].style.display = 'none';
            }
          }
        });
      }
    }
  }

  // Scroll event listener
  window.addEventListener('scroll', () => {
    const rect = scrollSection.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
    lastScrollTop = scrollTop;

    // Calculate which block should be active based on scroll position
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const windowHeight = window.innerHeight;
    
    // Define trigger points for each block
    const triggerPoints = [0.05, 0.25, 0.5, 0.75, 0.9]; // 4 blocks + fade out point at 90%
    const scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / sectionHeight));
    
    let targetBlockIndex = 0;
    for (let i = 0; i < triggerPoints.length - 1; i++) {
      if (scrollProgress >= triggerPoints[i] && scrollProgress < triggerPoints[i + 1]) {
        targetBlockIndex = i;
        break;
      }
    }
    
    // If we've scrolled past 90%, set to -1 to indicate all should be hidden
    if (scrollProgress >= 1) {
      targetBlockIndex = -1;
    }

    // Only animate if we need to change blocks
    if (targetBlockIndex !== currentBlockIndex && !isAnimating) {
      if (targetBlockIndex === -1) {
        // Only hide blocks when scrolling past the last one, keep boxes visible
        anime({
          targets: imageTextBlocks,
          opacity: [1, 0],
          translateY: ['0px', '-50px'],
          duration: 600,
          easing: 'easeInOutQuad',
          complete: () => {
            isAnimating = false;
          }
        });
        currentBlockIndex = -1;
      } else if (currentBlockIndex === -1) {
        // Show the target block when coming back from past the end
        // For the last block, animate from above, for others from below
        const startY = targetBlockIndex === imageTextBlocks.length - 1 ? '-250px' : '250px';
        anime({
          targets: imageTextBlocks[targetBlockIndex],
          opacity: [0, 1],
          translateY: [startY, '0px'],
          duration: 600,
          easing: 'easeOutQuad',
          complete: () => {
            currentBlockIndex = targetBlockIndex;
          }
        });
      } else {
        const direction = targetBlockIndex > currentBlockIndex ? 'forward' : 'backward';
        
        if (direction === 'forward') {
          // Animate directly to target block
          animateBlock(currentBlockIndex, 'forward');
          currentBlockIndex = targetBlockIndex;
          
        } else {
          // Animate backwards - handle first block specially
          if (currentBlockIndex === 0 && targetBlockIndex === 0) {
            // If we're at the first block and target is also first, just show it from above
            anime({
              targets: imageTextBlocks[0],
              opacity: [0, 1],
              translateY: ['-250px', '0px'],
              duration: 600,
              easing: 'easeOutQuad',
              complete: () => {
                isAnimating = false;
              }
            });
          } else {
            // Normal reverse animation - this will hide boxes and show previous block
            animateBlock(currentBlockIndex, 'backward');
            currentBlockIndex = targetBlockIndex;
          }
        }
      }
    }
    if (currentBlockIndex === imageTextBlocks.length - 1 && !isAnimating) {
      isAnimating = true;

      const lastIndex = currentBlockIndex;
      const timeline = anime.timeline({
        complete: () => {
          isAnimating = false;
        }
      });

      timeline.add({
        targets: boxContentImages[lastIndex],
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 500,
        easing: 'easeOutBack'
      });

      timeline.add({
        targets: boxTexts[lastIndex],
        opacity: [0, 1],
        translateY: ['20px', '0px'],
        duration: 400,
        easing: 'easeOutQuad',
        begin: () => {
          boxTexts[lastIndex].style.display = 'block';
        }
      });
    }
  });
}

// Initialize timeline scroll animation
setupTimelineScrollAnimation();

// Awards section scroll animation
function setupAwardsScrollAnimation() {
  const stickyWrapper = document.querySelector('.sticky-wrapper');
  const line = document.querySelector('.line-section .line');
  const box = document.querySelector('.box');
  const boxTexts = document.querySelectorAll('.box-text');
  
  // Check if elements exist before proceeding
  if (!stickyWrapper || !line || !box || boxTexts.length === 0) {
    console.log('Awards section elements not found, skipping animation setup');
    return;
  }
  
  // Set initial states
  line.style.width = '0%';
  line.style.transition = 'none';
  
  box.style.height = '0%';
  box.style.overflow = 'hidden';
  box.style.transition = 'none';
  
  // Hide all box texts initially
  boxTexts.forEach(text => {
    text.style.opacity = '0';
    text.style.transform = 'translateY(30px)';
    text.style.transition = 'none';
    text.style.display = 'none';
  });

  let isAnimating = false;
  let currentAnimation = null;

  window.addEventListener('scroll', () => {
    if (isAnimating) return;
    
    const rect = stickyWrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollProgress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
    
    // Define animation phases - everything completes by the end
    const lineStart = 0.1;
    const lineEnd = 0.25;
    const boxStart = 0.25; // Box starts exactly when line ends
    const boxEnd = 0.5;
    const contentStart = 0.4; // Content starts when box is 50% done
    const contentEnd = 0.8; // Everything complete by 80% scroll
    
    // Calculate individual progress for each phase
    const lineProgress = Math.max(0, Math.min(1, (scrollProgress - lineStart) / (lineEnd - lineStart)));
    const boxProgress = Math.max(0, Math.min(1, (scrollProgress - boxStart) / (boxEnd - boxStart)));
    const contentProgress = Math.max(0, Math.min(1, (scrollProgress - contentStart) / (contentEnd - contentStart)));
    
    // Animate line
    if (lineProgress > 0) {
      line.style.width = `${lineProgress * 80}%`;
    } else {
      line.style.width = '0%';
    }
    
    // Animate box height - only starts after line is complete
    if (boxProgress > 0) {
      box.style.height = `${boxProgress * 100}vh`;
    } else {
      box.style.height = '0vh';
    }
    
    // Ensure box reaches full height by the end
    if (scrollProgress > 0.5) {
      box.style.height = '100vh';
    }
    
    // Animate content with stagger - clean fade in
    if (contentProgress > 0) {
      boxTexts.forEach((text, index) => {
        const textProgress = Math.max(0, Math.min(1, (contentProgress - index * 0.1) / 0.6));
        if (textProgress > 0.1) { // Only show when progress is significant
          text.style.display = 'block';
          text.style.opacity = textProgress;
          text.style.transform = `translateY(${30 - textProgress * 30}px)`;
        } else {
          text.style.display = 'none';
          text.style.opacity = '0';
          text.style.transform = 'translateY(30px)';
        }
      });
    } else {
      boxTexts.forEach(text => {
        text.style.display = 'none';
        text.style.opacity = '0';
        text.style.transform = 'translateY(30px)';
      });
    }
    
    // Ensure all texts reach full opacity by the end of scroll
    if (scrollProgress > 0.8) {
      boxTexts.forEach(text => {
        text.style.display = 'block';
        text.style.opacity = '1';
        text.style.transform = 'translateY(0px)';
      });
    }
  });
}

// Initialize awards scroll animation
setupAwardsScrollAnimation();
