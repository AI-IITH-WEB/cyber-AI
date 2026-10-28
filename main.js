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
                    title: 'Weekend 1 — LLM Fundamentals',
                    topics: [
                        {
                            title: 'Tokens and inference',
                            description: 'Token IDs, embeddings, training vs. inference...'
                        },
                        {
                            title: 'Attention and sequence context',
                            description: 'Causal attention and positional information...'
                        },
                        {
                            title: 'Context windows and assembly',
                            description: 'Token budgets, history and truncation...'
                        },
                        {
                            title: 'Decoding and output variability',
                            description: 'Greedy decoding, temperature and top-p...'
                        }
                    ],
                    contactHours: 3,
                    classMinutes: 45
                },
                {
                    title: 'Weekend 2 — Prompt Engineering & System Prompts',
                    topics: [
                        {
                            title: 'Prompt roles and templates',
                            description: 'Message roles and chat-template serialization...'
                        },
                        {
                            title: 'Writing a testable system prompt',
                            description: 'Task scope, format and evidence rules...'
                        },
                        {
                            title: 'Multi-turn context assembly',
                            description: 'History, summaries and untrusted text...'
                        },
                        {
                            title: 'Instruction adherence evaluation',
                            description: 'Repeatable tests and prompt-only limits...'
                        }
                    ],
                    contactHours: 3,
                    classMinutes: 45
                }
            ]
        },
        2: {
            modules: [
                {
                    title: 'Weekend 3 — Trust Boundaries & Threat Modeling For AI',
                    topics: [
                        {
                            title: 'Assets, actors and data flows',
                            description: 'User, application, model provider, document store and tool service...'
                        },
                        {
                            title: 'Locate trust boundaries',
                            description: 'User text versus application instructions...'
                        },
                        {
                            title: 'Threat scenarios and OWASP',
                            description: 'Attacker capability, entry point, precondition, undesired outcome...'
                        },
                        {
                            title: 'Controls and residual risk',
                            description: 'Least privilege, provenance, output validation, approval...'
                        }
                    ],
                    contactHours: 3,
                    classMinutes: 45
                },
                {
                    title: 'Weekend 4 — RAG Architecture End To End',
                    topics: [
                        {
                            title: 'Ingestion and chunking',
                            description: 'Parsing, normalization, document identity, provenance, versions, chunk size...'
                        },
                        {
                            title: 'Embeddings and vector storage',
                            description: 'Embedding vectors, model/version consistency, cosine similarity...'
                        },
                        {
                            title: 'Retrieval and context assembly',
                            description: 'Top-k, metadata filters, optional reranking, deduplication...'
                        },
                        {
                            title: 'Generation and evaluation',
                            description: 'Grounded answers, citations, unsupported questions...'
                        }
                    ],
                    contactHours: 3,
                    classMinutes: 45
                }
            ]
        },
        3: {
            modules: [
                {
                    title: 'Weekend 5 — Tool Use & Agentic Architectures',
                    topics: [
                        {
                            title: 'Tool schemas and proposals',
                            description: 'Function names, descriptions, JSON argument schemas, required fields...'
                        },
                        {
                            title: 'Dispatcher and result handling',
                            description: 'Tool allow lists, argument validation, authorization hooks, request IDs...'
                        },
                        {
                            title: 'Agent loop and stopping',
                            description: 'Observe, decide, call and resume; state tracking; retries; maximum steps...'
                        },
                        {
                            title: 'Sandboxing and action approval',
                            description: 'Filesystem and network scope, read versus write tools, previews...'
                        }
                    ],
                    contactHours: 3,
                    classMinutes: 45
                },
                {
                    title: 'Weekend 6 — Auth, Permissions & Data Flow In AI Pipelines',
                    topics: [
                        {
                            title: 'Identity, sessions and credentials',
                            description: 'Authentication versus authorization, session identity, service...'
                        },
                        {
                            title: 'Permission-aware retrieval',
                            description: 'Tenant isolation, resource ownership, policy checks before context...'
                        },
                        {
                            title: 'Confused deputy and tool permissions',
                            description: 'A privileged app acting for a less-privileged user, capability...'
                        },
                        {
                            title: 'Data lifecycle and verification',
                            description: 'Prompt and output logs, cache partitioning, redaction...'
                        }
                    ],
                    contactHours: 3,
                    classMinutes: 45
                }
            ]
        },
        4: {
            modules: [
                {
                    title: 'Weekend 7 — Code Generation & Static Analysis Basics',
                    topics: [
                        {
                            title: 'Coding-assistant context',
                            description: 'Open files, selected text, repository search, comments, README files and...'
                        },
                        {
                            title: 'Generated code and taint',
                            description: 'Sources, propagation, sanitizers and sensitive sinks. Parameterized SQL...'
                        },
                        {
                            title: 'Static analysis and tests',
                            description: 'AST-based rules, data-flow/taint analysis, false positives, false negatives...'
                        },
                        {
                            title: 'Integrated readiness exercise',
                            description: 'Combine prompt provenance, RAG context, tool decisions, caller...'
                        }
                    ],
                    contactHours: 3,
                    classMinutes: 45
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
            const titleElement = document.createElement('h3');
            titleElement.textContent = moduleData.title;
            courseModulesContainer.appendChild(titleElement);

            const moduleElement = document.createElement('div');
            moduleElement.classList.add('course-module');

            const moduleContent = document.createElement('div');
            moduleContent.classList.add('module-content');
            moduleContent.innerHTML = moduleData.topics.map(topic => `
                <div class="topic">
                    <img src="assets/arrow.svg" alt="Arrow Icon">
                    <p class="topic-content"><span class="topic-title">${topic.title}</span> — ${topic.description}(${moduleData.classMinutes} min)</p>
                </div>
            `).join('');
            moduleElement.appendChild(moduleContent);

            const footer = document.createElement('div');
            footer.classList.add('module-footer');
            footer.innerHTML = `
                <p>${moduleData.contactHours} contact hours · ${moduleData.topics.length} classes × ${moduleData.classMinutes} min</p>
            `;
            moduleElement.appendChild(footer);
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

