// document.addEventListener('DOMContentLoaded', () => {
//     const hamburger = document.getElementById('hamburger');
//     const navLinks = document.getElementById('navLinks');
//     const contactBtn = document.getElementById('contactBtn');
  
//     hamburger.addEventListener('click', () => {
//       navLinks.classList.toggle('active');
//       contactBtn.classList.toggle('active');
//     });
//   });

function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const phases = document.querySelectorAll('.phase');
    const courseModulesContainer = document.querySelector('.course-modules');
    const moduleHeadings = document.querySelectorAll('.course-modules h3');
    if (!courseModulesContainer || phases.length === 0) return;
    const phaseContent = {
        1: {
            modules: [
                {
                    title: 'AI Fundamentals',
                    topics: [
                        {
                            title: 'Machine Learning Basics - ',
                            description: 'Understand ML types, training methods, feature engineering, metrics',
                            hours: 2
                        },
                        {
                            title: 'Deep Learning Essentials - ',
                            description: 'Master neural networks, activation functions, loss functions, optimization',
                            hours: 2
                        },
                        {
                            title: 'Advanced ML Concepts - ',
                            description: 'Learn ensemble methods, transfer learning, DL architectures, evaluation',
                            hours: 2
                        },
                        {
                            title: 'AI Ethics and Bias - ',
                            description: 'Understand fairness, bias detection, responsible AI, transparency',
                            hours: 2
                        }
                    ],
                    totalHours: 8,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/phaseicon1.svg'
                },
                {
                    title: 'Cybersecurity Fundamentals - ',
                    topics: [
                        {
                            title: 'Network Security - ',
                            description: 'Master TCP/IP, protocols, network architecture, traffic analysis',
                            hours: 2
                        },
                        {
                            title: 'Security Controls - ',
                            description: 'Implement authentication, authorization, access control, policies',
                            hours: 2
                        },
                        {
                            title: 'Threat Landscape - ',
                            description: 'Identify attack types, threat actors, vectors, risk assessment',
                            hours: 2
                        },
                        {
                            title: 'Security Operations - ',
                            description: 'Execute incident response, log analysis, monitoring, threat intel',
                            hours: 2
                        }
                    ],
                    totalHours: 8,
                    instructor: 'CyberAI Professionals',
                     icon: 'assets/phaseicon2.svg'
                }
            ]
        },
        2: {
            modules: [
                {
                    title: 'IDS',
                    topics: [
                        {
                            title: 'ML-based IDS Architecture - ',
                            description: 'Design ML-IDS architecture, implement detection systems',
                            hours: 2
                        },
                        {
                            title: 'Real-time Detection Systems - ',
                            description: 'Build real-time detection, optimize performance',
                            hours: 2
                        },
                        {
                            title: 'Hybrid Detection Approaches - ',
                            description: 'Combine multiple detection methods, enhance accuracy',
                            hours: 2
                        },
                    ],
                    totalHours: 6,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/IDSphaseicon.svg'
                },
                {
                    title: 'IoT Security',
                    topics: [
                        {
                            title: 'Edge Device Protection - ',
                            description: 'Secure IoT devices, implement edge protection',
                            hours: 1
                        },
                        {
                            title: 'Lightweight ML Models - ',
                            description: 'Deploy efficient models, optimize for constraints',
                            hours: 1
                        },
                        {
                            title: 'Distributed Detection - ',
                            description: 'Implement distributed security, coordinate detection',
                            hours: 1
                        }
                    ],
                    totalHours: 3,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/iotphaseicon.svg'
                },
                {
                    title: 'Anomaly Detection',
                    topics: [
                        {
                            title: 'Statistical Methods - ',
                            description: 'Apply statistical anomaly detection methods',
                            hours: 1
                        },
                        {
                            title: 'Deep Learning Approaches - ',
                            description: 'Implement DL-based anomaly detection',
                            hours: 1
                        },
                        {
                            title: 'Autoencoder-based Detection - ',
                            description: 'Use autoencoders for anomaly detection',
                            hours: 1
                        },
                        {
                            title: 'Real-time Implementation - ',
                            description: 'Deploy real-time anomaly detection systems',
                            hours: 1
                        }
                    ],
                    totalHours: 4,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/anamolyphaseicon.svg',
                },
                {
                    title: 'Behavior Analysis',
                    topics: [
                        {
                            title: 'User Behavior Analytics - ',
                            description: 'Profile user behavior, detect anomalies',
                            hours: 1
                        },
                        {
                            title: 'System Behavior Profiling - ',
                            description: 'Monitor system behavior, identify patterns',
                            hours: 1
                        },
                        {
                            title: 'Network Behavior Analysis - ',
                            description: 'Analyze network behavior, detect threats',
                            hours: 1
                        }
                    ],
                    totalHours: 3,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/phaseicon1.svg',
                },
                {
                    title: 'Biometric Authentication',
                    topics: [
                        {
                            title: 'Facial Recognition - ',
                            description: 'Implement facial recognition systems',
                            hours: 1
                        },
                        {
                            title: 'Multimodal Biometrics - ',
                            description: 'Combine multiple biometric factors',
                            hours: 1
                        },
                        {
                            title: 'Anti-spoofing Techniques - ',
                            description: 'Prevent biometric spoofing attacks',
                            hours: 1
                        }
                    ],
                    totalHours: 3,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/biometricphaseicon.svg'
                },
                {
                    title: 'Vulnerability Scanning',
                    topics: [
                        {
                            title: 'ML-enhanced Scanning - ',
                            description: 'Improve scanning with ML techniques',
                            hours: 1
                        },
                        {
                            title: 'Automated Assessment - ',
                            description: 'Automate vulnerability assessment',
                            hours: 1
                        },
                        {
                            title: 'Risk Prioritization - ',
                            description: 'Prioritize risks using ML methods',
                            hours: 1
                        }
                    ],
                    totalHours: 3,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/vulnerabilityphaseicon.svg'
                },
                {
                    title: 'Supply Chain Attacks',
                    topics: [
                        {
                            title: 'Software Supply Chain Attacks - ',
                            description: 'Software Supply chain attacks and how to protect against them',
                            hours: 1
                        }
                    ],
                    totalHours: 1,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/supplyphaseicon.svg'
                },
                {
                    title: 'Implementation',
                    topics: [
                        {
                            title: 'Performance Optimization - ',
                            description: 'Optimize system performance',
                            hours: 1
                        }
                    ],
                    totalHours: 1,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/implementationphaseicon.svg'
                }
            ]
        },
        3: {
            modules: [
                {
                    title: 'Adversarial Attacks',
                    topics: [
                        {
                            title: 'White-box Attacks - ',
                            description: 'Understand and implement white-box attacks',
                            hours: 0.75
                        },
                        {
                            title: 'Black-box Attacks - ',
                            description: 'Master black-box attack techniques',
                            hours: 0.75
                        },
                        {
                            title: 'Transfer Attacks - ',
                            description: 'Execute transfer attack methods',
                            hours: 0.75
                        },
                        {
                            title: 'Physical Attacks - ',
                            description: 'Implement physical adversarial attacks',
                            hours: 0.75
                        }
                    ],
                    totalHours: 3,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/adversialphaseicon.svg'
                },
                {
                    title: 'Data Poisoning',
                    topics: [
                        {
                            title: 'Training Data Poisoning - ',
                            description: 'Understand training data poisoning',
                            hours: 0.5
                        },
                        {
                            title: 'Label Flipping - ',
                            description: 'Implement label flipping attacks',
                            hours: 0.5
                        },
                        {
                            title: 'Backdoor Attacks - ',
                            description: 'Execute backdoor attack techniques',
                            hours: 0.5
                        },
                        {
                            title: 'Clean Label Attacks - ',
                            description: 'Master clean label poisoning',
                            hours: 0.5
                        }
                    ],
                    totalHours: 2,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/datapoisioningphaseicon.svg'
                },
                {
                    title: 'Model Extraction',
                    topics: [
                        {
                            title: 'API-based Extraction - ',
                            description: 'Extract models via API attacks',
                            hours: 0.5
                        },
                        {
                            title: 'Side-channel Attacks - ',
                            description: 'Implement side-channel attacks',
                            hours: 0.5
                        },
                        {
                            title: 'Membership Inference - ',
                            description: 'Execute membership inference attacks',
                            hours: 0.5
                        },
                        {
                            title: 'Architecture Reconstruction - ',
                            description: 'Reconstruct model architectures',
                            hours: 0.5
                        }
                    ],
                    totalHours: 2,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/modelphaseicon.svg'
                },
                {
                    title: 'Advanced Attacks',
                    topics: [
                        {
                            title: 'Model Inversion - ',
                            description: 'Implement model inversion attacks',
                            hours: 0.75
                        },
                        {
                            title: 'Distillation Attacks - ',
                            description: 'Execute distillation attacks',
                            hours: 0.75
                        },
                        {
                            title: 'Trojan Attacks - ',
                            description: 'Implement trojan attack methods',
                            hours: 0.75
                        },
                        {
                            title: 'Privacy Leakage - ',
                            description: 'Understand privacy leakage attacks',
                            hours: 0.75
                        }
                    ],
                    totalHours: 3,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/advncedphaseicon.svg'
                }
            ]
        },
        4: {
            modules: [
                {
                    title: 'Differential Privacy',
                    topics: [
                        {
                            title: 'DP Fundamentals - ',
                            description: 'Master DP concepts and mathematics',
                            hours: 2
                        },
                        {
                            title: 'Privacy Budgeting - ',
                            description: 'Implement privacy budget management',
                            hours: 1
                        },
                        {
                            title: 'DP-SGD Implementation - ',
                            description: 'Deploy DP-SGD in practice',
                            hours: 2
                        },
                        {
                            title: 'Privacy Analysis - ',
                            description: 'Analyze privacy guarantees',
                            hours: 1
                        }
                    ],
                    totalHours: 6,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/differentialphaseicon.svg'
                },
                {
                    title: 'Federated Learning',
                    topics: [
                        {
                            title: 'FL Architecture - ',
                            description: 'Design FL systems architecture',
                            hours: 1
                        },
                        {
                            title: 'Secure Aggregation - ',
                            description: 'Implement secure aggregation protocols',
                            hours: 2
                        },
                        {
                            title: 'Cross-silo FL - ',
                            description: 'Deploy cross-silo FL systems',
                            hours: 1
                        },
                        {
                            title: 'Privacy Guarantees - ',
                            description: 'Ensure FL privacy guarantees',
                            hours: 2
                        }
                    ],
                    totalHours: 6,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/federatedphaseicon.svg'
                },
                {
                    title: 'Robust Defenses',
                    topics: [
                        {
                            title: 'Input Sanitization - ',
                            description: 'Implement input sanitization methods',
                            hours: 1
                        },
                        {
                            title: 'Model Hardening - ',
                            description: 'Apply model hardening techniques',
                            hours: 1
                        },
                        {
                            title: 'Certified Defenses - ',
                            description: 'Deploy certified defense methods',
                            hours: 1
                        },
                        {
                            title: 'Detection Methods - ',
                            description: 'Implement attack detection systems',
                            hours: 1
                        }
                    ],
                    totalHours: 2,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/robustphaseicon.svg'
                },
                {
                    title: 'Adversarial Training',
                    topics: [
                        {
                            title: 'PGD Training - ',
                            description: 'Execute PGD adversarial training',
                            hours: 1
                        },
                        {
                            title: 'Ensemble Training - ',
                            description: 'Implement ensemble defenses',
                            hours: 1
                        },
                        {
                            title: 'Verification Methods - ',
                            description: 'Apply verification techniques',
                            hours: 1
                        },
                        {
                            title: 'Robustness Evaluation -',
                            description: 'Evaluate model robustness',
                            hours: 1
                        }
                    ],
                    totalHours: 4,
                    instructor: 'CyberAI Professionals',
                    icon: 'assets/adversialphaseicon2.svg'
                }
            ]
        }
    };

    phases.forEach(phase => {
        phase.addEventListener('click', () => {
            phases.forEach(p => p.classList.remove('active'));
            phase.classList.add('active');
            const phaseNumber = phase.getAttribute('data-phase');
            if (phaseContent[phaseNumber]) {
                updateContent(phaseContent[phaseNumber]);
            }
        });
    });
    function updateContent(content) {
        courseModulesContainer.innerHTML = '';
        content.modules.forEach((moduleData, index) => {
            const moduleElement = document.createElement('div');
            moduleElement.classList.add('course-module');
            const titleElement = document.createElement('h3');
            titleElement.textContent = moduleData.title;
            moduleElement.appendChild(titleElement);

            const moduleContent = document.createElement('div');
            moduleContent.classList.add('module-content');
            moduleContent.innerHTML = moduleData.topics.map(topic => `
                <div class="topic">
                    <img src="assets/arrow.svg" alt="Arrow Icon">
                    <div class="topic-content">
                        <h4>${topic.title}</h4>
                        <p>${topic.description}</p>
                        <span class="hours">(${topic.hours} Hrs)</span>
                    </div>
                </div>
            `).join('');
            moduleElement.appendChild(moduleContent);

            const footer = document.createElement('div');
            footer.classList.add('module-footer');
            footer.innerHTML = `
                <p>Total Hours: ${moduleData.totalHours}</p>
                <p>|</p>
                <p>Instructor: ${moduleData.instructor}</p>
            `;
            moduleElement.appendChild(footer);

            const iconBox = document.createElement('div');
            iconBox.classList.add('icon-box');
            iconBox.innerHTML = `<img src="${moduleData.icon}" alt="Phase Icon" class="module-icon" />`;
            moduleElement.appendChild(iconBox);
            courseModulesContainer.appendChild(moduleElement);
        });
    }
    updateContent(phaseContent[1]);
});


