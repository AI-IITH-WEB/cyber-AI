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

// Analytics — every event is sent as one Google tag event, gtag('event', name, params), which reaches:
// - Google Analytics 4 (G-KWDYBFBBNX, configured in each page's head), where it is recorded as-is;
// - each Google Tag Manager container (GTM-PLBRZSKP, GTM-NNLCB9RF, GTM-M5X6STR5), where it is a Custom Event of
//   the same name, its parameters readable with Data Layer Variables named "eventModel.<param>".
// The events ad campaigns optimise for are also sent to the Meta Pixel and the OpenAI Ads pixel (AD_PIXEL_EVENTS).
// Never put personal data (names, emails, phone numbers, form answers) in the parameters: Google's and Meta's terms
// forbid it. Open any page with ?analytics_debug=1 to log each event to the console and see it in GA4 DebugView
// for the rest of the browser session (?analytics_debug=0 turns it off).
// The event list is in PROJECT_CONTEXT.md (section 2.6).
const ANALYTICS_CALLBACK_TIMEOUT_MS = 1000;
const ANALYTICS_DEBUG_KEY = 'analyticsDebug';

// GA4 event name → Meta Pixel event ([fbq method, event name]) and/or OpenAI Ads pixel standard event.
// Meta standard events (track) feed ad optimisation; trackCustom ones are for custom audiences and conversions.
// Both pixels get the same event ID, ready for de-duplication if a server-side Conversions API is added later.
const AD_PIXEL_EVENTS = {
    enroll_form_submit: { meta: ['track', 'Lead'], openai: 'lead_created' },
    register_form_submit: { meta: ['track', 'CompleteRegistration'], openai: 'registration_completed' },
    enroll_modal_open: { meta: ['trackCustom', 'EnrollModalOpen'] },
    cta_click: { meta: ['trackCustom', 'CTAClick'] },
    brochure_download: { meta: ['trackCustom', 'BrochureDownload'] },
    contact_click: { meta: ['track', 'Contact'] }
};

// sessionStorage can throw when storage is blocked — then debug mode only lasts for the page with the parameter
const analyticsDebug = (function() {
    const param = /[?&]analytics_debug=([01])(?:&|$)/.exec(window.location.search);
    try {
        if (param) {
            sessionStorage.setItem(ANALYTICS_DEBUG_KEY, param[1]);
        }
        return sessionStorage.getItem(ANALYTICS_DEBUG_KEY) === '1';
    } catch (err) {
        return !!param && param[1] === '1';
    }
})();

// Same as the gtag() each page defines in its head (gtag.js and GTM only read Arguments objects from dataLayer).
// Defined here too because some pages load main.js before that snippet.
function gtagPush() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
}

// Drops empty values; GA4 keeps at most 100 characters of a parameter value
function cleanEventParams(params) {
    const clean = {};
    Object.keys(params || {}).forEach(function(key) {
        let value = params[key];
        if (value === undefined || value === null || value === '' || (typeof value === 'number' && isNaN(value))) return;
        if (typeof value === 'string') {
            value = value.replace(/\s+/g, ' ').trim().slice(0, 100);
        }
        clean[key] = value;
    });
    return clean;
}

// The Meta Pixel is on every page; the OpenAI pixel only on pages with a form (index, about, terms, register).
// Both queue calls made before their script has loaded, like gtag.
function sendToAdPixels(name, params) {
    const pixel = AD_PIXEL_EVENTS[name];
    if (!pixel) return;
    const eventId = name + '.' + Date.now() + '.' + Math.random().toString(36).slice(2, 10);
    try {
        if (pixel.meta && typeof window.fbq === 'function') {
            window.fbq(pixel.meta[0], pixel.meta[1], Object.assign({}, params), { eventID: eventId });
        }
        if (pixel.openai && typeof window.oaiq === 'function') {
            window.oaiq('measure', pixel.openai, { type: 'customer_action' }, { event_id: eventId });
        }
    } catch (err) {
        // A pixel failing must never break the page or the Google events
        console.error('Analytics: ad pixel event failed.', err);
    }
}

