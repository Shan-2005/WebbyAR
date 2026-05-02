/**
 * WebAR — app.js  (v2 — mobile-optimised, all primitives fixed)
 * Fixes: a-octahedron/a-dodecahedron replaced with valid geometry entities
 * Fixes: touch events, mobile viewport, pointer-events
 */

(function () {
  'use strict';

  // ── 5 AR Objects — only using valid A-Frame primitives ─────────
  const OBJECTS = [
    // ── 1. Robot ──────────────────────────────────────────────────
    {
      id: 'obj-robot',
      label: 'Robot',
      icon: '🤖',
      aframe: `
        <a-entity position="0 0.5 0"
          animation="property:rotation; to:0 360 0; dur:5000; loop:true; easing:linear">
          <!-- Torso -->
          <a-box color="#7c3aed" width="0.5" height="0.55" depth="0.35"
            material="metalness:0.8; roughness:0.2; emissive:#3b0764; emissiveIntensity:0.4"
            position="0 0 0">
          </a-box>
          <!-- Head -->
          <a-box color="#a78bfa" width="0.34" height="0.28" depth="0.28"
            position="0 0.46 0"
            material="metalness:0.9; roughness:0.1; emissive:#5b21b6; emissiveIntensity:0.4">
          </a-box>
          <!-- Eye L -->
          <a-sphere color="#00e5ff" radius="0.055" position="-0.08 0.49 0.15"
            material="emissive:#00e5ff; emissiveIntensity:1"
            animation="property:material.emissiveIntensity; to:0.3; dur:900; dir:alternate; loop:true">
          </a-sphere>
          <!-- Eye R -->
          <a-sphere color="#00e5ff" radius="0.055" position="0.08 0.49 0.15"
            material="emissive:#00e5ff; emissiveIntensity:1"
            animation="property:material.emissiveIntensity; to:0.3; dur:900; dir:alternate; loop:true">
          </a-sphere>
          <!-- Arm L -->
          <a-box color="#6d28d9" width="0.12" height="0.4" depth="0.12"
            position="-0.33 0 0"
            material="metalness:0.7; roughness:0.3"
            animation="property:rotation; to:0 0 28; dur:1200; dir:alternate; loop:true; easing:easeInOutSine">
          </a-box>
          <!-- Arm R -->
          <a-box color="#6d28d9" width="0.12" height="0.4" depth="0.12"
            position="0.33 0 0"
            material="metalness:0.7; roughness:0.3"
            animation="property:rotation; to:0 0 -28; dur:1200; dir:alternate; loop:true; easing:easeInOutSine">
          </a-box>
          <!-- Leg L -->
          <a-box color="#4c1d95" width="0.15" height="0.32" depth="0.15"
            position="-0.13 -0.47 0">
          </a-box>
          <!-- Leg R -->
          <a-box color="#4c1d95" width="0.15" height="0.32" depth="0.15"
            position="0.13 -0.47 0">
          </a-box>
          <!-- Glow ring -->
          <a-torus color="#a78bfa" radius="0.38" radius-tubular="0.012"
            rotation="90 0 0" position="0 -0.42 0"
            material="emissive:#7c3aed; emissiveIntensity:0.9"
            animation="property:rotation; to:90 360 0; dur:3000; loop:true; easing:linear">
          </a-torus>
        </a-entity>`
    },

    // ── 2. Crystal ────────────────────────────────────────────────
    {
      id: 'obj-gem',
      label: 'Crystal',
      icon: '💎',
      aframe: `
        <a-entity position="0 0.5 0"
          animation="property:position; to:0 0.75 0; dur:2000; dir:alternate; loop:true; easing:easeInOutSine">
          <!-- Outer gem — using geometry component (octahedron) -->
          <a-entity
            geometry="primitive:octahedron; radius:0.42"
            material="color:#7c3aed; metalness:0.1; roughness:0; opacity:0.82; transparent:true; emissive:#4f46e5; emissiveIntensity:0.5"
            animation="property:rotation; to:0 360 0; dur:5000; loop:true; easing:linear">
          </a-entity>
          <!-- Inner core -->
          <a-entity
            geometry="primitive:octahedron; radius:0.22"
            material="color:#c4b5fd; metalness:0; roughness:0; opacity:0.95; transparent:true; emissive:#a78bfa; emissiveIntensity:1.2"
            animation="property:rotation; to:360 0 360; dur:3000; loop:true; easing:linear">
          </a-entity>
          <!-- Particle 1 -->
          <a-sphere radius="0.05" color="#f0abfc" position="0.6 0.15 0"
            material="emissive:#e879f9; emissiveIntensity:1"
            animation="property:position; to:-0.6 -0.15 0; dur:2500; dir:alternate; loop:true; easing:easeInOutSine">
          </a-sphere>
          <!-- Particle 2 -->
          <a-sphere radius="0.04" color="#818cf8" position="0 0.6 0.2"
            material="emissive:#818cf8; emissiveIntensity:1"
            animation="property:position; to:0 -0.6 -0.2; dur:3000; dir:alternate; loop:true; easing:easeInOutCubic">
          </a-sphere>
          <!-- Shadow ring -->
          <a-torus color="#7c3aed" radius="0.32" radius-tubular="0.016"
            rotation="90 0 0" position="0 -0.52 0"
            material="emissive:#5b21b6; emissiveIntensity:0.6; opacity:0.55; transparent:true"
            animation="property:scale; to:1.35 1.35 1.35; dur:2000; dir:alternate; loop:true; easing:easeInOutSine">
          </a-torus>
        </a-entity>`
    },

    // ── 3. Satellite ──────────────────────────────────────────────
    {
      id: 'obj-satellite',
      label: 'Satellite',
      icon: '🛸',
      aframe: `
        <a-entity position="0 0.5 0"
          animation="property:rotation; to:0 360 0; dur:7000; loop:true; easing:linear">
          <!-- Body -->
          <a-cylinder color="#94a3b8" radius="0.18" height="0.35"
            rotation="0 0 90"
            material="metalness:0.9; roughness:0.1; emissive:#334155; emissiveIntensity:0.3">
          </a-cylinder>
          <!-- Solar panel -->
          <a-box color="#1d4ed8" width="0.75" height="0.02" depth="0.26"
            material="metalness:0.6; roughness:0.2; emissive:#1e40af; emissiveIntensity:0.5">
          </a-box>
          <!-- Panel stripe 1 -->
          <a-box color="#3b82f6" width="0.73" height="0.025" depth="0.01"
            position="0 0 0.07"
            material="emissive:#3b82f6; emissiveIntensity:0.9">
          </a-box>
          <!-- Panel stripe 2 -->
          <a-box color="#3b82f6" width="0.73" height="0.025" depth="0.01"
            position="0 0 -0.07"
            material="emissive:#3b82f6; emissiveIntensity:0.9">
          </a-box>
          <!-- Dish -->
          <a-sphere color="#e2e8f0" radius="0.17" scale="1 0.22 1"
            position="0 0.22 0"
            material="metalness:0.8; roughness:0.2">
          </a-sphere>
          <!-- Antenna -->
          <a-cylinder color="#f1f5f9" radius="0.012" height="0.3"
            position="0 0.38 0"
            material="emissive:#ffffff; emissiveIntensity:0.4">
          </a-cylinder>
          <!-- Blink light -->
          <a-sphere color="#ef4444" radius="0.028" position="0 0.54 0"
            material="emissive:#ef4444; emissiveIntensity:1"
            animation="property:material.emissiveIntensity; to:0.15; dur:600; dir:alternate; loop:true">
          </a-sphere>
          <!-- Orbit ring -->
          <a-torus color="#7c3aed" radius="0.72" radius-tubular="0.013"
            rotation="70 0 0"
            material="emissive:#7c3aed; emissiveIntensity:0.6; opacity:0.45; transparent:true">
          </a-torus>
        </a-entity>`
    },

    // ── 4. Planet ─────────────────────────────────────────────────
    {
      id: 'obj-earth',
      label: 'Planet',
      icon: '🌍',
      aframe: `
        <a-entity position="0 0.5 0">
          <!-- Planet -->
          <a-sphere radius="0.46" color="#1a6b3c"
            material="metalness:0.1; roughness:0.8; emissive:#0f3d22; emissiveIntensity:0.15"
            animation="property:rotation; to:0 360 0; dur:9000; loop:true; easing:linear">
            <!-- Ocean layer -->
            <a-sphere radius="0.44" color="#1d4ed8"
              material="metalness:0; roughness:0.6; opacity:0.65; transparent:true; emissive:#1e3a8a; emissiveIntensity:0.1">
            </a-sphere>
          </a-sphere>
          <!-- Atmosphere glow -->
          <a-sphere radius="0.52" color="#38bdf8"
            material="opacity:0.1; transparent:true; emissive:#0ea5e9; emissiveIntensity:0.35"
            animation="property:material.opacity; to:0.05; dur:3000; dir:alternate; loop:true">
          </a-sphere>
          <!-- Orbiting moon -->
          <a-entity animation="property:rotation; to:0 360 0; dur:5000; loop:true; easing:linear">
            <a-sphere radius="0.1" color="#94a3b8" position="0.95 0 0"
              material="metalness:0.3; roughness:0.9; emissive:#475569; emissiveIntensity:0.2">
            </a-sphere>
          </a-entity>
          <!-- Orbit ring -->
          <a-torus color="#a78bfa" radius="0.95" radius-tubular="0.01"
            rotation="90 0 0"
            material="emissive:#7c3aed; emissiveIntensity:0.4; opacity:0.35; transparent:true">
          </a-torus>
        </a-entity>`
    },

    // ── 5. Trophy ─────────────────────────────────────────────────
    {
      id: 'obj-trophy',
      label: 'Trophy',
      icon: '🏆',
      aframe: `
        <a-entity position="0 0 0">
          <!-- Base plate -->
          <a-cylinder color="#92400e" radius="0.26" height="0.06"
            position="0 0.03 0"
            material="metalness:0.5; roughness:0.5">
          </a-cylinder>
          <!-- Stem -->
          <a-cylinder color="#d97706" radius="0.065" height="0.3"
            position="0 0.21 0"
            material="metalness:0.9; roughness:0.1; emissive:#b45309; emissiveIntensity:0.2">
          </a-cylinder>
          <!-- Cup -->
          <a-cylinder color="#fbbf24"
            radius-bottom="0.13" radius-top="0.23" height="0.42"
            position="0 0.57 0"
            material="metalness:1; roughness:0.05; emissive:#f59e0b; emissiveIntensity:0.4"
            animation="property:rotation; to:0 360 0; dur:4000; loop:true; easing:linear">
          </a-cylinder>
          <!-- Handle L -->
          <a-torus color="#f59e0b" radius="0.19" radius-tubular="0.026"
            position="-0.3 0.57 0" rotation="0 90 0"
            material="metalness:1; roughness:0.05; emissive:#d97706; emissiveIntensity:0.3">
          </a-torus>
          <!-- Handle R -->
          <a-torus color="#f59e0b" radius="0.19" radius-tubular="0.026"
            position="0.3 0.57 0" rotation="0 90 0"
            material="metalness:1; roughness:0.05; emissive:#d97706; emissiveIntensity:0.3">
          </a-torus>
          <!-- Star on top — using valid sphere+box combo -->
          <a-entity position="0 0.92 0"
            animation="property:rotation; to:0 360 0; dur:2000; loop:true; easing:linear">
            <a-sphere radius="0.1" color="#fde68a"
              material="emissive:#fbbf24; emissiveIntensity:1.2">
            </a-sphere>
            <!-- Star spikes -->
            <a-box color="#fde68a" width="0.04" height="0.24" depth="0.04"
              material="emissive:#fbbf24; emissiveIntensity:0.8">
            </a-box>
            <a-box color="#fde68a" width="0.24" height="0.04" depth="0.04"
              material="emissive:#fbbf24; emissiveIntensity:0.8">
            </a-box>
          </a-entity>
          <!-- Aura glow -->
          <a-sphere radius="0.58" color="#fbbf24" position="0 0.57 0"
            material="opacity:0.07; transparent:true; emissive:#fbbf24; emissiveIntensity:1"
            animation="property:material.opacity; to:0.02; dur:1500; dir:alternate; loop:true">
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
      // Both touch and click for mobile compatibility
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        switchObject(idx);
      });
      objSelector.appendChild(btn);
    });
  }

  // ── Switch 3D Object ────────────────────────────────────────────
  function switchObject(idx) {
    if (idx === currentObjectIndex) return;
    document.querySelectorAll('.obj-btn').forEach((b, i) => {
      b.classList.toggle('active', i === idx);
    });
    currentObjectIndex = idx;
    arContainer.innerHTML = OBJECTS[idx].aframe;
    currentLabel.textContent = OBJECTS[idx].label;
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

  // ── Init ────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    buildSelector();
    arContainer.innerHTML = OBJECTS[0].aframe;
    currentLabel.textContent = OBJECTS[0].label;

    const scene = document.querySelector('a-scene');
    const attachMarkerListeners = () => {
      const marker = document.querySelector('a-marker');
      if (!marker) return;
      marker.addEventListener('markerFound', onMarkerFound);
      marker.addEventListener('markerLost',  onMarkerLost);
    };

    if (scene.hasLoaded) {
      attachMarkerListeners();
    } else {
      scene.addEventListener('loaded', attachMarkerListeners);
    }
  });

  // ── Fullscreen ────────────────────────────────────────────────────
  const fsBtn = document.getElementById('fullscreen-btn');
  if (fsBtn) {
    fsBtn.addEventListener('pointerdown', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen();
      }
    });
  }

})();