document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('videoModal');
    const videoImage = document.getElementById('videoImage');
    if (!modal || !videoImage) return;

    const closeBtn = modal.querySelector('.close') || modal.querySelector('.video-close-btn');
    const videoIframe = document.getElementById('videoIframe');
    const videoUrl = videoIframe ? (videoIframe.getAttribute('data-src') || videoIframe.src || "https://www.youtube.com/embed/4eFwOGjI5BQ") : "";

    videoImage.addEventListener('click', () => {
        modal.style.display = 'flex';
        if (videoIframe && videoUrl) {
            videoIframe.src = videoUrl;
        }
    });

    function closeVideo() {
        modal.style.display = 'none';
        if (videoIframe) {
            videoIframe.src = "";
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeVideo);
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeVideo();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && (modal.style.display === 'flex' || modal.style.display === 'block')) {
            closeVideo();
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.height = '0px';
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.height = answer.scrollHeight + 'px';
        }
      });
    });
  });

// Successful Learners — Load More
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.getElementById('loadMoreLearners');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', function() {
        const hiddenCards = document.querySelectorAll('.learner-card.hidden');
        const batchSize = 5;
        let revealed = 0;

        hiddenCards.forEach(function(card) {
            if (revealed < batchSize) {
                card.classList.remove('hidden');
                revealed++;
            }
        });

        // Check if any hidden cards remain
        const remaining = document.querySelectorAll('.learner-card.hidden');
        if (remaining.length === 0) {
            loadMoreBtn.style.display = 'none';
        }
    });
});