// callback (optional) runs once the event has been sent, or after ANALYTICS_CALLBACK_TIMEOUT_MS when the tag
// scripts are slow or blocked — for code that leaves the page right after
function trackEvent(name, params, callback) {
    const data = cleanEventParams(params);
    sendToAdPixels(name, data);
    if (analyticsDebug) {
        data.debug_mode = true;
        console.info('[analytics]', name, data);
    }
    if (typeof callback === 'function') {
        let called = false;
        const done = function() {
            if (called) return;
            called = true;
            callback();
        };
        data.event_callback = done;
        data.event_timeout = ANALYTICS_CALLBACK_TIMEOUT_MS;
        setTimeout(done, ANALYTICS_CALLBACK_TIMEOUT_MS);
    }
    gtagPush('event', name, data);
}

// Form submissions are the site's conversions. Each sends <form>_form_submit (GTM has triggered on
// enroll_form_submit since before this event layer, so that name is kept) plus GA4's recommended generate_lead,
// which feeds GA4's lead reports — mark one of the two as the key event, not both.
function trackFormSubmit(formName, params, callback) {
    const data = Object.assign({ form_name: formName }, params);
    trackEvent(formName + '_form_submit', data);
    trackEvent('generate_lead', Object.assign({ lead_source: formName + '_form' }, data), callback);
    // index.html downloads its tag scripts on the visitor's first interaction with the page; typing in a Tally form
    // happens inside its iframe and doesn't count, so start the download now to send the conversion right away
    if (typeof window.loadTagsNow === 'function') {
        window.loadTagsNow();
    }
}

// Tally posts its events to the page as JSON strings: { event: 'Tally.FormLoaded' | 'Tally.FormPageView' |
// 'Tally.FormSubmitted', payload: { formId, page, ... } }. Returns the parsed message, or null for anything else.
function parseTallyMessage(event) {
    if (event.origin !== 'https://tally.so' || typeof event.data !== 'string') return null;
    try {
        const message = JSON.parse(event.data);
        return message && typeof message.event === 'string' ? message : null;
    } catch (err) {
        return null;
    }
}

