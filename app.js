/**
 * WebAR — app.js (v4 — Final Real Models Only)
 */

(function () {
  'use strict';

  // ── 4 Real GLB Models ──────────────────────────────────────────
  const OBJECTS = [

    // ── 0. 🚀 Astronaut ──────────────────────────────────────────
    {
      id: 'obj-astronaut',
      label: 'Astronaut',
      icon: '👨‍🚀',
      aframe: `
        <a-entity
          gltf-model="models/Astronaut.glb"
          position="0 0.5 0"
          scale="1.2 1.2 1.2"
          rotation="0 0 0"
          animation-mixer="clip: *; loop: repeat;">
        </a-entity>`
    },

    // ── 1. 🏰 Castle ──────────────────────────────────────────────
    {
      id: 'obj-castle',
      label: 'Castle',
      icon: '🏰',
      aframe: `
        <a-entity
          gltf-model="models/Castle.glb"
          position="0 0 0"
          scale="1.5 1.5 1.5"
          rotation="0 0 0">
        </a-entity>`
    },

    // ── 2. 🧟 Undead ──────────────────────────────────────────────
    {
      id: 'obj-undead',
      label: 'Undead',
      icon: '🧟',
      aframe: `
        <a-entity
          gltf-model="models/Undead.glb"
          position="0 0 0"
          scale="1.5 1.5 1.5"
          rotation="0 0 0"
          animation-mixer="clip: *; loop: repeat;">
        </a-entity>`
    },

    // ── 3. ⚔️ Knight ──────────────────────────────────────────────
    {
      id: 'obj-knight',
      label: 'Knight',
      icon: '⚔️',
      aframe: `
        <a-entity
          gltf-model="models/Knight.glb"
          position="0 0 0"
          scale="1.5 1.5 1.5"
          rotation="0 0 0"
          animation-mixer="clip: *; loop: repeat;">
        </a-entity>`
    }
  ];

  let currentObjectIndex = 0;
  let markerDetected = false;

  function el(id) {
    return document.getElementById(id) || {
      textContent: '',
      classList: { add: () => {}, remove: () => {}, toggle: () => {} },
      style: {},
      innerHTML: ''
    };
  }

  function buildSelector() {
    const objSelector = el('object-selector');
    if (!objSelector.appendChild) return;
    objSelector.innerHTML = ''; // Clear old buttons

    OBJECTS.forEach((obj, idx) => {
      const btn = document.createElement('button');
      btn.className = 'obj-btn' + (idx === 0 ? ' active' : '');
      btn.innerHTML = `<span class="obj-icon">${obj.icon}</span><span>${obj.label}</span>`;
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        switchObject(idx);
      });
      objSelector.appendChild(btn);
    });
  }

  function switchObject(idx) {
    if (idx === currentObjectIndex) return;
    document.querySelectorAll('.obj-btn').forEach((b, i) => {
      b.classList.toggle('active', i === idx);
    });
    currentObjectIndex = idx;

    const container = document.getElementById('ar-object-container');
    if (container) container.innerHTML = OBJECTS[idx].aframe;

    el('current-label').textContent = OBJECTS[idx].label;
    showToast(`${OBJECTS[idx].icon} ${OBJECTS[idx].label} loading...`);
  }

  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function onMarkerFound() {
    if (markerDetected) return;
    markerDetected = true;
    el('status-dot').classList.add('detected');
    el('status-text').textContent = 'Marker Found!';
    el('scan-hint').classList.add('hidden');
    el('marker-count').textContent = '1';
  }

  function onMarkerLost() {
    markerDetected = false;
    el('status-dot').classList.remove('detected');
    el('status-text').textContent = 'Scanning…';
    el('scan-hint').classList.remove('hidden');
    el('marker-count').textContent = '0';
  }

  function initARApp() {
    buildSelector();
    const container = document.getElementById('ar-object-container');
    if (container) container.innerHTML = OBJECTS[0].aframe;
    el('current-label').textContent = OBJECTS[0].label;

    const scene = document.querySelector('a-scene');
    if (!scene) return;

    const attach = () => {
      const marker = document.querySelector('a-marker');
      if (!marker) return;
      marker.addEventListener('markerFound', onMarkerFound);
      marker.addEventListener('markerLost',  onMarkerLost);
    };

    scene.hasLoaded ? attach() : scene.addEventListener('loaded', attach);
  }

  window.initARApp = initARApp;

})();
