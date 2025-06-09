
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

        const emojiSpan = document.getElementById('emoji');
        const emojis = ['🍔', '🍟', '🥤'];
        let index = 0;
    
        function animateEmoji() {
          emojiSpan.textContent = emojis[index];
    
          if (progress >90) {
            emojiSpan.style.transform = "translateY(0px)";
            emojiSpan.style.opacity = 1;
        }else{
            anime({
                targets: emojiSpan,
                keyframes: [
                    { opacity: 0, duration: 0 },
                    { translateY: -30, opacity: 1, duration: 300, easing: 'easeOutCubic' },
                    { translateY: 0, duration: 300, easing: 'easeInCubic' },
                    { opacity: 0, duration: 300, delay: 300 }
                  ],
                  complete: () => {
                index = (index + 1) % emojis.length;
                animateEmoji(); 
              }
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
                easing: 'easeOutExpo',
                duration: 250,
                delay: anime.stagger(80),
                complete: function() {

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
                            easing: 'easeInOutQuad',
                            duration: 250,
                            delay: anime.stagger(50),
                            begin: function () {
                                
                                currentWordIndex++;
                                if (currentWordIndex < words.length) {
                                    animateWord(words[currentWordIndex]);
                                } else {
                                    
                                    anime({
                                        targets: '.loader',
                                        opacity: [1, 0],
                                        duration: 300,
                                        easing: 'easeOutQuad',
                                        complete: function () {
                                            document.querySelector('.loader').style.display = 'none';
                                            headerLoadAnimation(); 
                                        }
                                    });
                                }
                            }
                        });
                    }, 150); 
                }
            });
        }

        
       const headerLoadAnimation=()=>{
           anime({
               targets: 'header',
               translateY: ['-100px' , '0px'],
               duration: 500,
               easing: 'easeOutBounce'
           });
       }

        updateProgress();