// Records a Tally form's load, page views and submission. The submit payload also holds the respondent's answers;
// they are deliberately not sent. onSubmitTracked runs once a submission has been sent (see trackEvent's callback).
// Also called by register.html.
function trackTallyMessage(formName, message, onSubmitTracked) {
    const payload = message.payload || {};
    const params = { form_name: formName, form_provider: 'tally', form_id: payload.formId };

    if (message.event === 'Tally.FormLoaded') {
        trackEvent(formName + '_form_load', params);
    } else if (message.event === 'Tally.FormPageView') {
        trackEvent(formName + '_form_page_view', Object.assign({ form_page: Number(payload.page) }, params));
    } else if (message.event === 'Tally.FormSubmitted') {
        trackFormSubmit(formName, params, onSubmitTracked);
    }
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
                    <img src="assets/arrow.svg" alt="Arrow Icon" width="13" height="13">
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
        // The YouTube embed has no JS API enabled, so opening the player is all that can be recorded
        trackEvent('video_open', { video_provider: 'youtube', video_url: videoUrl, click_location: 'hero' });
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

    // Recalculate on window resize. On the first slide the offset is 0 whatever the card width, so there's
    // nothing to measure — skipping it avoids forcing a full-page layout while the page is still loading
    // (mobile browsers fire a resize during load).
    window.addEventListener('resize', function() {
        if (currentSlide !== 0) {
            goToSlide(currentSlide);
        }
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
                            <svg viewBox="0 0 448 512" width="0.875em" height="1em" aria-hidden="true" focusable="false"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/></svg>
                            <input type="text" name="name" placeholder="Your name" aria-label="Your name" autocomplete="name" minlength="2" maxlength="100" pattern=".*\\S.*" title="Enter your name" required>
                        </div>
                        <div class="enroll-field">
                            <svg viewBox="0 0 512 512" width="1em" height="1em" aria-hidden="true" focusable="false"><path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/></svg>
                            <input type="tel" name="phone" placeholder="Phone Number" aria-label="Phone Number" autocomplete="tel" maxlength="20" pattern="\\+?(?:[0-9][ \\-]?){9,14}[0-9]" title="Enter a valid phone number (10–15 digits, country code optional)" required>
                        </div>
                        <div class="enroll-field">
                            <svg viewBox="0 0 576 512" width="1.125em" height="1em" aria-hidden="true" focusable="false"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"/></svg>
                            <input type="text" name="designation" placeholder="Designation" aria-label="Designation" autocomplete="organization-title" maxlength="100" pattern=".*\\S.*" title="Enter your designation" required>
                        </div>
                        <div class="enroll-field">
                            <svg viewBox="0 0 512 512" width="1em" height="1em" aria-hidden="true" focusable="false"><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/></svg>
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
    // Analytics state: when the modal was last opened, and whether the visitor has started typing in the custom form
    let enrollOpenedAt = 0;
    let enrollFormStarted = false;
    const ENROLL_FORM_PROVIDER = ENROLL_TALLY_EMBED_URL ? 'tally' : 'custom';
    const ENROLL_CUSTOM_FORM_PARAMS = { form_name: 'enroll', form_provider: 'custom', form_id: 'enrollForm' };

    if (!enrollModal || !openEnrollModal) return;

    // trigger: 'auto' (opened on page load) or 'enroll_tab' (the Enroll Now tab)
    function openModal(trigger) {
        enrollModal.classList.add('is-open');
        document.documentElement.classList.add('enroll-modal-open');
        loadTallyForm();

        // First field of the custom form, or the Tally iframe
        const firstInput = enrollModal.querySelector('input, iframe');
        if (firstInput) {
            firstInput.focus();
        }

        enrollOpenedAt = Date.now();
        trackEvent('enroll_modal_open', { modal_trigger: trigger, form_provider: ENROLL_FORM_PROVIDER });
    }

    // method: 'close_button', 'thankyou_button', 'backdrop' or 'escape_key'
    function closeModal(method) {
        if (!enrollModal.classList.contains('is-open')) return;
        trackEvent('enroll_modal_close', {
            close_method: method,
            modal_stage: enrollThankYou && !enrollThankYou.hidden ? 'thank_you' : 'form',
            open_seconds: Math.round((Date.now() - enrollOpenedAt) / 1000),
            form_provider: ENROLL_FORM_PROVIDER
        });

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

    // Swap the form for the thank-you view, keeping the panel at the same height.
    // The submission itself is recorded by the caller (enroll_form_submit + generate_lead, see trackFormSubmit).
    function showThankYou() {
        if (!enrollFormView || !enrollThankYou || !enrollThankYou.hidden) return;

        // The thank-you view isn't a page load, so GA4 and GTM can't see it without this event
        trackEvent('enroll_thankyou_view', { display: 'modal', form_provider: ENROLL_FORM_PROVIDER });

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
            enrollFormStarted = false;
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

    openEnrollModal.addEventListener('click', function() {
        openModal('enroll_tab');
    });

    if (closeEnrollModal) {
        closeEnrollModal.addEventListener('click', function() {
            closeModal('close_button');
        });
    }

    if (enrollThankYouClose) {
        enrollThankYouClose.addEventListener('click', function() {
            closeModal('thankyou_button');
        });
    }

    enrollModal.addEventListener('click', function(event) {
        if (event.target === enrollModal) {
            closeModal('backdrop');
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && enrollModal.classList.contains('is-open')) {
            closeModal('escape_key');
        }
    });

    // Records the Tally form's events, and swaps in the thank-you view once the form is submitted.
    // Ignored while the modal is closed: closing it after a submit reloads the form in the background.
    window.addEventListener('message', function(event) {
        const message = parseTallyMessage(event);
        if (!message || !enrollModal.classList.contains('is-open')) return;

        const isSubmit = message.event === 'Tally.FormSubmitted';
        // A repeated submit message while the thank-you view is already up isn't a new enrollment
        if (isSubmit && enrollThankYou && !enrollThankYou.hidden) return;

        trackTallyMessage('enroll', message);
        if (isSubmit) {
            showThankYou();
        }
    });

    if (ENROLL_AUTO_OPEN && !wasDismissed()) {
        // Opens right after the page's first paint rather than before it: adding the Tally iframe and focusing
        // it forces a full layout, which would otherwise hold back the first render (PageSpeed: LCP, TBT).
        // requestAnimationFrame runs just before the next paint; the setTimeout inside it, just after.
        requestAnimationFrame(function() {
            setTimeout(function() {
                if (!enrollModal.classList.contains('is-open') && !wasDismissed()) {
                    openModal('auto');
                }
            }, 0);
        });
    }

    // The rest only applies to the custom form (not rendered when the Tally form is used)
    if (!enrollForm) return;

    // First keystroke after the form is shown (again after each submission)
    enrollForm.addEventListener('input', function() {
        if (enrollFormStarted) return;
        enrollFormStarted = true;
        trackEvent('enroll_form_start', ENROLL_CUSTOM_FORM_PARAMS);
    });

    // The browser's built-in validation rejected a field on submit (fires once per invalid field; no values sent)
    enrollForm.addEventListener('invalid', function(event) {
        trackEvent('enroll_form_error', Object.assign({
            error_type: 'validation',
            form_field: event.target.name
        }, ENROLL_CUSTOM_FORM_PARAMS));
    }, true);

    // Runs only once the browser's built-in validation (required, pattern, type=email) has passed
    enrollForm.addEventListener('submit', function(event) {
        event.preventDefault();
        showFormError('');

        if (!ENROLL_ENDPOINT) {
            console.warn('Enroll form: ENROLL_ENDPOINT is not configured.');
            showFormError('Enrollment is not open yet. Please try again later.');
            trackEvent('enroll_form_error', Object.assign({ error_type: 'not_configured' }, ENROLL_CUSTOM_FORM_PARAMS));
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
                trackFormSubmit('enroll', ENROLL_CUSTOM_FORM_PARAMS);
                showThankYou();
            })
            .catch(function(err) {
                console.error('Enroll form: submission failed.', err);
                showFormError('Could not submit your details. Please check your connection and try again.');
                trackEvent('enroll_form_error', Object.assign({
                    error_type: err && err.name === 'AbortError' ? 'timeout' : 'submit_failed'
                }, ENROLL_CUSTOM_FORM_PARAMS));
            })
            .finally(function() {
                clearTimeout(timeoutId);
                setSubmitting(false);
            });
    });
});

// Analytics — page interactions, on every page. Uses one delegated click listener (so it also covers the nav and
// footer that nav.js injects), and runs after each feature's own click handler, so it sees the updated state.
document.addEventListener('DOMContentLoaded', function() {
    const SCROLL_DEPTH_MARKS = [25, 50, 75, 100];
    const VIDEO_PROGRESS_MARKS = [25, 50, 75];

    // Thank-you pages name their event on <body data-analytics-event="...">
    const pageEvent = document.body.getAttribute('data-analytics-event');
    if (pageEvent) {
        trackEvent(pageEvent, { display: 'page' });
    }

    function elementText(el) {
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (text) return text;
        const img = el.querySelector('img');
        return el.getAttribute('aria-label') || el.getAttribute('title') || (img && (img.alt || img.title)) || '';
    }

    // Where on the page the click happened: navbar, footer, enroll_modal, a section id (fee, faqs, ...), hero, page
    function clickLocation(el) {
        if (el.closest('#enrollModal')) return 'enroll_modal';
        if (el.closest('.navbar')) return 'navbar';
        if (el.closest('footer')) return 'footer';
        const section = el.closest('section[id]');
        if (section) return section.id;
        if (el.closest('.hero')) return 'hero';
        if (el.closest('.thankyou-popup')) return 'thank_you';
        return 'page';
    }

    // A same-tab navigation to another page (not a new tab, download, #anchor on this page, mailto: or tel:)
    function isPageNavigation(event, link) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
        if ((link.target && link.target !== '_self') || link.hasAttribute('download')) return false;
        if (link.protocol !== 'http:' && link.protocol !== 'https:') return false;
        const samePage = link.host === window.location.host && link.pathname === window.location.pathname &&
            link.search === window.location.search;
        return !(samePage && link.hash);
    }

    // index.html downloads its tag scripts only after the visitor's first interaction (see its head). A link
    // clicked before they've arrived would unload the page with the click's event still unsent, so hold that
    // navigation until the event is sent or the scripts have settled (loaded or failed) — at most
    // ANALYTICS_CALLBACK_TIMEOUT_MS. The other pages load their tags right away, so this never kicks in there.
    function trackLinkClick(event, link, name, params) {
        const holdNavigation = typeof window.tagScriptsPending === 'function' && window.tagScriptsPending() &&
            isPageNavigation(event, link);
        if (!holdNavigation) {
            trackEvent(name, params);
            return;
        }
        event.preventDefault();
        let navigated = false;
        function navigate() {
            if (navigated) return;
            navigated = true;
            window.location.href = link.href;
        }
        trackEvent(name, params, navigate);
        window.whenTagScriptsLoaded(function() {
            setTimeout(navigate, 300);
        });
    }

    document.addEventListener('click', function(event) {
        const target = event.target instanceof Element ? event.target : null;
        if (!target) return;
        const location = clickLocation(target);

        // Course offerings — weekend tabs
        const phase = target.closest('.phase');
        if (phase) {
            const title = phase.querySelector('.phase-title');
            trackEvent('course_phase_select', {
                phase_number: Number(phase.getAttribute('data-phase')),
                phase_title: title ? title.textContent : ''
            });
            return;
        }

        // FAQ — only opening counts (the accordion has already toggled .active)
        const faqQuestion = target.closest('.faq-question');
        if (faqQuestion) {
            const item = faqQuestion.closest('.faq-item');
            if (item && item.classList.contains('active')) {
                const question = faqQuestion.querySelector('h3');
                trackEvent('faq_open', { faq_question: question ? question.textContent : '' });
            }
            return;
        }

        // Successful learners — photo opened in the image modal
        const learnerImage = target.closest('.learner-img-wrapper');
        if (learnerImage) {
            const img = learnerImage.querySelector('img');
            trackEvent('learner_image_view', { image_title: img ? img.alt : '' });
            return;
        }

        // Alumni stories — slider dots
        const storyDot = target.closest('.story-dot');
        if (storyDot) {
            trackEvent('alumni_slide_change', { slide_number: Number(storyDot.getAttribute('data-slide')) + 1 });
            return;
        }

        if (target.closest('#loadMoreLearners')) {
            trackEvent('learners_load_more', {});
            return;
        }

        // Mobile menu (toggleMenu has already run)
        if (target.closest('.hamburger')) {
            const navLinks = document.querySelector('.nav-links');
            trackEvent('nav_menu_toggle', {
                menu_state: navLinks && navLinks.classList.contains('active') ? 'open' : 'close'
            });
            return;
        }

        // "Apply Now" in the countdown card is a <button> that navigates from its onclick
        const registerButton = target.closest('.register-btn');
        if (registerButton) {
            trackEvent('cta_click', {
                cta_text: elementText(registerButton),
                cta_destination: 'register',
                click_location: location,
                link_url: new URL('./register.html', window.location.href).href
            });
            return;
        }

        const link = target.closest('a[href]');
        if (!link) return;
        const href = link.getAttribute('href') || '';
        if (href === '#' || /^javascript:/i.test(href)) return;
        const linkParams = { link_text: elementText(link), link_url: link.href, click_location: location };

        if (/\.pdf$/i.test(link.pathname)) {
            trackLinkClick(event, link, 'brochure_download', Object.assign({
                file_name: decodeURIComponent(link.pathname.split('/').pop())
            }, linkParams));
        } else if (link.closest('.social-links')) {
            trackEvent('social_click', Object.assign({ social_network: link.getAttribute('aria-label') }, linkParams));
        } else if (link.protocol === 'mailto:' || link.protocol === 'tel:') {
            // The address itself isn't sent
            trackEvent('contact_click', {
                contact_method: link.protocol === 'mailto:' ? 'email' : 'phone',
                click_location: location
            });
        } else if (/register\.html$/i.test(link.pathname) || link.classList.contains('home-btn')) {
            trackLinkClick(event, link, 'cta_click', Object.assign({
                cta_text: linkParams.link_text,
                cta_destination: link.classList.contains('home-btn') ? 'home' : 'register'
            }, linkParams));
        } else if (location === 'navbar') {
            trackLinkClick(event, link, 'nav_click', linkParams);
        } else {
            trackLinkClick(event, link, 'link_click', Object.assign({
                outbound: link.hostname !== window.location.hostname
            }, linkParams));
        }
    });

    // Section reached — once per section per page, when its top enters the upper half of the screen.
    // (IntersectionObserver works whichever element scrolls; on index.html that's <body>, not the window.)
    const sections = document.querySelectorAll('section[id]');
    if ('IntersectionObserver' in window && sections.length) {
        const sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                sectionObserver.unobserve(entry.target);
                const heading = entry.target.querySelector('h2');
                trackEvent('section_view', {
                    section_id: entry.target.id,
                    section_title: heading ? heading.textContent : ''
                });
            });
        }, { rootMargin: '0px 0px -50% 0px' });
        sections.forEach(function(section) {
            sectionObserver.observe(section);
        });
    }

    // Scroll depth — 25/50/75/100 %, once each per page. GA4's built-in scroll event only watches the window, and
    // index.html scrolls <body> instead (html and body are height: 100% with overflow-x: hidden), so it never fires
    // there. Scroll events don't bubble, hence the capture-phase listener; other scrolling elements (modals, the
    // slider) are ignored.
    let nextScrollMark = 0;
    let scrollCheckQueued = false;
    document.addEventListener('scroll', function(event) {
        if (scrollCheckQueued || nextScrollMark >= SCROLL_DEPTH_MARKS.length) return;
        const t = event.target;
        let scroller = null;
        if (t === document || t === document.documentElement) {
            scroller = document.scrollingElement || document.documentElement;
        } else if (t === document.body) {
            scroller = document.body;
        }
        if (!scroller) return;

        scrollCheckQueued = true;
        requestAnimationFrame(function() {
            scrollCheckQueued = false;
            const scrollable = scroller.scrollHeight - scroller.clientHeight;
            if (scrollable <= 0) return;
            // Within 2px of the end counts as the bottom (fractional scroll positions on high-DPI screens)
            const percent = scrollable - scroller.scrollTop <= 2 ? 100 : Math.round(scroller.scrollTop / scrollable * 100);
            while (nextScrollMark < SCROLL_DEPTH_MARKS.length && percent >= SCROLL_DEPTH_MARKS[nextScrollMark]) {
                trackEvent('scroll_depth', { percent_scrolled: SCROLL_DEPTH_MARKS[nextScrollMark] });
                nextScrollMark++;
            }
        });
    }, { capture: true, passive: true });

    // Self-hosted videos (alumni stories modal) — GA4's built-in video tracking only covers YouTube.
    // Same event and parameter names as GA4's YouTube events. Counted again each time a video is (re)loaded:
    // load() fires 'emptied' before the 'play' of the play() that follows it ('loadstart' can come after 'play').
    function videoTitle(video) {
        const source = video.querySelector('source');
        const path = (source && source.getAttribute('src')) || video.getAttribute('src') || '';
        const thumbnail = Array.prototype.find.call(document.querySelectorAll('[data-video-src]'), function(el) {
            return el.getAttribute('data-video-src') === path;
        });
        const card = thumbnail && thumbnail.closest('.story-card');
        const person = card && card.querySelector('.person-name');
        if (person) return person.textContent;
        return path.split('/').pop().replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
    }

    document.querySelectorAll('video').forEach(function(video) {
        let started = false;
        let progressMarks = VIDEO_PROGRESS_MARKS.slice();

        function videoParams(extra) {
            return Object.assign({
                video_provider: 'self-hosted',
                video_title: videoTitle(video),
                video_url: video.currentSrc,
                video_duration: Math.round(video.duration),
                video_current_time: Math.round(video.currentTime)
            }, extra);
        }

        video.addEventListener('emptied', function() {
            started = false;
            progressMarks = VIDEO_PROGRESS_MARKS.slice();
        });
        // Once per load: pausing and resuming isn't a new start
        video.addEventListener('play', function() {
            if (started || !video.currentSrc) return;
            started = true;
            trackEvent('video_start', videoParams());
        });
        video.addEventListener('timeupdate', function() {
            if (!video.duration || !video.currentTime) return;
            const percent = video.currentTime / video.duration * 100;
            while (progressMarks.length && percent >= progressMarks[0]) {
                trackEvent('video_progress', videoParams({ video_percent: progressMarks.shift() }));
            }
        });
        video.addEventListener('ended', function() {
            trackEvent('video_complete', videoParams({ video_percent: 100 }));
        });
    });
});
