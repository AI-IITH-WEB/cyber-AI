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

// Enroll Now — Tag Card + Modal Logic
// The modal holds one of two forms, picked by ENROLL_TALLY_EMBED_URL:
// - Tally (URL set): the Tally form is embedded in the modal; Tally stores the submissions and CV uploads.
//   hideTitle = the modal shows its own title, transparentBackground = the modal art shows through,
//   dynamicHeight = embed.js sizes the iframe to the form, alignLeft = no side margins.
// - Custom form (URL = '' — the previous setup, kept intact): a 2×2 HTML form whose submissions go to a
//   Google Apps Script web app, deployed from the enroll Google Form's owner account. It records each
//   submission as a form response and replies { ok: true } only once it's saved. Deployment must be
//   "Execute as: Me" + "Who has access: Anyone" — otherwise visitors get a Google sign-in page.
const ENROLL_TALLY_EMBED_URL = 'https://tally.so/embed/VpjZ4l?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1';
const TALLY_EMBED_SCRIPT = 'https://tally.so/widgets/embed.js';

const ENROLL_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxvTSnyUqvNrlsJBI7Fc1v4e0S76H0c74km5U_z-mHcSmAWLz5t69KHInTpHpUncg/exec';

const ENROLL_SUBMIT_TIMEOUT_MS = 15000;

// The modal opens by itself on page load until the visitor closes it. After that it stays closed on every
// page for the rest of the browser session (sessionStorage) and opens only from the Enroll Now tab.
const ENROLL_AUTO_OPEN = true;
const ENROLL_DISMISSED_KEY = 'enrollModalDismissed';

// The Tally iframe is created on first open (loadTallyForm), so pages where the modal stays closed don't load it
const ENROLL_TALLY_MARKUP = `
                    <div class="enroll-tally" id="enrollTally"></div>`;

const ENROLL_FORM_MARKUP = `
                    <form class="enroll-form" id="enrollForm">
                        <div class="enroll-field">
                            <i class="fas fa-user" aria-hidden="true"></i>
                            <input type="text" name="name" placeholder="Your name" aria-label="Your name" autocomplete="name" minlength="2" maxlength="100" pattern=".*\\S.*" title="Enter your name" required>
                        </div>
                        <div class="enroll-field">
                            <i class="fas fa-phone-alt" aria-hidden="true"></i>
                            <input type="tel" name="phone" placeholder="Phone Number" aria-label="Phone Number" autocomplete="tel" maxlength="20" pattern="\\+?(?:[0-9][ \\-]?){9,14}[0-9]" title="Enter a valid phone number (10–15 digits, country code optional)" required>
                        </div>
                        <div class="enroll-field">
                            <i class="fas fa-edit" aria-hidden="true"></i>
                            <input type="text" name="designation" placeholder="Designation" aria-label="Designation" autocomplete="organization-title" maxlength="100" pattern=".*\\S.*" title="Enter your designation" required>
                        </div>
                        <div class="enroll-field">
                            <i class="fas fa-envelope" aria-hidden="true"></i>
                            <input type="email" name="email" placeholder="Email Id" aria-label="Email Id" autocomplete="email" maxlength="254" pattern="[^@\\s]+@[^@\\s]+\\.[^@\\s]+" title="Enter a valid email address, e.g. name@example.com" required>
                        </div>
                        <p class="enroll-form-error" id="enrollFormError" role="alert" hidden></p>
                        <button type="submit" class="enroll-submit-btn">Submit</button>
                    </form>`;

const ENROLL_MARKUP = `
    <button type="button" class="enroll-fixed" id="openEnrollModal" aria-label="Enroll Now" aria-haspopup="dialog" aria-controls="enrollModal">
        <span>Enroll<br>Now</span>
    </button>

    <div id="enrollModal" class="enroll-modal">
        <div class="enroll-modal-frame" role="dialog" aria-modal="true" aria-labelledby="enrollModalTitle">
            <button type="button" class="enroll-close-btn" id="closeEnrollModal" aria-label="Close enrollment form">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M21 3L3 21" /></svg>
            </button>
            <div class="enroll-modal-panel">
                <div id="enrollFormView">
                    <h2 class="enroll-modal-title" id="enrollModalTitle">Enroll Now into Certification program in Cybersecurity x GenAI</h2>${ENROLL_TALLY_EMBED_URL ? ENROLL_TALLY_MARKUP : ENROLL_FORM_MARKUP}
                </div>
                <!-- Thank-you view — shown in place of the form after a successful submission -->
                <div id="enrollThankYou" hidden>
                    <h2 class="enroll-modal-title enroll-thankyou-title" id="enrollThankYouTitle">Thank you for enrolling into Certification program in Cybersecurity x GenAI</h2>
                    <button type="button" class="enroll-submit-btn enroll-thankyou-btn" id="enrollThankYouClose" aria-describedby="enrollThankYouTitle">Close</button>
                </div>
            </div>
        </div>
    </div>`;