// Alumni Stories — Dot Slider Navigation
document.addEventListener('DOMContentLoaded', function() {
    const storiesTrack = document.getElementById('storiesTrack');
    const dots = document.querySelectorAll('.story-dot');
    if (!storiesTrack || dots.length === 0) return;

    let currentSlide = 0;

    function getCardsPerSlide() {
        const viewportWidth = window.innerWidth;
        if (viewportWidth <= 800) return 1;
        if (viewportWidth <= 1200) return 2;
        return 3;
    }

    function goToSlide(slideIndex) {
        const cardsPerSlide = getCardsPerSlide();
        const cards = storiesTrack.querySelectorAll('.story-card');
        if (cards.length === 0) return;

        const card = cards[0];
        const cardStyle = window.getComputedStyle(card);
        const cardWidth = card.offsetWidth;
        const gap = parseInt(window.getComputedStyle(storiesTrack).gap) || 24;

        const offset = slideIndex * cardsPerSlide * (cardWidth + gap);
        storiesTrack.style.transform = 'translateX(-' + offset + 'px)';

        currentSlide = slideIndex;

        // Update active dot
        dots.forEach(function(dot) {
            dot.classList.remove('active');
        });
        dots[slideIndex].classList.add('active');
    }

    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            goToSlide(index);
        });
    });

    // Recalculate on window resize
    window.addEventListener('resize', function() {
        goToSlide(currentSlide);
    });
});

