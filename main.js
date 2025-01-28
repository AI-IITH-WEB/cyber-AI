// document.addEventListener('DOMContentLoaded', () => {
//     const hamburger = document.getElementById('hamburger');
//     const navLinks = document.getElementById('navLinks');
//     const contactBtn = document.getElementById('contactBtn');
  
//     hamburger.addEventListener('click', () => {
//       navLinks.classList.toggle('active');
//       contactBtn.classList.toggle('active');
//     });
//   });

document.addEventListener('DOMContentLoaded', () => {
    const phases = document.querySelectorAll('.phase');
    const courseModulesContainer = document.querySelector('.course-modules');
    const moduleHeadings = document.querySelectorAll('.course-modules h3');
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
                    instructor: 'IITH AI',
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
                    instructor: 'Dr. Clement',
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
                    instructor: 'IITH AI',
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
                    instructor: 'IITH AI',
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
                    instructor: 'IITH AI',
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
                    instructor: 'IITH AI',
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
                    instructor: 'IITH AI',
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
                    instructor: 'IITH AI',
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
                    instructor: 'IITH AI',
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
                    instructor: 'IITH AI',
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
                    instructor: 'Naresh & Saby',
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
                    instructor: 'Naresh & Saby',
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
                    instructor: 'Naresh & Saby',
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
                    instructor: 'Naresh, Saby & Clement',
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
                    instructor: 'Naresh & Saby',
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
                    instructor: 'Naresh & Saby',
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
                    instructor: 'Naresh & Saby',
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
                    instructor: 'Naresh & Saby',
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
    const closeBtn = document.querySelector('.close');
    const videoIframe = document.getElementById('videoIframe');

    const videoUrl = "/"; 
    videoImage.addEventListener('click', () => {
        modal.style.display = 'block';
        videoIframe.src = videoUrl; 
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        videoIframe.src = ""; 
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            videoIframe.src = ""; 
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
