/* ============================================================
   Bridge Consult — 3D Project Universe
   Shared scene + interaction logic for projects.html (RU/EN/UZ)
   Requires: THREE (r128) and gsap, loaded before this file.
   Reads project content from the DOM (.uni-label / .uni-detail-card),
   so it is fully language-agnostic.
   ============================================================ */
(function () {
    "use strict";

    var wrap     = document.getElementById('uni-canvas-wrap');
    var labelsEl = document.getElementById('uni-labels');
    var loading  = document.getElementById('uni-loading');
    var autoBtn  = document.getElementById('uni-autorotate');
    var detail   = document.getElementById('uni-detail');
    if (!wrap || !labelsEl || !detail) return;

    var labels = Array.prototype.slice.call(labelsEl.querySelectorAll('.uni-label'));
    var cards  = Array.prototype.slice.call(detail.querySelectorAll('.uni-detail-card'));

    /* ---- Detail overlay (works with or without WebGL) -------- */
    var resumeAuto = true;

    function openDetail(i) {
        cards.forEach(function (c) { c.hidden = (parseInt(c.dataset.idx, 10) !== i); });
        detail.classList.add('is-open');
        detail.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function closeDetail() {
        detail.classList.remove('is-open');
        detail.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        detail.querySelectorAll('video').forEach(function (v) { try { v.pause(); } catch (e) {} });
        if (resumeAuto) { autorotate = true; updateAutoBtn(); }
    }
    labels.forEach(function (l) {
        l.addEventListener('click', function () { selectProject(parseInt(l.dataset.idx, 10)); });
    });
    detail.querySelectorAll('[data-uni-close]').forEach(function (el) {
        el.addEventListener('click', closeDetail);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && detail.classList.contains('is-open')) closeDetail();
    });

    /* ---- Auto-rotate toggle ---------------------------------- */
    var autorotate = true;
    function updateAutoBtn() {
        if (!autoBtn) return;
        autoBtn.classList.toggle('is-on', autorotate);
    }
    if (autoBtn) {
        autoBtn.addEventListener('click', function () {
            autorotate = !autorotate; resumeAuto = autorotate; updateAutoBtn();
        });
    }

    /* ---- Graceful fallback ----------------------------------- */
    function startFallback() {
        labelsEl.classList.add('uni-fallback');
        if (loading) loading.style.display = 'none';
        // labels already wired to open detail
    }

    if (typeof THREE === 'undefined' || typeof gsap === 'undefined') { startFallback(); return; }

    /* ========================================================== */
    /*  THREE.js scene                                            */
    /* ========================================================== */
    var scene, camera, renderer, universe, rings, stars, planet, glowSprite;
    var nodeGroups = [], nodeCores = [], nodeGlows = [], pickables = [];
    var raycaster = new THREE.Raycaster();
    var occRay = new THREE.Raycaster();
    var pointer = new THREE.Vector2();
    var hovered = -1;
    var velY = 0, isDown = false, moved = false, sx = 0, sy = 0, lx = 0, ly = 0;
    var tmpV = new THREE.Vector3();

    // 8 node directions evenly spread around the sphere (longitudes 45° apart,
    // alternating latitudes) so ~4 stay front-facing & spread at any rotation
    var DIRS = [
        new THREE.Vector3( 0.26,  0.64,  0.72),
        new THREE.Vector3( 0.93, -0.26,  0.25),
        new THREE.Vector3( 0.66,  0.50, -0.56),
        new THREE.Vector3( 0.07, -0.64, -0.76),
        new THREE.Vector3(-0.55,  0.26, -0.79),
        new THREE.Vector3(-0.85, -0.50, -0.15),
        new THREE.Vector3(-0.58,  0.71,  0.41),
        new THREE.Vector3(-0.34, -0.17,  0.93)
    ];
    var PR = 1.75;          // planet radius
    var NODE_R = PR + 0.95; // node orbit radius
    var POS = DIRS.map(function (v) { return v.clone().normalize().multiplyScalar(NODE_R); });

    function glowTexture() {
        var c = document.createElement('canvas'); c.width = c.height = 128;
        var g = c.getContext('2d');
        var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        gr.addColorStop(0.0, 'rgba(170,150,120,0.95)');
        gr.addColorStop(0.3, 'rgba(138,123,102,0.35)');
        gr.addColorStop(1.0, 'rgba(138,123,102,0.0)');
        g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(c);
    }

    function init() {
        var W = wrap.clientWidth, H = wrap.clientHeight || window.innerHeight;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x12100d, 0.03);

        camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
        camera.position.set(0, 0, 7); // real z set by layoutScene()
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); // canvas spans the whole scene now — cap DPR for perf
        renderer.setSize(W, H);
        renderer.setClearColor(0x000000, 0);
        wrap.appendChild(renderer.domElement);

        // lights
        scene.add(new THREE.AmbientLight(0x8A7B66, 0.5));
        var key = new THREE.PointLight(0xffffff, 0.9); key.position.set(5, 5, 6); scene.add(key);
        var rim = new THREE.PointLight(0x8A7B66, 0.7); rim.position.set(-6, -3, -4); scene.add(rim);

        var gtex = glowTexture();

        // big atmospheric glow behind planet
        glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: gtex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.7 }));
        glowSprite.scale.set(PR * 5.2, PR * 5.2, 1); scene.add(glowSprite);

        universe = new THREE.Group(); scene.add(universe);

        // planet core
        var coreGeo = new THREE.IcosahedronGeometry(PR, 4);
        planet = new THREE.Mesh(coreGeo, new THREE.MeshStandardMaterial({
            color: 0x2a2520, metalness: 0.4, roughness: 0.8, flatShading: true,
            emissive: 0x14100b, emissiveIntensity: 0.8
        }));
        universe.add(planet);

        // wireframe shell
        var wf = new THREE.LineSegments(
            new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(PR * 1.02, 3)),
            new THREE.LineBasicMaterial({ color: 0x8A7B66, transparent: true, opacity: 0.24 })
        );
        universe.add(wf);

        // dotted surface points
        var dotGeo = new THREE.IcosahedronGeometry(PR * 1.045, 5);
        var dots = new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: 0xb6a489, size: 0.02, transparent: true, opacity: 0.65 }));
        universe.add(dots);

        // rim glow shell (back side)
        var shell = new THREE.Mesh(
            new THREE.SphereGeometry(PR * 1.2, 48, 48),
            new THREE.MeshBasicMaterial({ color: 0x8A7B66, transparent: true, opacity: 0.07, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false })
        );
        universe.add(shell);

        // orbit rings (separate group, slow independent spin)
        rings = new THREE.Group(); scene.add(rings);
        [[NODE_R + 0.05, 0.35, 0.1], [NODE_R + 0.5, -0.4, 0.6], [NODE_R + 0.85, 0.15, -0.5]].forEach(function (r) {
            var ring = new THREE.Mesh(
                new THREE.RingGeometry(r[0], r[0] + 0.007, 180),
                new THREE.MeshBasicMaterial({ color: 0x8A7B66, transparent: true, opacity: 0.13, side: THREE.DoubleSide })
            );
            ring.rotation.x = Math.PI / 2 + r[1];
            ring.rotation.y = r[2];
            rings.add(ring);
        });

        // Stars are now a single CSS layer (.uni-bg::before) spanning the WHOLE
        // scene, so the star background is ONE consistent theme everywhere and
        // the canvas only has to render the planet (much lighter / smoother).
        stars = new THREE.Group(); scene.add(stars);

        // project nodes
        var lineMat = new THREE.LineBasicMaterial({ color: 0x8A7B66, transparent: true, opacity: 0.22 });
        POS.forEach(function (p, i) {
            // connector line from centre to node
            var lg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), p.clone()]);
            universe.add(new THREE.Line(lg, lineMat));

            var ng = new THREE.Group(); ng.position.copy(p); universe.add(ng);

            var core = new THREE.Mesh(
                new THREE.SphereGeometry(0.075, 18, 18),
                new THREE.MeshBasicMaterial({ color: 0xcdb796 })
            );
            ng.add(core);

            var glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: gtex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9 }));
            glow.scale.set(0.6, 0.6, 1); ng.add(glow);

            // invisible larger hit target — bigger on mobile for easier tapping
            var hit = new THREE.Mesh(
                new THREE.SphereGeometry(W < 768 ? 0.52 : 0.3, 12, 12),
                new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
            );
            hit.userData.idx = i; ng.add(hit);

            nodeGroups.push(ng); nodeCores.push(core); nodeGlows.push(glow); pickables.push(hit);
        });

        layoutScene();
        wireInput();
        // iOS Safari fires resize when the address bar shows/hides (height-only change).
        // Only re-layout when the WIDTH changes to prevent the planet jumping on scroll.
        var _resizeW = wrap.clientWidth;
        window.addEventListener('resize', function () {
            var W = wrap.clientWidth;
            if (W !== _resizeW) { _resizeW = W; layoutScene(); }
        });

        if (loading) { loading.classList.add('hide'); setTimeout(function () { if (loading) loading.style.display = 'none'; }, 700); }
        animate();
    }

    function makeStars(n, color, size, opacity, rMin, rMax) {
        var arr = new Float32Array(n * 3);
        for (var i = 0; i < n; i++) {
            var r = rMin + Math.random() * (rMax - rMin);
            var th = Math.random() * Math.PI * 2;
            var ph = Math.acos(2 * Math.random() - 1);
            arr[i * 3]     = r * Math.sin(ph) * Math.cos(th);
            arr[i * 3 + 1] = r * Math.cos(ph);
            arr[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
        }
        var g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
        return new THREE.Points(g, new THREE.PointsMaterial({ color: color, size: size, transparent: true, opacity: opacity, depthWrite: false }));
    }

    /* ---- Input ---------------------------------------------- */
    function wireInput() {
        var dom = renderer.domElement;
        var univEl = document.getElementById('universe');
        dom.style.cursor = 'grab';
        dom.addEventListener('pointerdown', function (e) {
            // touches that start below #universe (in the CTA) should scroll, not rotate
            if (univEl) {
                var r = univEl.getBoundingClientRect();
                if (e.clientY > r.bottom) return;
            }
            isDown = true; moved = false; sx = lx = e.clientX; sy = ly = e.clientY;
            dom.style.cursor = 'grabbing';
            try { dom.setPointerCapture(e.pointerId); } catch (er) {}
        });
        dom.addEventListener('pointermove', function (e) {
            if (isDown) {
                e.preventDefault(); // stop page scroll while dragging the sphere
                var dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
                if (Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 6) moved = true;
                universe.rotation.y += dx * 0.006;
                universe.rotation.x = clamp(universe.rotation.x + dy * 0.006, -0.65, 0.65);
                velY = dx * 0.006;
            } else {
                updateHover(e);
            }
        }, { passive: false });
        dom.addEventListener('pointerup', function (e) {
            dom.style.cursor = 'grab';
            if (isDown && !moved) {
                var idx = pick(e);
                if (idx >= 0) selectProject(idx);
            }
            isDown = false;
        });
        dom.addEventListener('pointerleave', function () { if (!isDown) clearHover(); });
    }

    function ndc(e) {
        var r = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    }
    function pick(e) {
        ndc(e); raycaster.setFromCamera(pointer, camera);
        var hits = raycaster.intersectObjects(pickables, false);
        return hits.length ? hits[0].object.userData.idx : -1;
    }
    function updateHover(e) {
        var idx = pick(e);
        if (idx !== hovered) {
            clearHover();
            hovered = idx;
            if (idx >= 0) {
                renderer.domElement.style.cursor = 'pointer';
                if (labels[idx]) labels[idx].classList.add('is-hover');
            } else {
                renderer.domElement.style.cursor = isDown ? 'grabbing' : 'grab';
            }
        }
    }
    function clearHover() {
        if (hovered >= 0 && labels[hovered]) labels[hovered].classList.remove('is-hover');
        hovered = -1;
        if (renderer) renderer.domElement.style.cursor = isDown ? 'grabbing' : 'grab';
    }

    /* ---- Select / focus a project --------------------------- */
    function selectProject(i) {
        if (typeof THREE === 'undefined' || !universe) { openDetail(i); return; }
        resumeAuto = autorotate;
        autorotate = false; updateAutoBtn();
        var p = POS[i];
        var targetY = -Math.atan2(p.x, p.z);
        // normalise current rotation near target to avoid long spins
        var cy = universe.rotation.y;
        targetY = cy + shortestAngle(cy, targetY);
        gsap.to(universe.rotation, { y: targetY, x: 0.06, duration: 1.0, ease: 'power3.inOut' });
        gsap.to(nodeCores[i].scale, { x: 2.4, y: 2.4, z: 2.4, duration: 0.5, yoyo: true, repeat: 1, ease: 'power2.out' });
        setTimeout(function () { openDetail(i); }, 560);
    }
    function shortestAngle(from, to) {
        var d = (to - from) % (Math.PI * 2);
        if (d > Math.PI) d -= Math.PI * 2;
        if (d < -Math.PI) d += Math.PI * 2;
        return d;
    }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    /* ---- Per-frame ------------------------------------------ */
    function updateLabels() {
        var r = renderer.domElement.getBoundingClientRect();
        for (var i = 0; i < nodeGroups.length; i++) {
            nodeGroups[i].getWorldPosition(tmpV);
            var world = tmpV.clone();
            tmpV.project(camera);
            var x = (tmpV.x * 0.5 + 0.5) * r.width;
            var y = (-tmpV.y * 0.5 + 0.5) * r.height;
            var lab = labels[i];
            if (!lab) continue;

            // occlusion by the planet
            var dir = world.clone().sub(camera.position).normalize();
            occRay.set(camera.position, dir);
            var hit = occRay.intersectObject(planet, false);
            var dist = camera.position.distanceTo(world);
            var occluded = hit.length && hit[0].distance < dist - 0.05;
            var behind = tmpV.z > 1;

            if (occluded || behind) {
                lab.style.opacity = '0.12';
                lab.style.pointerEvents = 'none';
            } else {
                lab.style.opacity = (hovered === i ? '1' : '0.92');
                lab.style.pointerEvents = 'auto';
            }
            // keep the label fully on-screen (prevents edge cut-off on mobile)
            var hw = (lab.offsetWidth || 80) / 2 + 6;
            var hh = (lab.offsetHeight || 40) / 2 + 6;
            x = Math.max(hw, Math.min(r.width - hw, x));
            y = Math.max(hh, Math.min(r.height - hh, y));
            lab.style.left = x + 'px';
            lab.style.top = y + 'px';
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        // skip all 3D work when the canvas is scrolled out of view (big perf win
        // while reading the document / reference list below the planet)
        var vr = wrap.getBoundingClientRect();
        if (vr.bottom < 0 || vr.top > (window.innerHeight || 0)) return;
        if (!isDown) {
            if (autorotate) universe.rotation.y += 0.0016;
            else { universe.rotation.y += velY; velY *= 0.94; }
        }
        rings.rotation.y -= 0.0007; rings.rotation.x = -0.15;
        stars.rotation.y += 0.0002;

        var t = performance.now() * 0.003;
        for (var i = 0; i < nodeCores.length; i++) {
            if (hovered === i) continue;
            var s = 1 + Math.sin(t + i * 1.7) * 0.14;
            nodeGlows[i].scale.set(0.55 * s, 0.55 * s, 1);
        }
        updateLabels();
        renderer.render(scene, camera);
    }

    /* The canvas spans the WHOLE .uni-scene (universe + document CTA), so the
       3D starfield fills both. The planet must still sit inside the first
       viewport, well below the heading text — this computes camera distance
       (keeping the planet's on-screen size constant regardless of canvas
       height) and the world-Y offset that pins the planet centre to a fixed
       fraction of the first viewport. */
    function layoutScene() {
        if (!renderer) return;
        var W = wrap.clientWidth, H = wrap.clientHeight || window.innerHeight;
        var vp = window.innerHeight || H;
        var mobile = W < 768;

        var zBase = mobile ? 8.2 : 6.4;
        var z = zBase * (H / vp);
        camera.aspect = W / H;
        camera.position.z = z;
        // keep fog constant at the planet's distance regardless of how tall the
        // scene/canvas grows (otherwise a tall canvas pushes the camera far and
        // FogExp2 would fog the planet out)
        if (scene && scene.fog) scene.fog.density = 0.24 / z;
        camera.updateProjectionMatrix();

        var worldH = 2 * z * Math.tan(Math.PI * 45 / 360); // world units per canvas height
        var targetPx = (mobile ? 0.74 : 0.72) * vp;        // planet centre in the 1st viewport
        var yOff = (1 - 2 * (targetPx / H)) * worldH / 2;
        universe.position.y = yOff;
        rings.position.y = yOff;
        glowSprite.position.y = yOff;

        renderer.setSize(W, H);
    }

    /* ---- Boot ------------------------------------------------ */
    try { init(); }
    catch (err) { console.error('[universe] init failed:', err); startFallback(); }
})();