// Alumni Stories — Video Modal Logic
document.addEventListener('DOMContentLoaded', function() {
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const storyVideoModal = document.getElementById('storyVideoModal');
    const closeStoryModal = document.getElementById('closeStoryModal');
    const storyVideoPlayer = document.getElementById('storyVideoPlayer');

    if (!storyVideoModal || !storyVideoPlayer) return;

    // Open modal on click
    videoThumbnails.forEach(function(thumbnail) {
        thumbnail.addEventListener('click', function() {
            const videoSrc = thumbnail.getAttribute('data-video-src');
            if (videoSrc) {
                // Set the video source
                storyVideoPlayer.querySelector('source').src = videoSrc;
                storyVideoPlayer.load(); // Reload video element with new source
                
                // Show modal as flex for centering
                storyVideoModal.style.display = 'flex';
                
                // Autoplay video when modal opens
                storyVideoPlayer.play().catch(function() {
                    // Autoplay was prevented; controls are still visible for user
                });
            }
        });
    });

    // Close modal function
    function closeVideoModal() {
        storyVideoModal.style.display = 'none';
        storyVideoPlayer.pause(); // Stop playing when closed
        storyVideoPlayer.currentTime = 0; // Reset video to start
    }

    // Close when X is clicked
    if (closeStoryModal) {
        closeStoryModal.addEventListener('click', closeVideoModal);
    }

    // Close when clicking outside modal content
    window.addEventListener('click', function(event) {
        if (event.target === storyVideoModal) {
            closeVideoModal();
        }
    });

    // Close on Escape key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && (storyVideoModal.style.display === 'flex' || storyVideoModal.style.display === 'block')) {
            closeVideoModal();
        }
    });
});

