# CyberShield: DFA-Enhanced OS Security Protection

[![JavaScript](https://img.shields.io/badge/Language-JavaScript%20ES6+-yellow?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)](https://github.com/maffan/CyberShield)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/Status-Project--Complete-success?style=for-the-badge)](https://github.com/maffan/CyberShield)
[![Three.js](https://img.shields.io/badge/Three.js-Visualizer-black?style=for-the-badge&logo=three.js)](https://threejs.org/)

**CyberShield** is a sophisticated security simulation system that bridges the gap between theoretical computation models and practical Operating System security. Developed for the **5th Semester OS Project**, it integrates **Deterministic Finite Automata (DFA)** with real-world security paradigms to monitor, visualize, and mitigate brute-force attacks in real-time.

---

## Project Highlights
- **Mathematical Rigor**: Implements a full 5-state DFA to model threat progression.
- **Visual Immersion**: Real-time 3D attack visualization using WebGL and Three.js.
- **Enterprise UI**: State-of-the-art Glassmorphism interface with fluid animations.
- **Actionable Logic**: Dynamic IP blacklisting and automated mitigation workflows.

---

## Detailed Feature Breakdown

### Core Security Engine
- **DFA State Machine**: A robust logical controller managing transitions between `Normal`, `Suspicious`, `Warning`, `Alert`, and `Blocked`. Transitions are triggered by event-threshold sensors.
- **Automated Mitigation**: Upon reaching the `Blocked` state, the system automatically blacklists the offending IP, simulating OS-level firewall protection.
- **Heuristic AI Sensitivity**: An adjustable parameter that alters the DFA transition thresholds, simulating an adaptive security policy.

### Immersive Visualization
- **3D Packet Tracer**: A high-performance **Three.js** canvas that renders incoming security packets as glowing spheres interacting with defensive barriers.
- **Dynamic State Logic**: A custom 2D canvas visualization that live-renders the state machine, highlighting the current security posture with neon glows and pulsing effects.
- **Real-Time Analytics**: Synchronized charts from **Chart.js** that track attack frequency and system response health.

### Premium User Experience
- **Glassmorphism Aesthetic**: Advanced CSS3 backdrop-filters and translucent surfaces for a modern "cyber" feel.
- **Staggered Orchestration**: Components animate into view using coordinated CSS keyframes for a professional "dashboard launch" experience.
- **Multimedia Feedback**: Integrated Web Audio system with low-latency sound alerts for high-threat state transitions.

---

## Architecture & System Flow

The system architecture is designed with a clear separation of concerns, ensuring modularity and performance. At its core, CyberShield operates as a **State Machine**, where the logical transitions are governed by a Deterministic Finite Automaton (DFA). This mathematical approach allows the system to predict and react to threat levels with absolute certainty, mapping every failed interaction to a specific security posture.

```
graph TD
    A[Attack Simulation] -->|Failed Login| B(DFA State Engine)
    B -->|Normal -> Suspicious| C{Security Logic}
    C -->|Thresh < 3| D[Monitor Mode]
    C -->|Thresh > 5| E[Blocking Mode]
    E --> F[IP Blacklist Update]
    
    B --> G[Visualization Layer]
    G --> H[3D WebGL Scene]
    G --> I[2D DFA Canvas]
    G --> J[SVG Status Badges]
    
    K[Settings Controller] -->|AI Sensitivity| B
```

The visualization layer is separate from the core logic, communicating through an event-based bridge. When the DFA transitions to a new state, it broadcasts the event across three main providers: the **WebGL Scene** for 3D feedback, the **Canvas API** for 2D diagramming, and the **DOM Interaction Layer** for real-time notifications and statistics updates. This ensures that the user interface remains decoupled from the heavy security calculations, maintaining a high-performance experience under all conditions.

---

## Technical Stack

| Component | Technology | Version | Description |
| :--- | :--- | :--- | :--- |
| **Language** | JavaScript (ES6+) | Latest | Core application logic and state management. |
| **Styling** | Vanilla CSS3 | Latest | Glassmorphism, Animations, and Grid layout. |
| **3D Engine** | [Three.js](https://threejs.org/) | r154+ | WebGL-based attack visualization. |
| **Analytics** | [Chart.js](https://www.chartjs.org/) | 4.x | Real-time threat telemetry. |
| **Background** | [Particles.js](https://vincentgarreau.com/particles.js/) | 2.0.0 | Dynamic infrastructure background. |
| **Notifications** | [Toastr.js](https://codeseven.github.io/toastr/) | 2.1.4 | Toast-based security alerts. |

---

## Project Structure

```
CyberShield/
├── assets/
│   └── audio/          # Integrated sound effects (alert.mp3, not.mp3)
├── css/
│   └── style.css       # Core styles, variables, and animations
├── js/
│   └── script.js       # DFA logic, Three.js engine, and UI controller
├── index.html          # Main application entry point
```
---

## Quick Start & Installation

Getting started with CyberShield is straightforward and requires no complex server-side configuration. The project is built using vanilla web technologies, making it highly portable and easy to deploy for demonstration or development purposes.

### Prerequisites
Before installation, ensure you have a modern web browser installed (such as Google Chrome, Mozilla Firefox, or Microsoft Edge) with **WebGL 2.0** support enabled. This is essential for the 3D visualization components of the dashboard. No external runtimes or databases are required for the standalone simulation.

### Setup & Deployment
The simplest way to get up and running is to clone the repository and launch the main entry point. For the most consistent experience, it is recommended to use a local development server like the VS Code **Live Server** extension.

```bash
# 1. Clone the CyberShield repository to your local machine
git clone https://github.com/maffan/CyberShield.git

# 2. Navigate into the project directory
cd CyberShield

# 3. Open index.html in your preferred browser
# Recommendation: Use VS Code Live Server for correct asset resolution.
```

---

## Operational Guide

Interaction with the CyberShield dashboard is designed to be intuitive while providing deep insights into the security state of the system. The interface is divided into functional modules that communicate in real-time.

*   **Attack Simulation**: To observe the system's defensive capabilities, click the **"Simulate Attack"** button within the 3D visualization card. This will trigger the DFA engine and initiate state transitions.
*   **System Management**: Users can interact directly with the logs by right-clicking any entry. A custom context menu provides options to whitelist specific IPs, block them permanently, or export the log data to a CSV format for external analysis.
*   **Security Configuration**: The dashboard allows for real-time tuning of security parameters. By clicking the gear icon in the header, users can adjust the **AI Sensitivity** slider. High sensitivity will cause the DFA state machine to reach a 'Blocked' state much faster under threat conditions.
*   **Auditory Feedback**: For a complete immersive experience, ensure the sound toggle is active. The system uses pre-loaded buffers to provide immediate auditory cues during critical state changes, such as when an attack is successfully mitigated.

---

## Performance & Systems Optimization

CyberShield is engineered for high-performance and smooth visual transitions, ensuring that the security dashboard remains responsive even during heavy attack simulations. The project utilizes several optimization techniques to achieve this:

*   **GPU-Accelerated Visuals**: The 3D packet tracer and background particle systems are built on top of WebGL, offloading complex mathematical calculations to the GPU. This ensures high frame rates and a "buttery smooth" interface experience.
*   **Efficient State Synchronization**: The application utilizes an optimized event loop synchronized with the browser's refresh rate via `requestAnimationFrame`. This prevents unnecessary layout shifts and ensures that the 2D DFA canvas and 3D scene remain perfectly in sync.
- **Advanced Audio Management**: To minimize latency and prevent browser-related sound delays, the system uses pre-loaded `ArrayBuffer` data via `XMLHttpRequest`. This allows for instantaneous playback of security alerts, which is critical for real-time monitoring.

---

## Contributing to the Project

We value community contributions and are always looking for ways to improve CyberShield. Whether it's adding new DFA states, improving the 3D visualization, or optimizing the core logic, your input is welcome. To contribute, please follow our standard workflow: fork the repository, create a descriptive feature branch, and submit a pull request with a detailed summary of your changes.

---

## Licensing & Intellectual Property
```
This project is released under the **MIT License**, reflecting our commitment to open-source software and academic collaboration. Under this license, users are free to use, copy, modify, merge, publish, and distribute the software, provided that the original copyright notice and this permission notice are included in all copies or substantial portions of the software. CyberShield is provided "as is", without warranty of any kind, expressing its primary purpose as an educational and research tool for Operating System security enthusiasts.
```
---

## Contact & Support

For inquiries regarding the technical implementation, academic context, or potential collaborations, please reach out through the following channels:

- **Project Lead**: Muhammad Affan
- **Primary Repository**: M-Affan01
- **Professional Network**: https://www.linkedin.com/in/affan-nexor-66abb8321/ 
- **Direct Email**: maffan2830@gmail.com

---
*Built for the Computer Science 5th Semester - OS Project 2026*
