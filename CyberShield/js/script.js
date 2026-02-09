document.addEventListener('DOMContentLoaded', function () {
    // Initialize everything
    console.log('🚀 Initializing CyberShield Protection System...');

    // Configure Toastr
    toastr.options = {
        positionClass: 'toast-top-right',
        progressBar: true,
        timeOut: 4000,
        closeButton: true,
        newestOnTop: true,
        preventDuplicates: false
    };

    // Initialize audio context and sounds
    initAudioSystem();

    // Initialize mouse-only interface
    initMouseInterface();

    // Start loading animation
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += 2;
        const progressFill = document.getElementById('loadingProgress');
        const loadingText = document.getElementById('loadingText');

        if (progressFill) {
            progressFill.style.width = progress + '%';
        }

        if (loadingText) {
            if (progress < 30) {
                loadingText.textContent = 'Initializing Protection System...';
            } else if (progress < 60) {
                loadingText.textContent = 'Loading Security Modules...';
            } else if (progress < 90) {
                loadingText.textContent = 'Starting 3D Visualization...';
            } else {
                loadingText.textContent = 'Almost ready...';
            }
        }

        if (progress >= 100) {
            clearInterval(loadingInterval);

            // Hide loading screen and show main content
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                const mainContainer = document.getElementById('mainContainer');

                if (loadingScreen) loadingScreen.style.display = 'none';
                if (mainContainer) {
                    mainContainer.style.display = 'block';
                    // Force reflow to trigger animation
                    mainContainer.offsetHeight;
                }

                // Initialize all components
                initializeSystem();

                // Show welcome message
                showAlert('CyberShield Protection System initialized successfully', 'success');
                showNotification('System Ready', 'CyberShield Protection System initialized successfully', 'success');
                toastr.success('System initialized successfully!', 'CyberShield Ready');

                // Play notification sound
                playSound('notification');

                // Force content to show properly
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    document.body.style.overflow = 'auto';
                }, 100);
            }, 500);
        }
    }, 30);
});

// Audio System with Alert.mp3 File
let audioContext = null;
let alertBuffer = null;
let notificationBuffer = null;
let muted = false;
let volume = 0.8;

function initAudioSystem() {
    try {
        // Create audio context
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();

        // Load alert.mp3 file
        loadAlertSound();

        // Create notification sound using Web Audio API
        createNotificationSound();

        console.log('✅ Audio system initialized with alert.mp3');
    } catch (error) {
        console.warn('Audio system initialization failed:', error);
    }
}

function loadAlertSound() {
    // Create a request for the alert.mp3 file
    const request = new XMLHttpRequest();
    request.open('GET', 'assets/audio/alert.mp3', true);
    request.responseType = 'arraybuffer';

    request.onload = function () {
        if (request.status === 200) {
            // Decode the audio data
            audioContext.decodeAudioData(request.response, function (buffer) {
                alertBuffer = buffer;
                console.log('✅ Alert.mp3 loaded successfully');
            }, function (error) {
                console.error('Error decoding alert.mp3:', error);
                // Fallback to generated sound
                createAlertSound();
            });
        } else {
            console.warn('Could not load alert.mp3, using generated sound');
            // Fallback to generated sound
            createAlertSound();
        }
    };

    request.onerror = function () {
        console.warn('Network error loading alert.mp3, using generated sound');
        // Fallback to generated sound
        createAlertSound();
    };

    request.send();
}

function createAlertSound() {
    // Create an alert sound using oscillators as fallback
    const sampleRate = audioContext.sampleRate;
    const duration = 1; // seconds
    const frameCount = sampleRate * duration;
    const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        // Create an alert sound with increasing frequency
        const freq = 400 + 600 * (t / duration); // Sweep from 400-1000 Hz
        const envelope = Math.exp(-t * 2); // Exponential decay
        data[i] = Math.sin(2 * Math.PI * freq * t) * 0.3 * envelope;
    }

    alertBuffer = buffer;
}

function createNotificationSound() {
    // Create a notification sound using Web Audio API
    const sampleRate = audioContext.sampleRate;
    const duration = 0.5; // seconds
    const frameCount = sampleRate * duration;
    const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        // Create a pleasant notification sound
        const freq1 = 800;
        const freq2 = 1000;
        const envelope = Math.exp(-t * 5); // Exponential decay
        data[i] = (Math.sin(2 * Math.PI * freq1 * t) + Math.sin(2 * Math.PI * freq2 * t)) * 0.2 * envelope;
    }

    notificationBuffer = buffer;
}