// Successful Learners — Image Popup Modal Logic
document.addEventListener('DOMContentLoaded', function() {
    const learnerCards = document.querySelectorAll('.learner-card');
    const learnerImageModal = document.getElementById('learnerImageModal');
    const closeLearnerModal = document.getElementById('closeLearnerModal');
    const learnerModalImg = document.getElementById('learnerModalImg');

    if (!learnerImageModal || !learnerModalImg) return;

    learnerCards.forEach(function(card) {
        const imgWrapper = card.querySelector('.learner-img-wrapper');
        const img = card.querySelector('.learner-img-wrapper img');
        const targetElement = imgWrapper || img;

        if (targetElement && img) {
            targetElement.addEventListener('click', function() {
                const imgSrc = img.getAttribute('src');
                const imgAlt = img.getAttribute('alt') || 'Learner Preview';
                if (imgSrc) {
                    learnerModalImg.src = imgSrc;
                    learnerModalImg.alt = imgAlt;
                    learnerImageModal.style.display = 'flex';
                }
            });
        }
    });

    function closeImgModal() {
        learnerImageModal.style.display = 'none';
        learnerModalImg.src = '';
    }

    if (closeLearnerModal) {
        closeLearnerModal.addEventListener('click', closeImgModal);
    }

    window.addEventListener('click', function(event) {
        if (event.target === learnerImageModal) {
            closeImgModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && (learnerImageModal.style.display === 'flex' || learnerImageModal.style.display === 'block')) {
            closeImgModal();
        }
    });
});