document.addEventListener('DOMContentLoaded', function() {
    // A page opts in by linking enroll.css — only live, user-facing pages do
    if (!document.querySelector('link[href$="enroll.css"]')) return;
    document.body.insertAdjacentHTML('beforeend', ENROLL_MARKUP);

    const enrollModal = document.getElementById('enrollModal');
    const openEnrollModal = document.getElementById('openEnrollModal');
    const closeEnrollModal = document.getElementById('closeEnrollModal');
    const enrollForm = document.getElementById('enrollForm');
    const enrollSubmitBtn = enrollForm && enrollForm.querySelector('.enroll-submit-btn');
    const enrollFormError = document.getElementById('enrollFormError');
    const enrollPanel = enrollModal && enrollModal.querySelector('.enroll-modal-panel');
    const enrollFormView = document.getElementById('enrollFormView');
    const enrollThankYou = document.getElementById('enrollThankYou');
    const enrollThankYouClose = document.getElementById('enrollThankYouClose');
    const enrollTally = document.getElementById('enrollTally');
    let enrollTallyFrame = null;

    if (!enrollModal || !openEnrollModal) return;

    function openModal() {
        enrollModal.classList.add('is-open');
        document.documentElement.classList.add('enroll-modal-open');
        loadTallyForm();

        // First field of the custom form, or the Tally iframe
        const firstInput = enrollModal.querySelector('input, iframe');
        if (firstInput) {
            firstInput.focus();
        }
    }

    function closeModal() {
        enrollModal.classList.remove('is-open');
        document.documentElement.classList.remove('enroll-modal-open');
        resetEnrollView();
        openEnrollModal.focus();
        rememberDismissed();
    }

    // sessionStorage can throw when storage is blocked — then the modal just auto-opens on every page load
    function wasDismissed() {
        try {
            return sessionStorage.getItem(ENROLL_DISMISSED_KEY) === '1';
        } catch (err) {
            return false;
        }
    }

    function rememberDismissed() {
        try {
            sessionStorage.setItem(ENROLL_DISMISSED_KEY, '1');
        } catch (err) {
            // Ignore — see wasDismissed()
        }
    }

    // Swap the form for the thank-you view, keeping the panel at the same height
    function showThankYou() {
        if (!enrollFormView || !enrollThankYou || !enrollThankYou.hidden) return;

        // Tells Google Tag Manager an enrollment was submitted (the thank-you view isn't a page load,
        // so GTM can't see it otherwise). In GTM, trigger on Custom Event "enroll_form_submit".
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'enroll_form_submit' });

        enrollPanel.style.minHeight = enrollPanel.offsetHeight + 'px';
        enrollFormView.hidden = true;
        enrollThankYou.hidden = false;
        if (enrollThankYouClose) {
            enrollThankYouClose.focus();
        }
    }

    // After a submission, the next open starts from a fresh form
    function resetEnrollView() {
        if (!enrollThankYou || enrollThankYou.hidden) return;
        enrollPanel.style.minHeight = '';
        enrollThankYou.hidden = true;
        enrollFormView.hidden = false;
        if (enrollForm) {
            enrollForm.reset();
        }
        // Tally shows its own done page after a submit — reload it for a blank form
        if (enrollTallyFrame && enrollTallyFrame.src) {
            enrollTallyFrame.src = enrollTallyFrame.src;
        }
    }

    function setSubmitting(isSubmitting) {
        enrollSubmitBtn.disabled = isSubmitting;
        enrollSubmitBtn.textContent = isSubmitting ? 'Submitting…' : 'Submit';
    }

    function showFormError(message) {
        enrollFormError.textContent = message;
        enrollFormError.hidden = !message;
    }

    // Creates the Tally iframe on first open. embed.js loads it and keeps it sized to the form
    // (dynamicHeight); if embed.js is blocked or fails, the form still loads at the iframe's fixed height.
    function loadTallyForm() {
        if (!enrollTally || enrollTallyFrame) return;

        enrollTallyFrame = document.createElement('iframe');
        enrollTallyFrame.title = 'Enrollment form';
        enrollTallyFrame.height = 420;
        enrollTallyFrame.dataset.tallySrc = ENROLL_TALLY_EMBED_URL;
        enrollTally.appendChild(enrollTallyFrame);

        function loadWithoutScript() {
            if (!enrollTallyFrame.src) {
                enrollTallyFrame.src = ENROLL_TALLY_EMBED_URL;
            }
        }

        if (typeof Tally !== 'undefined') {
            Tally.loadEmbeds();
            return;
        }

        // Some pages already include embed.js (async); otherwise add it
        let script = document.querySelector('script[src="' + TALLY_EMBED_SCRIPT + '"]');
        if (!script) {
            script = document.createElement('script');
            script.src = TALLY_EMBED_SCRIPT;
            document.body.appendChild(script);
        }
        script.addEventListener('load', function() {
            if (typeof Tally !== 'undefined') {
                Tally.loadEmbeds();
            }
            loadWithoutScript();
        });
        script.addEventListener('error', loadWithoutScript);
        // Covers an embed.js that had already failed before this ran (its events won't fire again)
        setTimeout(loadWithoutScript, 8000);
    }

    openEnrollModal.addEventListener('click', openModal);

    if (closeEnrollModal) {
        closeEnrollModal.addEventListener('click', closeModal);
    }

    if (enrollThankYouClose) {
        enrollThankYouClose.addEventListener('click', closeModal);
    }

    enrollModal.addEventListener('click', function(event) {
        if (event.target === enrollModal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && enrollModal.classList.contains('is-open')) {
            closeModal();
        }
    });

    // Tally posts its events to the page as JSON strings — swap in the thank-you view once the form is submitted
    window.addEventListener('message', function(event) {
        if (event.origin !== 'https://tally.so' || typeof event.data !== 'string') return;
        if (!enrollModal.classList.contains('is-open')) return;

        let message;
        try {
            message = JSON.parse(event.data);
        } catch (err) {
            return;
        }
        if (message && message.event === 'Tally.FormSubmitted') {
            showThankYou();
        }
    });

    if (ENROLL_AUTO_OPEN && !wasDismissed()) {
        openModal();
    }

    // The rest only applies to the custom form (not rendered when the Tally form is used)
    if (!enrollForm) return;

    // Runs only once the browser's built-in validation (required, pattern, type=email) has passed
    enrollForm.addEventListener('submit', function(event) {
        event.preventDefault();
        showFormError('');

        if (!ENROLL_ENDPOINT) {
            console.warn('Enroll form: ENROLL_ENDPOINT is not configured.');
            showFormError('Enrollment is not open yet. Please try again later.');
            return;
        }

        const payload = {};
        new FormData(enrollForm).forEach(function(value, name) {
            payload[name] = value.trim();
        });

        setSubmitting(true);

        // Give up on a stalled request so the button isn't stuck on "Submitting…"
        const controller = new AbortController();
        const timeoutId = setTimeout(function() {
            controller.abort();
        }, ENROLL_SUBMIT_TIMEOUT_MS);

        // A string body is sent as text/plain, which Apps Script accepts without a CORS preflight.
        // Thank-you only on { ok: true }; { ok: false }, a sign-in/HTML page, network errors and
        // timeouts all show the inline error instead.
        fetch(ENROLL_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(payload),
            signal: controller.signal
        })
            .then(function(response) {
                return response.json();
            })
            .then(function(result) {
                if (!result.ok) {
                    throw new Error(result.error);
                }
                showThankYou();
            })
            .catch(function(err) {
                console.error('Enroll form: submission failed.', err);
                showFormError('Could not submit your details. Please check your connection and try again.');
            })
            .finally(function() {
                clearTimeout(timeoutId);
                setSubmitting(false);
            });
    });
});
