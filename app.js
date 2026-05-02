/**
 * WebAR — app.js
 * Handles: object switching, animations, marker detection events, UI state
 */

(function () {
  'use strict';

  // ── Config ─────────────────────────────────────────────────────
  const OBJECTS = [
    {
      id: 'obj-robot',
      label: 'Robot',
      icon: '🤖',
      aframe: `
        <a-entity id="ar-robot" position="0 0.5 0">
          <!-- Body -->
          <a-box color="#7c3aed" width="0.5" height="0.6" depth="0.4"
            material="metalness:0.8; roughness:0.2; emissive:#3b0764; emissiveIntensity:0.3"
            animation="property: rotation; to: 0 360 0; dur: 4000; loop: true; easing: linear">
            <!-- Head -->
            <a-box color="#a78bfa" width="0.36" height="0.3" depth="0.3"
              position="0 0.48 0"
              material="metalness:0.9; roughness:0.1; emissive:#5b21b6; emissiveIntensity:0.4">
              <!-- Eyes -->
              <a-sphere color="#00ffff" radius="0.05" position="-0.08 0.02 0.16"
                material="emissive:#00ffff; emissiveIntensity:1"
                animation="property: material.emissiveIntensity; to: 0.3; dur: 800; dir: alternate; loop: true"></a-sphere>
              <a-sphere color="#00ffff" radius="0.05" position="0.08 0.02 0.16"
                material="emissive:#00ffff; emissiveIntensity:1"
                animation="property: material.emissiveIntensity; to: 0.3; dur: 800; dir: alternate; loop: true"></a-sphere>
            </a-box>
            <!-- Arms -->
            <a-box color="#6d28d9" width="0.12" height="0.45" depth="0.12"
              position="-0.32 0 0"
              material="metalness:0.7; roughness:0.3"
              animation="property: rotation; to: 0 0 30; dur: 1200; dir: alternate; loop: true; easing: easeInOutSine"></a-box>
            <a-box color="#6d28d9" width="0.12" height="0.45" depth="0.12"
              position="0.32 0 0"
              material="metalness:0.7; roughness:0.3"
              animation="property: rotation; to: 0 0 -30; dur: 1200; dir: alternate; loop: true; easing: easeInOutSine"></a-box>
            <!-- Legs -->
            <a-box color="#4c1d95" width="0.16" height="0.35" depth="0.16"
              position="-0.14 -0.5 0"
              material="metalness:0.6; roughness:0.4"></a-box>
            <a-box color="#4c1d95" width="0.16" height="0.35" depth="0.16"
              position="0.14 -0.5 0"
              material="metalness:0.6; roughness:0.4"></a-box>
          </a-box>
          <!-- Glow ring -->
          <a-torus color="#a78bfa" radius="0.35" radius-tubular="0.01"
            rotation="90 0 0" position="0 -0.35 0"
            material="emissive:#7c3aed; emissiveIntensity:0.8"
            animation="property: rotation; to: 90 360 0; dur: 3000; loop: true; easing: linear"></a-torus>
        </a-entity>`
    },
    {
      id: 'obj-gem',
      label: 'Crystal',
      icon: '💎',
      aframe: `
        <a-entity id="ar-gem" position="0 0.5 0"
          animation="property: position; to: 0 0.7 0; dur: 2000; dir: alternate; loop: true; easing: easeInOutSine">
          <!-- Main gem — octahedron -->
          <a-octahedron radius="0.4" color="#7c3aed"
            material="metalness:0.1; roughness:0; opacity:0.85; transparent:true; emissive:#4f46e5; emissiveIntensity:0.5"
            animation="property: rotation; to: 0 360 0; dur: 5000; loop: true; easing: linear">
          </a-octahedron>
          <!-- Inner core -->
          <a-octahedron radius="0.22" color="#c4b5fd"
            material="metalness:0; roughness:0; opacity:0.95; transparent:true; emissive:#a78bfa; emissiveIntensity:1"
            animation="property: rotation; to: 360 0 360; dur: 3000; loop: true; easing: linear">
          </a-octahedron>
          <!-- Floating particles -->
          <a-sphere radius="0.04" color="#f0abfc" position="0.55 0.15 0"
            material="emissive:#e879f9; emissiveIntensity:1"
            animation="property: position; to: -0.55 -0.15 0; dur: 2500; dir: alternate; loop: true; easing: easeInOutSine"></a-sphere>
          <a-sphere radius="0.03" color="#818cf8" position="0 0.55 0.2"
            material="emissive:#818cf8; emissiveIntensity:1"
            animation="property: position; to: 0 -0.55 -0.2; dur: 3000; dir: alternate; loop: true; easing: easeInOutCubic"></a-sphere>
          <!-- Shadow ring -->
          <a-torus color="#7c3aed" radius="0.3" radius-tubular="0.015"
            rotation="90 0 0" position="0 -0.5 0"
            material="emissive:#5b21b6; emissiveIntensity:0.6; opacity:0.6; transparent:true"
            animation="property: scale; to: 1.3 1.3 1.3; dur: 2000; dir: alternate; loop: true; easing: easeInOutSine">
          </a-torus>
        </a-entity>`
    },
    {
      id: 'obj-satellite',
      label: 'Satellite',
      icon: '🛸',
      aframe: `
        <a-entity id="ar-satellite" position="0 0.5 0"
          animation="property: rotation; to: 0 360 0; dur: 6000; loop: true; easing: linear">
          <!-- Main body -->
          <a-cylinder color="#94a3b8" radius="0.18" height="0.35"
            rotation="0 0 90"
            material="metalness:0.9; roughness:0.1; emissive:#334155; emissiveIntensity:0.3">
          </a-cylinder>
          <!-- Solar panels -->
          <a-box color="#1d4ed8" width="0.7" height="0.02" depth="0.25"
            position="0 0 0"
            material="metalness:0.6; roughness:0.2; emissive:#1e40af; emissiveIntensity:0.5">
            <!-- Panel lines -->
            <a-box color="#3b82f6" width="0.68" height="0.025" depth="0.01"
              position="0 0 0.06" material="emissive:#3b82f6; emissiveIntensity:0.8"></a-box>
            <a-box color="#3b82f6" width="0.68" height="0.025" depth="0.01"
              position="0 0 -0.06" material="emissive:#3b82f6; emissiveIntensity:0.8"></a-box>
          </a-box>
          <!-- Dish -->
          <a-sphere color="#e2e8f0" radius="0.16" scale="1 0.2 1"
            position="0 0.22 0"
            material="metalness:0.8; roughness:0.2"></a-sphere>
          <!-- Antenna -->
          <a-cylinder color="#f1f5f9" radius="0.01" height="0.3"
            position="0 0.37 0"
            material="emissive:#ffffff; emissiveIntensity:0.4">
            <a-sphere color="#ef4444" radius="0.025"
              position="0 0.17 0"
              material="emissive:#ef4444; emissiveIntensity:1"
              animation="property: material.emissiveIntensity; to: 0.2; dur: 600; dir: alternate; loop: true">
            </a-sphere>
          </a-cylinder>
          <!-- Orbit ring -->
          <a-torus color="#7c3aed" radius="0.7" radius-tubular="0.012"
            rotation="70 0 0"
            material="emissive:#7c3aed; emissiveIntensity:0.6; opacity:0.5; transparent:true">
          </a-torus>
        </a-entity>`
    },
    {
      id: 'obj-earth',
      label: 'Planet',
      icon: '🌍',
      aframe: `
        <a-entity id="ar-earth" position="0 0.5 0">
          <!-- Planet sphere -->
          <a-sphere radius="0.45" color="#1a6b3c"
            material="metalness:0.1; roughness:0.8; emissive:#0f3d22; emissiveIntensity:0.15"
            animation="property: rotation; to: 0 360 0; dur: 8000; loop: true; easing: linear">
            <!-- Ocean -->
            <a-sphere radius="0.44" color="#1d4ed8"
              material="metalness:0; roughness:0.6; opacity:0.7; transparent:true; emissive:#1e3a8a; emissiveIntensity:0.1">
            </a-sphere>
            <!-- Continents (boxes as landmasses) -->
            <a-box color="#16a34a" width="0.3" height="0.01" depth="0.25"
              position="0.2 0.35 0.22"
              rotation="-30 40 20"
              material="roughness:0.9; emissive:#14532d; emissiveIntensity:0.05"></a-box>
            <a-box color="#15803d" width="0.22" height="0.01" depth="0.18"
              position="-0.25 0.1 0.35"
              rotation="10 -30 5"
              material="roughness:0.9"></a-box>
          </a-sphere>
          <!-- Atmosphere glow -->
          <a-sphere radius="0.5" color="#38bdf8"
            material="opacity:0.12; transparent:true; emissive:#0ea5e9; emissiveIntensity:0.3"
            animation="property: material.opacity; to: 0.06; dur: 3000; dir: alternate; loop: true">
          </a-sphere>
          <!-- Orbit Moon -->
          <a-entity
            animation="property: rotation; to: 0 360 0; dur: 5000; loop: true; easing: linear">
            <a-sphere radius="0.1" color="#94a3b8" position="0.9 0 0"
              material="metalness:0.3; roughness:0.9; emissive:#475569; emissiveIntensity:0.15">
            </a-sphere>
          </a-entity>
        </a-entity>`
    },
    {
      id: 'obj-trophy',
      label: 'Trophy',
      icon: '🏆',
      aframe: `
        <a-entity id="ar-trophy" position="0 0 0">
          <!-- Base -->
          <a-cylinder color="#92400e" radius="0.25" height="0.06" position="0 0.03 0"
            material="metalness:0.5; roughness:0.5"></a-cylinder>
          <!-- Stem -->
          <a-cylinder color="#d97706" radius="0.06" height="0.3" position="0 0.21 0"
            material="metalness:0.9; roughness:0.1; emissive:#b45309; emissiveIntensity:0.2"></a-cylinder>
          <!-- Cup body -->
          <a-cylinder color="#fbbf24" radius-bottom="0.12" radius-top="0.22" height="0.4"
            position="0 0.56 0"
            material="metalness:1; roughness:0.05; emissive:#f59e0b; emissiveIntensity:0.4"
            animation="property: rotation; to: 0 360 0; dur: 4000; loop: true; easing: linear">
          </a-cylinder>
          <!-- Handles -->
          <a-torus color="#f59e0b" radius="0.18" radius-tubular="0.025"
            position="-0.28 0.56 0" rotation="0 90 0"
            material="metalness:1; roughness:0.05; emissive:#d97706; emissiveIntensity:0.3"></a-torus>
          <a-torus color="#f59e0b" radius="0.18" radius-tubular="0.025"
            position="0.28 0.56 0" rotation="0 90 0"
            material="metalness:1; roughness:0.05; emissive:#d97706; emissiveIntensity:0.3"></a-torus>
          <!-- Star on top -->
          <a-entity position="0 0.9 0"
            animation="property: rotation; to: 0 360 0; dur: 2000; loop: true; easing: linear">
            <a-dodecahedron radius="0.1" color="#fde68a"
              material="emissive:#fbbf24; emissiveIntensity:1">
            </a-dodecahedron>
          </a-entity>
          <!-- Glow aura -->
          <a-sphere radius="0.55" color="#fbbf24"
            position="0 0.56 0"
            material="opacity:0.08; transparent:true; emissive:#fbbf24; emissiveIntensity:1"
            animation="property: material.opacity; to: 0.02; dur: 1500; dir: alternate; loop: true">
          </a-sphere>
        </a-entity>`
    }
  ];

  // ── State ───────────────────────────────────────────────────────
  let currentObjectIndex = 0;
  let markerDetected = false;

  // ── DOM Refs ────────────────────────────────────────────────────
  const statusDot    = document.getElementById('status-dot');
  const statusText   = document.getElementById('status-text');
  const scanHint     = document.getElementById('scan-hint');
  const toast        = document.getElementById('toast');
  const arContainer  = document.getElementById('ar-object-container');
  const objSelector  = document.getElementById('object-selector');
  const currentLabel = document.getElementById('current-label');
  const markerCount  = document.getElementById('marker-count');

  // ── Build Object Selector Buttons ───────────────────────────────
  function buildSelector() {
    OBJECTS.forEach((obj, idx) => {
      const btn = document.createElement('button');
      btn.className = 'obj-btn' + (idx === 0 ? ' active' : '');
      btn.dataset.index = idx;
      btn.setAttribute('aria-label', `Select ${obj.label}`);
      btn.innerHTML = `<span class="obj-icon">${obj.icon}</span><span>${obj.label}</span>`;
      btn.addEventListener('click', () => switchObject(idx));
      objSelector.appendChild(btn);
    });
  }

  // ── Switch 3D Object ────────────────────────────────────────────
  function switchObject(idx) {
    if (idx === currentObjectIndex) return;

    // Update buttons
    document.querySelectorAll('.obj-btn').forEach((b, i) => {
      b.classList.toggle('active', i === idx);
    });

    // Swap A-Frame content
    currentObjectIndex = idx;
    arContainer.innerHTML = OBJECTS[idx].aframe;

    // Update info bar
    currentLabel.textContent = OBJECTS[idx].label;

    // Toast
    showToast(`${OBJECTS[idx].icon}  ${OBJECTS[idx].label} loaded`);
  }

  // ── Toast ───────────────────────────────────────────────────────
  let toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // ── Marker Detection ─────────────────────────────────────────────
  function onMarkerFound() {
    if (markerDetected) return;
    markerDetected = true;

    statusDot.classList.add('detected');
    statusText.textContent = 'Marker Found';
    scanHint.classList.add('hidden');
    markerCount.textContent = '1';
    showToast('🎯  Marker detected!');
  }

  function onMarkerLost() {
    markerDetected = false;
    statusDot.classList.remove('detected');
    statusText.textContent = 'Scanning…';
    scanHint.classList.remove('hidden');
    markerCount.textContent = '0';
  }

  // ── A-Frame Ready ────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    buildSelector();

    // Load first object
    arContainer.innerHTML = OBJECTS[0].aframe;
    currentLabel.textContent = OBJECTS[0].label;

    // Wait for A-Frame to init scene
    const scene = document.querySelector('a-scene');

    const attachMarkerListeners = () => {
      const marker = document.querySelector('a-marker');
      if (!marker) return;
      marker.addEventListener('markerFound',  onMarkerFound);
      marker.addEventListener('markerLost',   onMarkerLost);
    };

    if (scene.hasLoaded) {
      attachMarkerListeners();
    } else {
      scene.addEventListener('loaded', attachMarkerListeners);
    }
  });

  // ── Fullscreen ────────────────────────────────────────────────────
  document.getElementById('fullscreen-btn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  });

  // Expose for inline access
  window.switchObject = switchObject;

})();