function playSound(name) {
    if (!audioContext || muted) return;

    // Resume audio context if it's suspended (browser policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // Check if sound alerts are enabled
    const soundAlertsEnabled = document.getElementById('soundAlerts').checked;
    if (!soundAlertsEnabled) return;

    try {
        const source = audioContext.createBufferSource();

        if (name === 'alert' && alertBuffer) {
            source.buffer = alertBuffer;
        } else if (name === 'notification' && notificationBuffer) {
            source.buffer = notificationBuffer;
        } else {
            return; // Sound not loaded
        }

        // Get volume setting
        const volumeSlider = document.getElementById('volumeSlider');
        const currentVolume = volumeSlider ? volumeSlider.value / 100 : volume;

        // Create gain node for volume control
        const gainNode = audioContext.createGain();
        gainNode.gain.value = currentVolume;

        // Connect nodes
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Play the sound
        source.start();
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

// Notification System
function showNotification(title, message, type = 'info', duration = 5000) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Determine icon based on type
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    else if (type === 'warning') icon = 'fa-exclamation-triangle';
    else if (type === 'danger') icon = 'fa-exclamation-circle';

    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
        <div class="notification-progress">
            <div class="notification-progress-bar"></div>
        </div>
    `;

    // Add to container
    container.appendChild(notification);

    // Add event listeners
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });

    // Auto-remove after duration
    const timeout = setTimeout(() => {
        removeNotification(notification);
    }, duration);

    // Store timeout ID for cleanup
    notification.dataset.timeoutId = timeout;

    // Play sound if enabled
    if (type === 'danger' || type === 'warning') {
        playSound('alert');
    } else {
        playSound('notification');
    }
}

function removeNotification(notification) {
    if (!notification) return;

    // Clear timeout if exists
    const timeoutId = notification.dataset.timeoutId;
    if (timeoutId) {
        clearTimeout(parseInt(timeoutId));
    }

    // Add fade out animation
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';

    // Remove after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Mouse-Only Interface
function initMouseInterface() {
    // Sound control
    const soundBtn = document.getElementById('soundBtn');
    const volumePopup = document.getElementById('volumePopup');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    const muteSound = document.getElementById('muteSound');

    if (soundBtn) {
        soundBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            volumePopup.classList.toggle('active');
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', function () {
            volume = this.value / 100;
            volumeValue.textContent = this.value + '%';
        });
    }

    if (muteSound) {
        muteSound.addEventListener('change', function () {
            muted = this.checked;
            const icon = soundBtn.querySelector('i');
            if (muted) {
                icon.className = 'fas fa-volume-mute';
                soundBtn.classList.add('muted');
            } else {
                icon.className = 'fas fa-volume-up';
                soundBtn.classList.remove('muted');
            }
        });
    }

    // Close volume popup when clicking outside
    document.addEventListener('click', function () {
        volumePopup.classList.remove('active');
    });

    // Settings panel
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const settingsPanelClose = document.getElementById('settingsPanelClose');

    if (settingsBtn) {
        settingsBtn.addEventListener('click', function () {
            settingsPanel.classList.toggle('active');
        });
    }

    if (settingsPanelClose) {
        settingsPanelClose.addEventListener('click', function () {
            settingsPanel.classList.remove('active');
        });
    }

    // Alert volume slider
    const alertVolume = document.getElementById('alertVolume');
    const alertVolumeValue = document.getElementById('alertVolumeValue');

    if (alertVolume && alertVolumeValue) {
        alertVolume.addEventListener('input', function () {
            alertVolumeValue.textContent = this.value + '%';
        });
    }

    // AI Sensitivity slider
    const aiSensitivity = document.getElementById('aiSensitivity');
    const sensitivityValue = document.getElementById('sensitivityValue');

    if (aiSensitivity && sensitivityValue) {
        aiSensitivity.addEventListener('input', function () {
            sensitivityValue.textContent = this.value;
        });
    }

    // Context menu
    const contextMenu = document.getElementById('contextMenu');

    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();

        // Only show context menu on certain elements
        const target = e.target.closest('.logs-table tr, .alert-item, .stat-item');
        if (target) {
            contextMenu.style.left = e.pageX + 'px';
            contextMenu.style.top = e.pageY + 'px';
            contextMenu.classList.add('active');

            // Store the target element for later use
            contextMenu.dataset.targetId = target.id || '';
        }
    });

    // Hide context menu when clicking elsewhere
    document.addEventListener('click', function () {
        contextMenu.classList.remove('active');
    });

    // Handle context menu actions
    const contextMenuItems = document.querySelectorAll('.context-menu-item');
    contextMenuItems.forEach(item => {
        item.addEventListener('click', function () {
            const action = this.dataset.action;
            const targetId = contextMenu.dataset.targetId;

            handleContextMenuAction(action, targetId);
        });
    });

    // Modal
    const modal = document.getElementById('detailsModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');

    if (modalClose) {
        modalClose.addEventListener('click', function () {
            modal.classList.remove('active');
        });
    }

    if (modalCancel) {
        modalCancel.addEventListener('click', function () {
            modal.classList.remove('active');
        });
    }

    // Blacklist Modal
    const blacklistModal = document.getElementById('blacklistModal');
    const blacklistModalClose = document.getElementById('blacklistModalClose');
    const blacklistModalCancel = document.getElementById('blacklistModalCancel');
    const manageBlacklistBtn = document.getElementById('manageBlacklistBtn');

    if (manageBlacklistBtn) {
        manageBlacklistBtn.addEventListener('click', function () {
            blacklistModal.classList.add('active');
        });
    }

    if (blacklistModalClose) {
        blacklistModalClose.addEventListener('click', function () {
            blacklistModal.classList.remove('active');
        });
    }

    if (blacklistModalCancel) {
        blacklistModalCancel.addEventListener('click', function () {
            blacklistModal.classList.remove('active');
        });
    }

    // Whitelist Modal
    const whitelistModal = document.getElementById('whitelistModal');
    const whitelistModalClose = document.getElementById('whitelistModalClose');
    const whitelistModalCancel = document.getElementById('whitelistModalCancel');
    const manageWhitelistBtn = document.getElementById('manageWhitelistBtn');

    if (manageWhitelistBtn) {
        manageWhitelistBtn.addEventListener('click', function () {
            whitelistModal.classList.add('active');
        });
    }

    if (whitelistModalClose) {
        whitelistModalClose.addEventListener('click', function () {
            whitelistModal.classList.remove('active');
        });
    }

    if (whitelistModalCancel) {
        whitelistModalCancel.addEventListener('click', function () {
            whitelistModal.classList.remove('active');
        });
    }

    // Tooltips
    const tooltip = document.getElementById('tooltip');
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function (e) {
            const text = this.dataset.tooltip;
            tooltip.textContent = text;
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
            tooltip.classList.add('active');
        });

        element.addEventListener('mouseleave', function () {
            tooltip.classList.remove('active');
        });

        element.addEventListener('mousemove', function (e) {
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY + 10 + 'px';
        });
    });
}

function handleContextMenuAction(action, targetId) {
    switch (action) {
        case 'details':
            showDetailsModal(targetId);
            break;
        case 'block':
            blockIPFromContext(targetId);
            break;
        case 'whitelist':
            whitelistIPFromContext(targetId);
            break;
        case 'export':
            exportSingleLog(targetId);
            break;
        case 'delete':
            deleteLogEntry(targetId);
            break;
    }
}

function showDetailsModal(targetId) {
    const modal = document.getElementById('detailsModal');
    const modalBody = document.getElementById('modalBody');

    // Find the log entry
    const logEntry = document.getElementById(targetId);
    if (!logEntry) return;

    // Extract data from the log entry
    const cells = logEntry.querySelectorAll('td');
    const time = cells[0].textContent;
    const ip = cells[1].textContent;
    const type = cells[2].textContent;
    const status = cells[3].textContent;
    const action = cells[4].textContent;
    const responseTime = cells[5].textContent;

    // Populate modal with details
    modalBody.innerHTML = `
        <div class="details-grid">
            <div class="detail-item">
                <strong>Time:</strong> ${time}
            </div>
            <div class="detail-item">
                <strong>IP Address:</strong> ${ip}
            </div>
            <div class="detail-item">
                <strong>Attack Type:</strong> ${type}
            </div>
            <div class="detail-item">
                <strong>Status:</strong> ${status}
            </div>
            <div class="detail-item">
                <strong>Action Taken:</strong> ${action}
            </div>
            <div class="detail-item">
                <strong>Response Time:</strong> ${responseTime}
            </div>
            <div class="detail-item">
                <strong>Geolocation:</strong> ${getRandomLocation()}
            </div>
            <div class="detail-item">
                <strong>Threat Level:</strong> ${getRandomThreatLevel()}
            </div>
            <div class="detail-item">
                <strong>DFA State:</strong> ${getCurrentDFAState()}
            </div>
            <div class="detail-item">
                <strong>OS Process:</strong> ${getRandomProcess()}
            </div>
        </div>
    `;

    // Show modal
    modal.classList.add('active');
}

function getRandomLocation() {
    const locations = [
        'New York, USA',
        'London, UK',
        'Tokyo, Japan',
        'Berlin, Germany',
        'Sydney, Australia',
        'Moscow, Russia',
        'Beijing, China',
        'São Paulo, Brazil'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
}

function getRandomThreatLevel() {
    const levels = ['Low', 'Medium', 'High', 'Critical'];
    return levels[Math.floor(Math.random() * levels.length)];
}

function getCurrentDFAState() {
    const stateElement = document.getElementById('currentDFAState');
    return stateElement ? stateElement.textContent : 'Normal';
}

function getRandomProcess() {
    const processes = [
        'sshd (PID: 1234)',
        'httpd (PID: 5678)',
        'mysqld (PID: 9012)',
        'nginx (PID: 3456)',
        'apache2 (PID: 7890)'
    ];
    return processes[Math.floor(Math.random() * processes.length)];
}

function blockIPFromContext(targetId) {
    const logEntry = document.getElementById(targetId);
    if (!logEntry) return;

    const ip = logEntry.querySelector('td:nth-child(2)').textContent;
    document.getElementById('ipAddress').value = ip;
    addToBlacklist();
}

function whitelistIPFromContext(targetId) {
    const logEntry = document.getElementById(targetId);
    if (!logEntry) return;

    const ip = logEntry.querySelector('td:nth-child(2)').textContent;
    document.getElementById('whitelistIP').value = ip;
    addToWhitelist();
}

function exportSingleLog(targetId) {
    const logEntry = document.getElementById(targetId);
    if (!logEntry) return;

    const cells = logEntry.querySelectorAll('td');
    const data = {
        time: cells[0].textContent,
        ip: cells[1].textContent,
        type: cells[2].textContent,
        status: cells[3].textContent,
        action: cells[4].textContent,
        responseTime: cells[5].textContent
    };

    const csv = `Time,IP Address,Type,Status,Action,Response Time\n` +
        `"${data.time}","${data.ip}","${data.type}","${data.status}","${data.action}","${data.responseTime}"`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybershield-log-${data.ip}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showAlert('Log entry exported successfully', 'success');
    showNotification('Export Complete', 'Log entry exported successfully', 'success');
}

function deleteLogEntry(targetId) {
    const logEntry = document.getElementById(targetId);
    if (!logEntry) return;

    logEntry.remove();
    showAlert('Log entry deleted', 'info');
    showNotification('Delete Complete', 'Log entry deleted', 'info');
}

// Global Variables
let systemActive = true;
let simulationInterval = null;
let attackChart = null;
let threeScene = null;
let threeCamera = null;
let threeRenderer = null;
let attackObjects = [];
let defenseWalls = [];
let particles = null;
let core = null;
let animationId = null;
let dfaCanvas = null;
let dfaCtx = null;
let dfaStates = [];
let dfaTransitions = [];
let currentDFAState = 'normal';
let transitionCount = 0;

// System Initialization
function initializeSystem() {
    console.log('✅ System initialization starting...');

    try {
        // Initialize components
        initParticles();
        initDFAEngine();
        initThreeVisualization();
        initChart();
        initEventListeners();
        updateCurrentDate();

        // Start background processes
        startTimeUpdates();
        startStatsUpdates();
        startNormalActivity();

        // Add initial data
        addInitialData();

        // Fix any layout issues
        fixLayoutIssues();

        console.log('✅ System initialization complete');
    } catch (error) {
        console.error('❌ Error during initialization:', error);
        showAlert('Initialization error: ' + error.message, 'danger');
        showNotification('Initialization Error', error.message, 'danger');
    }
}

function fixLayoutIssues() {
    // Ensure body takes full height
    document.body.style.minHeight = '100vh';
    document.body.style.overflow = 'auto';

    // Fix container height
    const container = document.querySelector('.container');
    if (container) {
        container.style.minHeight = 'calc(100vh - 40px)';
    }

    // Remove any unwanted margins/padding
    document.documentElement.style.overflow = 'auto';
}

// Initialize Particles.js
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#00d4ff" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 120,
                    color: "#6a5af9",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            },
            retina_detect: true
        });
    } else {
        console.warn('Particles.js not loaded');
        // Fallback for particles
        const particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
            particlesContainer.style.background = 'radial-gradient(circle at center, rgba(0, 212, 255, 0.1) 0%, rgba(5, 5, 26, 0) 70%)';
        }
    }
}

// Initialize DFA Engine
function initDFAEngine() {
    // Initialize DFA canvas
    dfaCanvas = document.getElementById('dfaCanvas');
    if (!dfaCanvas) return;

    // Set canvas size
    const container = dfaCanvas.parentElement;
    dfaCanvas.width = container.clientWidth;
    dfaCanvas.height = container.clientHeight;

    // Get context
    dfaCtx = dfaCanvas.getContext('2d');

    // Define DFA states
    dfaStates = [
        {
            id: 'normal',
            name: 'Normal',
            x: 100,
            y: 150,
            radius: 40,
            color: '#00ff88',
            description: 'Normal operation'
        },
        {
            id: 'suspicious',
            name: 'Suspicious',
            x: 250,
            y: 150,
            radius: 40,
            color: '#ffcc00',
            description: 'Suspicious activity detected'
        },
        {
            id: 'warning',
            name: 'Warning',
            x: 400,
            y: 150,
            radius: 40,
            color: '#ff9500',
            description: 'High risk detected'
        },
        {
            id: 'alert',
            name: 'Alert',
            x: 550,
            y: 150,
            radius: 40,
            color: '#ff375f',
            description: 'Immediate action required'
        },
        {
            id: 'blocked',
            name: 'Blocked',
            x: 700,
            y: 150,
            radius: 40,
            color: '#ff0000',
            description: 'IP blocked'
        }
    ];

    // Define DFA transitions
    dfaTransitions = [
        { from: 'normal', to: 'suspicious', label: '1 failed login' },
        { from: 'suspicious', to: 'normal', label: 'Successful login' },
        { from: 'suspicious', to: 'warning', label: '2 failed logins' },
        { from: 'warning', to: 'suspicious', label: '5 min no activity' },
        { from: 'warning', to: 'alert', label: '3 failed logins' },
        { from: 'alert', to: 'warning', label: '10 min no activity' },
        { from: 'alert', to: 'blocked', label: '5 failed logins' },
        { from: 'blocked', to: 'normal', label: 'Admin unlock' }
    ];

    // Set initial state
    currentDFAState = 'normal';

    // Draw initial DFA
    drawDFA();

    // Add click event to DFA canvas
    dfaCanvas.addEventListener('click', function (e) {
        const rect = dfaCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if click is on a state
        for (const state of dfaStates) {
            const distance = Math.sqrt(Math.pow(x - state.x, 2) + Math.pow(y - state.y, 2));
            if (distance <= state.radius) {
                // Transition to this state if valid
                if (transitionToState(state.id)) {
                    playSound('notification');
                }
                break;
            }
        }
    });

    // Start animation loop
    animateDFA();
}

function drawDFA() {
    if (!dfaCtx) return;

    // Clear canvas
    dfaCtx.clearRect(0, 0, dfaCanvas.width, dfaCanvas.height);

    // Draw transitions
    dfaCtx.strokeStyle = 'rgba(106, 90, 249, 0.5)';
    dfaCtx.lineWidth = 2;

    dfaTransitions.forEach(transition => {
        const fromState = dfaStates.find(s => s.id === transition.from);
        const toState = dfaStates.find(s => s.id === transition.to);

        if (!fromState || !toState) return;

        // Calculate arrow position
        const dx = toState.x - fromState.x;
        const dy = toState.y - fromState.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Normalize direction
        const dirX = dx / distance;
        const dirY = dy / distance;

        // Calculate start and end points (accounting for state radius)
        const startX = fromState.x + dirX * fromState.radius;
        const startY = fromState.y + dirY * fromState.radius;
        const endX = toState.x - dirX * toState.radius;
        const endY = toState.y - dirY * toState.radius;

        // Draw line
        dfaCtx.beginPath();
        dfaCtx.moveTo(startX, startY);
        dfaCtx.lineTo(endX, endY);
        dfaCtx.stroke();

        // Draw arrowhead
        const arrowLength = 10;
        const arrowAngle = Math.PI / 6;

        dfaCtx.beginPath();
        dfaCtx.moveTo(endX, endY);
        dfaCtx.lineTo(
            endX - arrowLength * Math.cos(Math.atan2(dy, dx) - arrowAngle),
            endY - arrowLength * Math.sin(Math.atan2(dy, dx) - arrowAngle)
        );
        dfaCtx.moveTo(endX, endY);
        dfaCtx.lineTo(
            endX - arrowLength * Math.cos(Math.atan2(dy, dx) + arrowAngle),
            endY - arrowLength * Math.sin(Math.atan2(dy, dx) + arrowAngle)
        );
        dfaCtx.stroke();

        // Transition labels removed as per user request
    });

    // Draw states
    dfaStates.forEach(state => {
        // Draw state circle
        dfaCtx.beginPath();
        dfaCtx.arc(state.x, state.y, state.radius, 0, 2 * Math.PI);

        // Fill with state color
        if (state.id === currentDFAState) {
            // Active state with glow effect
            dfaCtx.fillStyle = state.color;
            dfaCtx.shadowColor = state.color;
            dfaCtx.shadowBlur = 20;
            dfaCtx.fill();
            dfaCtx.shadowBlur = 0;

            // Draw pulsing ring
            const time = Date.now() / 1000;
            const pulseRadius = state.radius + 5 * Math.sin(time * 2);
            dfaCtx.strokeStyle = state.color;
            dfaCtx.lineWidth = 2;
            dfaCtx.beginPath();
            dfaCtx.arc(state.x, state.y, pulseRadius, 0, 2 * Math.PI);
            dfaCtx.stroke();
        } else {
            // Inactive state
            dfaCtx.fillStyle = 'rgba(16, 16, 48, 0.8)';
            dfaCtx.fill();

            dfaCtx.strokeStyle = state.color;
            dfaCtx.lineWidth = 2;
            dfaCtx.stroke();
        }

        // Draw state name
        dfaCtx.fillStyle = state.id === currentDFAState ? '#ffffff' : '#a0a0d0';
        dfaCtx.font = 'bold 14px Orbitron';
        dfaCtx.textAlign = 'center';
        dfaCtx.textBaseline = 'middle';
        dfaCtx.fillText(state.name, state.x, state.y);
    });
}

function animateDFA() {
    drawDFA();
    requestAnimationFrame(animateDFA);
}

function transitionToState(newState) {
    // Find valid transition
    const validTransition = dfaTransitions.find(t =>
        t.from === currentDFAState && t.to === newState
    );

    if (!validTransition) {
        console.log(`No direct transition from ${currentDFAState} to ${newState}`);
        return false;
    }

    // Update current state
    currentDFAState = newState;
    transitionCount++;

    // Update UI
    const currentStateElement = document.getElementById('currentDFAState');
    if (currentStateElement) {
        currentStateElement.textContent = newState.charAt(0).toUpperCase() + newState.slice(1);
    }

    const transitionElement = document.getElementById('transitionCount');
    if (transitionElement) {
        transitionElement.textContent = transitionCount;
    }

    // Update progress bar
    const progress = Math.min((transitionCount % 10) * 10, 100);
    const progressBar = document.getElementById('dfaProgress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }

    // Play alert sound for critical states
    if (newState === 'blocked' || newState === 'alert') {
        playSound('alert');
    }

    return true;
}

// Initialize Three.js Visualization
function initThreeVisualization() {
    const container = document.getElementById('threeContainer');
    const canvas = document.getElementById('threeCanvas');

    if (!container || !canvas) {
        console.error('Three.js container not found');
        return;
    }

    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.error('Three.js not available');
        // Fallback visualization
        container.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100%; flex-direction: column; color: var(--text-secondary);">
                <i class="fas fa-shield-alt fa-5x" style="color: var(--primary); margin-bottom: 20px;"></i>
                <p>3D Visualization requires WebGL support</p>
                <p style="margin-top: 10px;">Attack visualization will appear in the logs</p>
            </div>
        `;
        return;
    }

    try {
        // Create scene
        threeScene = new THREE.Scene();
        threeScene.background = new THREE.Color(0x05051a);

        // Create camera
        threeCamera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        threeCamera.position.set(0, 5, 15);

        // Create renderer
        threeRenderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        threeRenderer.setPixelRatio(window.devicePixelRatio);
        threeRenderer.setSize(container.clientWidth, container.clientHeight);
        threeRenderer.shadowMap.enabled = true;
        threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Add lights
        addLights();

        // Create defensive system
        createDefenseSystem();

        // Create particle system
        createParticleSystem();

        // Start animation
        animate();

        console.log('✅ 3D Visualization initialized');

    } catch (error) {
        console.error('Failed to initialize 3D visualization:', error);
        // Fallback visualization
        container.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100%; flex-direction: column; color: var(--text-secondary);">
                <i class="fas fa-exclamation-triangle fa-5x" style="color: var(--danger); margin-bottom: 20px;"></i>
                <p>Failed to initialize 3D visualization</p>
                <p style="margin-top: 10px;">Attack visualization will appear in the logs</p>
            </div>
        `;
    }
}

function addLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    threeScene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0x00d4ff, 1);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    threeScene.add(directionalLight);

    // Point lights
    const pointLight1 = new THREE.PointLight(0x6a5af9, 1, 30);
    pointLight1.position.set(-10, 5, 5);
    threeScene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00d4ff, 1, 30);
    pointLight2.position.set(10, 5, -5);
    threeScene.add(pointLight2);
}

function createDefenseSystem() {
    // Create defensive walls
    const wallGeometry = new THREE.BoxGeometry(20, 8, 0.5);
    const wallMaterial = new THREE.MeshPhongMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.3,
        emissive: 0x0066ff,
        emissiveIntensity: 0.2
    });

    // Create 4 walls in a square formation
    const positions = [
        { x: 0, y: 0, z: -5, rotation: 0 },
        { x: 0, y: 0, z: 5, rotation: Math.PI },
        { x: -10, y: 0, z: 0, rotation: Math.PI / 2 },
        { x: 10, y: 0, z: 0, rotation: -Math.PI / 2 }
    ];

    positions.forEach(pos => {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(pos.x, pos.y, pos.z);
        wall.rotation.y = pos.rotation;
        wall.receiveShadow = true;

        threeScene.add(wall);
        defenseWalls.push(wall);
    });

    // Create central core
    const coreGeometry = new THREE.IcosahedronGeometry(2, 1);
    const coreMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff88,
        emissive: 0x00aa55,
        emissiveIntensity: 0.5,
        shininess: 100
    });

    core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.set(0, 0, 0);
    core.castShadow = true;
    threeScene.add(core);
}

function createParticleSystem() {
    const particleCount = 300;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        // Random positions in a sphere
        const radius = 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Cyber colors
        colors[i * 3] = Math.random() * 0.5 + 0.5;     // R
        colors[i * 3 + 1] = Math.random() * 0.3 + 0.7; // G
        colors[i * 3 + 2] = Math.random() * 0.5 + 1;   // B
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });

    particles = new THREE.Points(geometry, material);
    threeScene.add(particles);
}

function animate() {
    animationId = requestAnimationFrame(animate);

    if (!threeScene || !threeCamera || !threeRenderer) return;

    // Auto-rotate scene
    threeScene.rotation.y += 0.001;

    // Update particles
    if (particles) {
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;
    }

    // Update core rotation
    if (core) {
        core.rotation.x += 0.01;
        core.rotation.y += 0.01;
    }

    // Pulsing defense walls
    const time = Date.now() * 0.001;
    defenseWalls.forEach((wall, index) => {
        const pulse = Math.sin(time * 2 + index) * 0.1 + 0.9;
        wall.material.opacity = 0.2 + pulse * 0.2;
    });

    // Update attack objects
    for (let i = attackObjects.length - 1; i >= 0; i--) {
        const attackSphere = attackObjects[i];

        if (!attackSphere.userData) continue;

        // Move toward target
        const direction = new THREE.Vector3().subVectors(
            attackSphere.userData.target || new THREE.Vector3(0, 0, 0),
            attackSphere.position
        ).normalize();

        attackSphere.position.add(direction.multiplyScalar(attackSphere.userData.speed || 0.05));

        // Rotate attack sphere
        attackSphere.rotation.x += 0.05;
        attackSphere.rotation.y += 0.05;

        // Check if reached defense perimeter
        const distance = attackSphere.position.distanceTo(new THREE.Vector3(0, 0, 0));

        if (distance < 4) {
            // Attack reached defense - block it
            blockAttack(attackSphere);

            // Flash defense wall
            flashDefenseWall();

            // Update statistics
            const blockedElement = document.getElementById('blockedAttacks');
            if (blockedElement) {
                let blockedCount = parseInt(blockedElement.textContent) || 0;
                blockedElement.textContent = blockedCount + 1;
            }
        }

        // Remove old attacks
        if (Date.now() - attackSphere.userData.creationTime > 8000) {
            blockAttack(attackSphere);
        }
    }

    threeRenderer.render(threeScene, threeCamera);
}

function visualizeAttack(type = 'bruteforce', severity = 3) {
    // If Three.js is not available, just log the attack
    if (!threeScene) {
        console.log(`Attack visualization: ${type} with severity ${severity}`);
        return null;
    }

    const attackColors = {
        bruteforce: 0xff375f,
        ddos: 0xff9500,
        phishing: 0x00d4ff,
        malware: 0x9d4edd,
        normal: 0x00ff88
    };

    const color = attackColors[type] || 0xff0000;

    // Create attack sphere
    const geometry = new THREE.SphereGeometry(0.3 + severity * 0.1, 6, 6);
    const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        shininess: 30
    });

    const attackSphere = new THREE.Mesh(geometry, material);

    // Random starting position
    const angle = Math.random() * Math.PI * 2;
    const radius = 20;
    attackSphere.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 6,
        Math.sin(angle) * radius
    );

    // Set attack properties
    attackSphere.userData = {
        type: type,
        severity: severity,
        target: new THREE.Vector3(0, 0, 0),
        speed: 0.03 + Math.random() * 0.02,
        active: true,
        creationTime: Date.now(),
        color: color
    };

    attackSphere.castShadow = true;
    threeScene.add(attackSphere);
    attackObjects.push(attackSphere);

    // Update active attacks count
    updateActiveAttacksCount();

    // Limit number of attack objects
    if (attackObjects.length > 20) {
        const oldAttack = attackObjects.shift();
        threeScene.remove(oldAttack);
        updateActiveAttacksCount();
    }

    return attackSphere;
}

function blockAttack(attackSphere) {
    if (!attackSphere) return;

    // Remove from scene
    if (threeScene) {
        threeScene.remove(attackSphere);
    }

    // Remove from array
    const index = attackObjects.indexOf(attackSphere);
    if (index > -1) {
        attackObjects.splice(index, 1);
    }

    updateActiveAttacksCount();
}

function flashDefenseWall() {
    if (defenseWalls.length === 0) return;

    const wall = defenseWalls[Math.floor(Math.random() * defenseWalls.length)];
    const originalOpacity = wall.material.opacity;
    const originalEmissive = wall.material.emissiveIntensity;

    wall.material.opacity = 1;
    wall.material.emissiveIntensity = 1;

    setTimeout(() => {
        if (wall.material) {
            wall.material.opacity = originalOpacity;
            wall.material.emissiveIntensity = originalEmissive;
        }
    }, 100);
}

function updateActiveAttacksCount() {
    const countElement = document.getElementById('activeAttacksCount');
    if (countElement) {
        countElement.textContent = attackObjects.length;
    }
}

// Initialize Chart.js
function initChart() {
    const ctx = document.getElementById('attackChart');
    if (!ctx) return;

    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not available');
        // Fallback visualization
        ctx.parentElement.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100%; color: var(--text-secondary);">
                <p>Chart visualization requires Chart.js library</p>
            </div>
        `;
        return;
    }

    attackChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1m', '2m', '3m', '4m', '5m', '6m'],
            datasets: [{
                label: 'Attack Attempts',
                data: [12, 19, 8, 15, 22, 18],
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }, {
                label: 'Blocked Attacks',
                data: [8, 12, 5, 10, 15, 12],
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#a0a0d0',
                        font: {
                            family: 'Roboto Mono',
                            size: 11
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0d0',
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0d0',
                        font: {
                            size: 10
                        }
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize Event Listeners
function initEventListeners() {
    // Power button
    document.getElementById('powerButton').addEventListener('click', toggleSystem);

    // Logo click
    document.getElementById('logoIcon').addEventListener('click', function () {
        showAlert('CyberShield v2.1.4 - DFA + OS Security Integration', 'info');
        showNotification('System Info', 'CyberShield v2.1.4 - DFA + OS Security Integration', 'info');
        playSound('notification');
    });

    // Title clicks
    document.getElementById('attackVizTitle').addEventListener('click', function () {
        showAlert('Real-time 3D visualization of incoming attacks and defense mechanisms', 'info');
        showNotification('Visualization Info', 'Real-time 3D visualization of incoming attacks and defense mechanisms', 'info');
    });

    document.getElementById('dfaTitle').addEventListener('click', function () {
        showAlert('Deterministic Finite Automaton state machine for attack detection and response', 'info');
        showNotification('DFA Info', 'Deterministic Finite Automaton state machine for attack detection and response', 'info');
    });

    document.getElementById('statsTitle').addEventListener('click', function () {
        showAlert('Real-time system statistics and performance metrics', 'info');
        showNotification('Statistics Info', 'Real-time system statistics and performance metrics', 'info');
    });

    document.getElementById('alertsTitle').addEventListener('click', function () {
        showAlert('Recent security alerts and notifications', 'info');
        showNotification('Alerts Info', 'Recent security alerts and notifications', 'info');
    });

    document.getElementById('logsTitle').addEventListener('click', function () {
        showAlert('Detailed logs of all detected security events', 'info');
        showNotification('Logs Info', 'Detailed logs of all detected security events', 'info');
    });

    // Stat item clicks
    document.getElementById('blockedAttacksStat').addEventListener('click', function () {
        showAlert('Total number of attacks blocked by system', 'info');
        showNotification('Blocked Attacks', 'Total number of attacks blocked by system', 'info');
    });

    document.getElementById('responseTimeStat').addEventListener('click', function () {
        showAlert('Average response time for threat detection and mitigation', 'info');
        showNotification('Response Time', 'Average response time for threat detection and mitigation', 'info');
    });

    document.getElementById('activeThreatsStat').addEventListener('click', function () {
        showAlert('Number of currently active security threats', 'info');
        showNotification('Active Threats', 'Number of currently active security threats', 'info');
    });

    document.getElementById('systemLoadStat').addEventListener('click', function () {
        showAlert('Current system resource utilization', 'info');
        showNotification('System Load', 'Current system resource utilization', 'info');
    });

    // Attack simulation buttons
    document.getElementById('simulateAttackBtn').addEventListener('click', function () {
        startAttackSimulation();
        showNotification('Simulation Started', 'Attack simulation started', 'info');
        toastr.info('Attack simulation started', 'Simulation');
    });

    document.getElementById('clearAttacksBtn').addEventListener('click', function () {
        clearAllAttacks();
        showNotification('Attacks Cleared', 'All attacks cleared from visualization', 'warning');
        toastr.warning('All attacks cleared', 'System');
    });

    // DFA reset
    document.getElementById('resetDFABtn').addEventListener('click', function () {
        resetDFA();
        showNotification('DFA Reset', 'DFA state machine reset to normal state', 'info');
        toastr.info('DFA state machine reset', 'System');
    });

    // Logs controls
    document.getElementById('exportLogsBtn').addEventListener('click', function () {
        exportLogs();
        showNotification('Export Complete', 'Logs exported successfully', 'success');
        toastr.success('Logs exported successfully', 'Export');
    });

    document.getElementById('clearLogsBtn').addEventListener('click', function () {
        clearLogs();
        showNotification('Logs Cleared', 'All logs cleared', 'warning');
        toastr.warning('All logs cleared', 'System');
    });

    document.getElementById('clearAlertsBtn').addEventListener('click', function () {
        clearAlerts();
        showNotification('Alerts Cleared', 'All alerts cleared', 'warning');
        toastr.info('All alerts cleared', 'System');
    });

    // Settings buttons
    document.getElementById('saveSettingsBtn').addEventListener('click', function () {
        saveAllSettings();
        showNotification('Settings Saved', 'All settings have been saved successfully', 'success');
        toastr.success('All settings saved', 'Settings');
    });

    document.getElementById('resetSettingsBtn').addEventListener('click', function () {
        resetAllSettings();
        showNotification('Settings Reset', 'All settings have been reset to default', 'warning');
        toastr.warning('Settings reset to default', 'Settings');
    });

    // Blacklist buttons
    document.getElementById('blockIPBtn').addEventListener('click', function () {
        addToBlacklist();
    });

    document.getElementById('blacklistModalSave').addEventListener('click', function () {
        saveBlacklistChanges();
        document.getElementById('blacklistModal').classList.remove('active');
        showNotification('Blacklist Updated', 'IP blacklist has been updated', 'success');
        toastr.success('IP blacklist updated', 'IP Filtering');
    });

    // Whitelist buttons
    document.getElementById('addWhitelistBtn').addEventListener('click', function () {
        addToWhitelist();
    });

    document.getElementById('whitelistModalSave').addEventListener('click', function () {
        saveWhitelistChanges();
        document.getElementById('whitelistModal').classList.remove('active');
        showNotification('Whitelist Updated', 'IP whitelist has been updated', 'success');
        toastr.success('IP whitelist updated', 'IP Filtering');
    });

    // Search and filter
    document.getElementById('logSearch').addEventListener('input', function (e) {
        filterLogs(e.target.value);
    });

    document.getElementById('logFilter').addEventListener('change', function (e) {
        filterLogsByType(e.target.value);
        showNotification('Filter Applied', `Filter applied: ${e.target.value}`, 'info');
        toastr.info('Filter applied: ' + e.target.value, 'Logs');
    });

    // Modal save button
    document.getElementById('modalSave').addEventListener('click', function () {
        const modal = document.getElementById('detailsModal');
        modal.classList.remove('active');
        showAlert('Changes saved successfully', 'success');
        showNotification('Changes Saved', 'Changes saved successfully', 'success');
        toastr.success('Changes saved successfully', 'Save');
    });

    // Window resize
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    const container = document.getElementById('threeContainer');
    if (threeCamera && threeRenderer && container) {
        threeCamera.aspect = container.clientWidth / container.clientHeight;
        threeCamera.updateProjectionMatrix();
        threeRenderer.setSize(container.clientWidth, container.clientHeight);
    }

    // Resize DFA canvas
    if (dfaCanvas && dfaCanvas.parentElement) {
        dfaCanvas.width = dfaCanvas.parentElement.clientWidth;
        dfaCanvas.height = dfaCanvas.parentElement.clientHeight;
        drawDFA();
    }
}

// Add initial data
function addInitialData() {
    // Add some blacklisted IPs
    addBlacklistIP('192.168.1.100');
    addBlacklistIP('10.0.0.55');
    addBlacklistIP('185.143.223.12');

    // Add some whitelisted IPs
    addWhitelistIP('192.168.1.1');
    addWhitelistIP('10.0.0.1');

    // Add initial logs
    const initialLogs = [
        {
            time: '14:23:45',
            ip: '192.168.1.100',
            type: 'bruteforce',
            status: 'BLOCKED',
            action: 'BLOCK',
            responseTime: '15ms'
        },
        {
            time: '14:20:12',
            ip: '10.0.0.55',
            type: 'ddos',
            status: 'ALERT',
            action: 'ALERT',
            responseTime: '22ms'
        },
        {
            time: '14:15:33',
            ip: '185.143.223.12',
            type: 'phishing',
            status: 'WARNING',
            action: 'WARN',
            responseTime: '18ms'
        }
    ];

    initialLogs.forEach(log => addAttackLog(log));
}

// System Control Functions
function toggleSystem() {
    systemActive = !systemActive;

    const statusElement = document.getElementById('systemStatus');
    const statusDot = statusElement.querySelector('.status-dot');
    const statusText = statusElement.querySelector('.status-text');
    const powerButton = document.getElementById('powerButton');

    if (systemActive) {
        statusDot.className = 'status-dot active';
        statusText.textContent = 'SYSTEM ACTIVE';
        statusElement.style.background = 'rgba(0, 255, 136, 0.1)';
        statusElement.style.borderColor = '#00ff88';
        powerButton.classList.remove('active');

        showAlert('Protection system activated', 'success');
        showNotification('System Active', 'Protection system activated', 'success');
        toastr.success('System activated', 'Power');

        // Play notification sound
        playSound('notification');

        // Restart simulation
        if (!simulationInterval) {
            startAttackSimulation();
        }
    } else {
        statusDot.className = 'status-dot inactive';
        statusText.textContent = 'SYSTEM INACTIVE';
        statusElement.style.background = 'rgba(255, 55, 95, 0.1)';
        statusElement.style.borderColor = '#ff375f';
        powerButton.classList.add('active');

        showAlert('Protection system deactivated', 'warning');
        showNotification('System Inactive', 'Protection system deactivated', 'warning');
        toastr.warning('System deactivated', 'Power');

        // Play notification sound
        playSound('notification');

        // Stop simulation
        if (simulationInterval) {
            clearInterval(simulationInterval);
            simulationInterval = null;
        }
    }
}

function startAttackSimulation() {
    if (simulationInterval) {
        clearInterval(simulationInterval);
    }

    simulationInterval = setInterval(() => {
        if (!systemActive) return;

        // Random chance to generate attack
        if (Math.random() > 0.7) {
            simulateAttack();
        }
    }, 3000);
}

function simulateAttack() {
    const attackTypes = ['bruteforce', 'ddos', 'phishing', 'malware'];
    const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];

    // Generate random IP
    const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    // Generate random username
    const usernames = ['admin', 'root', 'user', 'test', 'guest'];
    const username = usernames[Math.floor(Math.random() * usernames.length)];

    const severity = Math.floor(Math.random() * 5) + 1;

    // Visualize attack
    visualizeAttack(type, severity);

    // Process attack
    processAttack({
        ip: ip,
        type: type,
        username: username,
        severity: severity
    });

    // Update chart
    updateChartData();
}

function processAttack(attackData) {
    const { type, severity } = attackData;

    // Determine status based on severity
    let status, action, dfaNextState;

    if (severity >= 4) {
        status = 'BLOCKED';
        action = 'BLOCK';
        dfaNextState = 'blocked';
    } else if (severity >= 3) {
        status = 'ALERT';
        action = 'ALERT';
        dfaNextState = 'alert';
    } else if (severity >= 2) {
        status = 'WARNING';
        action = 'WARN';
        dfaNextState = 'warning';
    } else {
        status = 'DETECTED';
        action = 'MONITOR';
        dfaNextState = 'suspicious';
    }

    // Update active threats
    const threatsElement = document.getElementById('activeThreats');
    if (status === 'ALERT' || status === 'WARNING') {
        let threatCount = parseInt(threatsElement.textContent) || 0;
        threatsElement.textContent = threatCount + 1;
    }

    // Update response time
    const responseTime = Math.floor(Math.random() * 40) + 10;
    const avgResponseElement = document.getElementById('avgResponseTime');
    avgResponseElement.textContent = `${responseTime}ms`;

    // Update DFA state
    transitionToState(dfaNextState);

    // Update attack logs
    addAttackLog({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ip: attackData.ip,
        type: type,
        status: status,
        action: action,
        responseTime: `${responseTime}ms`
    });

    // Update system load
    updateSystemLoad();

    // Show notification
    const attackMessages = {
        bruteforce: `Brute force attack from ${attackData.ip}`,
        ddos: `DDoS attack detected from ${attackData.ip}`,
        phishing: `Phishing attempt from ${attackData.ip}`,
        malware: `Malware attack from ${attackData.ip}`
    };

    const message = attackMessages[type] || `Security threat detected from ${attackData.ip}`;
    showAlert(message, status.toLowerCase());

    // Show enhanced notification based on severity
    if (severity >= 4) {
        showNotification('Critical Alert', message, 'danger', 8000);
        toastr.error(message, 'Critical Alert');
    } else if (severity >= 3) {
        showNotification('Security Alert', message, 'warning', 6000);
        toastr.warning(message, 'Security Alert');
    } else {
        showNotification('Security Notice', message, 'info', 4000);
        toastr.info(message, 'Security Notice');
    }
}

function addAttackLog(log) {
    const tableBody = document.getElementById('attackLogsTable');
    if (!tableBody) return;

    // Create row with unique ID
    const rowId = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const row = document.createElement('tr');
    row.id = rowId;
    row.innerHTML = `
        <td>${log.time}</td>
        <td><code>${log.ip}</code></td>
        <td><span class="attack-type">${log.type.toUpperCase()}</span></td>
        <td><span class="status-badge status-${log.status.toLowerCase()}">${log.status}</span></td>
        <td><span class="action-badge">${log.action}</span></td>
        <td>${log.responseTime}</td>
    `;

    // Add to beginning of table
    tableBody.insertBefore(row, tableBody.firstChild);

    // Limit rows to 15
    if (tableBody.children.length > 15) {
        tableBody.removeChild(tableBody.lastChild);
    }
}

function addBlacklistIP(ip) {
    const blacklist = document.getElementById('blacklist');
    if (!blacklist) return;

    const item = document.createElement('div');
    item.className = 'blacklist-item';
    item.innerHTML = `
        <code>${ip}</code>
        <button class="btn-secondary btn-sm remove-ip" data-ip="${ip}">
            <i class="fas fa-times"></i>
        </button>
    `;

    blacklist.appendChild(item);

    // Add event listener to remove button
    item.querySelector('.remove-ip').addEventListener('click', function () {
        removeBlacklistIP(ip);
    });
}

function removeBlacklistIP(ip) {
    const items = document.querySelectorAll('.blacklist-item');
    items.forEach(item => {
        if (item.querySelector('code').textContent === ip) {
            item.remove();
            showAlert(`IP ${ip} removed from blacklist`, 'info');
            showNotification('IP Removed', `IP ${ip} removed from blacklist`, 'info');
            toastr.info(`IP ${ip} removed from blacklist`, 'IP Filtering');
        }
    });
}

function addWhitelistIP(ip) {
    const whitelist = document.getElementById('whitelist');
    if (!whitelist) return;

    const item = document.createElement('div');
    item.className = 'blacklist-item';
    item.innerHTML = `
        <code>${ip}</code>
        <button class="btn-secondary btn-sm remove-ip" data-ip="${ip}">
            <i class="fas fa-times"></i>
        </button>
    `;

    whitelist.appendChild(item);

    // Add event listener to remove button
    item.querySelector('.remove-ip').addEventListener('click', function () {
        removeWhitelistIP(ip);
    });
}

function removeWhitelistIP(ip) {
    const items = document.querySelectorAll('#whitelist .blacklist-item');
    items.forEach(item => {
        if (item.querySelector('code').textContent === ip) {
            item.remove();
            showAlert(`IP ${ip} removed from whitelist`, 'info');
            showNotification('IP Removed', `IP ${ip} removed from whitelist`, 'info');
            toastr.info(`IP ${ip} removed from whitelist`, 'IP Filtering');
        }
    });
}

function addToBlacklist() {
    const ipInput = document.getElementById('ipAddress');
    const ip = ipInput.value.trim();

    if (ip && isValidIP(ip)) {
        addBlacklistIP(ip);
        ipInput.value = '';
        showAlert(`IP ${ip} added to blacklist`, 'danger');
        showNotification('IP Blocked', `IP ${ip} added to blacklist`, 'danger');
        toastr.success(`IP ${ip} added to blacklist`, 'IP Filtering');
    } else {
        showAlert('Please enter a valid IP address', 'warning');
        showNotification('Invalid IP', 'Please enter a valid IP address', 'warning');
        toastr.error('Please enter a valid IP address', 'Error');
    }
}

function addToWhitelist() {
    const ipInput = document.getElementById('whitelistIP');
    const ip = ipInput.value.trim();

    if (ip && isValidIP(ip)) {
        addWhitelistIP(ip);
        ipInput.value = '';
        showAlert(`IP ${ip} added to whitelist`, 'success');
        showNotification('IP Whitelisted', `IP ${ip} added to whitelist`, 'success');
        toastr.success(`IP ${ip} added to whitelist`, 'IP Filtering');
    } else {
        showAlert('Please enter a valid IP address', 'warning');
        showNotification('Invalid IP', 'Please enter a valid IP address', 'warning');
        toastr.error('Please enter a valid IP address', 'Error');
    }
}

function saveBlacklistChanges() {
    // In a real application, this would save to a database
    showAlert('Blacklist changes saved', 'success');
    playSound('notification');
}

function saveWhitelistChanges() {
    // In a real application, this would save to a database
    showAlert('Whitelist changes saved', 'success');
    playSound('notification');
}

function isValidIP(ip) {
    const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!pattern.test(ip)) return false;

    return ip.split('.').every(segment => {
        const num = parseInt(segment, 10);
        return num >= 0 && num <= 255;
    });
}

function saveAllSettings() {
    // Collect all settings
    const settings = {
        loginProtection: {
            maxAttempts: document.getElementById('maxAttempts').value,
            lockoutTime: document.getElementById('lockoutTime').value,
            enableCaptcha: document.getElementById('enableCaptcha').checked
        },
        ipFiltering: {
            autoBlockIPs: document.getElementById('autoBlockIPs').checked
        },
        alerts: {
            emailAlerts: document.getElementById('emailAlerts').checked,
            smsAlerts: document.getElementById('smsAlerts').checked,
            soundAlerts: document.getElementById('soundAlerts').checked,
            alertVolume: document.getElementById('alertVolume').value
        },
        aiProtection: {
            aiSensitivity: document.getElementById('aiSensitivity').value,
            autoBlock: document.getElementById('autoBlock').checked,
            behaviorAnalysis: document.getElementById('behaviorAnalysis').checked,
            learningMode: document.getElementById('learningMode').checked
        },
        system: {
            dataRetention: document.getElementById('dataRetention').value,
            autoUpdate: document.getElementById('autoUpdate').checked,
            performanceMode: document.getElementById('performanceMode').value
        }
    };

    // In a real application, this would save to a database
    console.log('Saving settings:', settings);

    // Close settings panel
    document.getElementById('settingsPanel').classList.remove('active');

    // Play notification sound
    playSound('notification');
}

function resetAllSettings() {
    // Reset all settings to default values
    document.getElementById('maxAttempts').value = 5;
    document.getElementById('lockoutTime').value = 15;
    document.getElementById('enableCaptcha').checked = true;
    document.getElementById('autoBlockIPs').checked = true;
    document.getElementById('emailAlerts').checked = true;
    document.getElementById('smsAlerts').checked = false;
    document.getElementById('soundAlerts').checked = true;
    document.getElementById('alertVolume').value = 80;
    document.getElementById('alertVolumeValue').textContent = '80%';
    document.getElementById('aiSensitivity').value = 7;
    document.getElementById('sensitivityValue').textContent = '7';
    document.getElementById('autoBlock').checked = true;
    document.getElementById('behaviorAnalysis').checked = true;
    document.getElementById('learningMode').checked = true;
    document.getElementById('dataRetention').value = 30;
    document.getElementById('autoUpdate').checked = true;
    document.getElementById('performanceMode').value = 'balanced';

    // Play notification sound
    playSound('notification');
}

// Utility Functions
function showAlert(message, type = 'info') {
    // Add to alerts container
    const alertsContainer = document.getElementById('alertsContainer');
    if (!alertsContainer) return;

    const time = new Date();
    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const alertElement = document.createElement('div');
    alertElement.className = `alert-item ${type}`;
    alertElement.innerHTML = `
        <div class="alert-header">
            <span class="alert-title">${type.toUpperCase()} ALERT</span>
            <span class="alert-time">${timeString}</span>
        </div>
        <p class="alert-message">${message}</p>
    `;

    // Add to beginning
    alertsContainer.insertBefore(alertElement, alertsContainer.firstChild);

    // Limit to 8 alerts
    if (alertsContainer.children.length > 8) {
        alertsContainer.removeChild(alertsContainer.lastChild);
    }
}

function updateChartData() {
    if (!attackChart) return;

    // Generate random data for demo
    const newData = attackChart.data.datasets[0].data.map(() => Math.floor(Math.random() * 30));
    const newBlockedData = newData.map(value => Math.floor(value * 0.7));

    attackChart.data.datasets[0].data = newData;
    attackChart.data.datasets[1].data = newBlockedData;
    attackChart.update();
}

function updateSystemLoad() {
    const loadElement = document.getElementById('systemLoad');
    const cpuElement = document.getElementById('cpuUsage');
    const memoryElement = document.getElementById('memoryUsage');

    // Simulate system metrics
    const baseLoad = 25;
    const attackFactor = Math.random() * 15;
    const load = Math.min(baseLoad + attackFactor, 95);

    const cpu = Math.min(load + Math.random() * 10, 100);
    const memory = Math.min(40 + Math.random() * 20, 85);

    if (loadElement) loadElement.textContent = `${Math.round(load)}%`;
    if (cpuElement) cpuElement.textContent = `${Math.round(cpu)}%`;
    if (memoryElement) memoryElement.textContent = `${Math.round(memory)}%`;
}

function startTimeUpdates() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
}

function updateCurrentTime() {
    const timeElement = document.getElementById('currentTime');
    if (!timeElement) return;

    const now = new Date();
    timeElement.textContent = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (!dateElement) return;

    const now = new Date();
    dateElement.textContent = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function startStatsUpdates() {
    setInterval(() => {
        if (!systemActive) return;

        // Update system load periodically
        updateSystemLoad();
    }, 5000);
}

function startNormalActivity() {
    // Simulate normal login activity
    setInterval(() => {
        if (!systemActive) return;

        if (Math.random() > 0.7) {
            // Simulate successful login (normal activity)
            console.log('Normal activity detected');
        }
    }, 8000);
}

function filterLogs(searchTerm) {
    const rows = document.querySelectorAll('#attackLogsTable tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}

function filterLogsByType(type) {
    const rows = document.querySelectorAll('#attackLogsTable tr');
    rows.forEach(row => {
        if (type === 'all') {
            row.style.display = '';
            return;
        }

        const attackType = row.querySelector('.attack-type')?.textContent.toLowerCase();
        row.style.display = attackType === type.toUpperCase() ? '' : 'none';
    });
}

function clearAllAttacks() {
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }

    // Clear 3D attacks
    if (attackObjects.length > 0 && threeScene) {
        attackObjects.forEach(attack => {
            threeScene.remove(attack);
        });
        attackObjects = [];
        updateActiveAttacksCount();
    }

    // Reset statistics
    document.getElementById('blockedAttacks').textContent = '0';
    document.getElementById('activeThreats').textContent = '0';
    const activeAttacksElement = document.getElementById('activeAttacksCount');
    if (activeAttacksElement) {
        activeAttacksElement.textContent = '0';
    }
}

function clearLogs() {
    const tableBody = document.getElementById('attackLogsTable');
    if (tableBody) {
        tableBody.innerHTML = '';
    }
}

function clearAlerts() {
    const alertsContainer = document.getElementById('alertsContainer');
    if (!alertsContainer) return;

    alertsContainer.innerHTML = `
        <div class="alert-item success">
            <div class="alert-header">
                <span class="alert-title">System Started</span>
                <span class="alert-time">Just now</span>
            </div>
            <p class="alert-message">Alerts cleared. System is monitoring for threats.</p>
        </div>
    `;
}

function exportLogs() {
    const rows = document.querySelectorAll('#attackLogsTable tr');
    let csv = 'Time,IP Address,Type,Status,Action,Response Time\n';

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 6) {
            const rowData = Array.from(cells).map(cell => {
                let text = cell.textContent.trim();
                const badge = cell.querySelector('.status-badge, .attack-type, .action-badge');
                if (badge) {
                    text = badge.textContent.trim();
                }
                return '"' + text.replace(/"/g, '""') + '"';
            });
            csv += rowData.join(',') + '\n';
        }
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cybershield-logs-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function resetDFA() {
    // Reset to normal state
    currentDFAState = 'normal';
    transitionCount = 0;

    // Update UI
    const currentStateElement = document.getElementById('currentDFAState');
    if (currentStateElement) {
        currentStateElement.textContent = 'Normal';
    }

    const transitionElement = document.getElementById('transitionCount');
    if (transitionElement) {
        transitionElement.textContent = '0';
    }

    const progressBar = document.getElementById('dfaProgress');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
}

// Make sure all elements are loaded before initialization
window.addEventListener('load', function () {
    // Additional safety check
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContainer = document.getElementById('mainContainer');

        if (loadingScreen && loadingScreen.style.display !== 'none') {
            loadingScreen.style.display = 'none';
            if (mainContainer) {
                mainContainer.style.display = 'block';
                initializeSystem();
            }
        }
    }, 5000); // Fallback timeout
});