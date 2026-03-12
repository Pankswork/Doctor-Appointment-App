import React, { useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as THREE from "three";
import { AuthContext } from "../../context/AuthContext";

const HeaderTop = () => {
  const mountRef = useRef(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/appointment");
    } else {
      navigate("/login", { state: { from: { pathname: "/appointment" } } });
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0x06b6d4, 1.4);
    key.position.set(5, 8, 6);
    key.castShadow = true;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x3b82f6, 0.6);
    fill.position.set(-5, 4, 4);
    scene.add(fill);

    const rim = new THREE.PointLight(0xa855f7, 1.2, 20);
    rim.position.set(0, -2, -4);
    scene.add(rim);

    const topGlow = new THREE.PointLight(0x06b6d4, 0.8, 15);
    topGlow.position.set(0, 6, 2);
    scene.add(topGlow);

    // Materials
    const toothMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.15,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });

    const cyanMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.6,
      metalness: 0.7,
      roughness: 0.2,
    });

    const blueMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.4,
      metalness: 0.5,
      roughness: 0.3,
    });

    const purpleMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 0.4,
      metalness: 0.5,
      roughness: 0.3,
    });

    const glowRingMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });

    // ===== MAIN TOOTH =====
    const toothGroup = new THREE.Group();

    // Crown (top part) – smooth dome
    const crownShape = new THREE.Shape();
    crownShape.moveTo(-0.7, 0);
    crownShape.quadraticCurveTo(-0.85, 0.8, -0.55, 1.4);
    crownShape.quadraticCurveTo(-0.3, 1.75, 0, 1.8);
    crownShape.quadraticCurveTo(0.3, 1.75, 0.55, 1.4);
    crownShape.quadraticCurveTo(0.85, 0.8, 0.7, 0);
    crownShape.lineTo(-0.7, 0);

    const crownExtrudeSettings = {
      steps: 1,
      depth: 0.9,
      bevelEnabled: true,
      bevelThickness: 0.25,
      bevelSize: 0.2,
      bevelSegments: 12,
    };
    const crown = new THREE.Mesh(
      new THREE.ExtrudeGeometry(crownShape, crownExtrudeSettings),
      toothMat,
    );
    crown.position.set(0, 0, -0.45);
    toothGroup.add(crown);

    // Roots (two prongs at the bottom)
    [-0.3, 0.3].forEach((xOff) => {
      const rootGeo = new THREE.CylinderGeometry(0.18, 0.06, 1.4, 16);
      const root = new THREE.Mesh(rootGeo, toothMat);
      root.position.set(xOff, -0.7, 0);
      root.rotation.z = xOff > 0 ? -0.12 : 0.12;
      toothGroup.add(root);
    });

    // Sparkle on the tooth surface
    const sparkle = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.08, 0),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
      }),
    );
    sparkle.position.set(0.25, 1.2, 0.45);
    toothGroup.add(sparkle);

    toothGroup.scale.setScalar(1.3);
    toothGroup.position.set(0, 0.2, 0);
    scene.add(toothGroup);

    // ===== STETHOSCOPE =====
    const stethGroup = new THREE.Group();

    // Tube – curved torus
    const tubeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.8, 0.3, 0.2),
      new THREE.Vector3(1.2, -0.2, 0.4),
      new THREE.Vector3(1.0, -0.8, 0.1),
      new THREE.Vector3(0.4, -1.0, -0.2),
      new THREE.Vector3(-0.2, -0.6, -0.1),
    ]);
    const tubeGeo = new THREE.TubeGeometry(tubeCurve, 64, 0.035, 12, false);
    const tube = new THREE.Mesh(tubeGeo, cyanMat);
    stethGroup.add(tube);

    // Chest piece (disc)
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.22, 0.06, 32),
      cyanMat,
    );
    disc.position.set(-0.2, -0.6, -0.1);
    disc.rotation.x = Math.PI / 2;
    stethGroup.add(disc);

    // Disc inner circle
    const discInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.02, 32),
      new THREE.MeshStandardMaterial({
        color: 0x0e7490,
        metalness: 0.9,
        roughness: 0.1,
      }),
    );
    discInner.position.set(-0.2, -0.6, -0.05);
    discInner.rotation.x = Math.PI / 2;
    stethGroup.add(discInner);

    // Earpieces
    [-1, 1].forEach((side) => {
      const earTube = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8),
        cyanMat,
      );
      earTube.position.set(side * 0.15, 0.25, 0);
      earTube.rotation.z = side * 0.3;
      stethGroup.add(earTube);

      const earTip = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 12, 12),
        cyanMat,
      );
      earTip.position.set(side * 0.28, 0.48, 0);
      stethGroup.add(earTip);
    });

    stethGroup.position.set(-1.5, 1.5, 0.5);
    stethGroup.rotation.z = 0.4;
    stethGroup.scale.setScalar(1.1);
    scene.add(stethGroup);

    // ===== HEARTBEAT MONITOR (flat panel) =====
    const monitorGroup = new THREE.Group();

    // Screen
    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.0, 0.06),
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.3,
        roughness: 0.5,
      }),
    );
    monitorGroup.add(screen);

    // Screen bezel glow
    const bezel = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 1.1, 0.04),
      new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.5,
      }),
    );
    bezel.position.z = -0.02;
    monitorGroup.add(bezel);

    // Heartbeat line on screen
    const hbPoints = [];
    for (let i = 0; i < 80; i++) {
      const x = (i / 80) * 1.4 - 0.7;
      let y = 0;
      const m = i % 16;
      if (m === 6) y = 0.12;
      else if (m === 7) y = -0.25;
      else if (m === 8) y = 0.35;
      else if (m === 9) y = -0.15;
      else if (m === 10) y = 0.05;
      hbPoints.push(new THREE.Vector3(x, y, 0.04));
    }
    const hbGeo = new THREE.BufferGeometry().setFromPoints(hbPoints);
    const hbLine = new THREE.Line(
      hbGeo,
      new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 2 }),
    );
    monitorGroup.add(hbLine);

    // Heart icon on the screen
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, 0.06, 0.06, 0.1, 0.1, 0.06);
    heartShape.bezierCurveTo(0.14, 0.02, 0.14, -0.04, 0.1, -0.08);
    heartShape.lineTo(0, -0.16);
    heartShape.lineTo(-0.1, -0.08);
    heartShape.bezierCurveTo(-0.14, -0.04, -0.14, 0.02, -0.1, 0.06);
    heartShape.bezierCurveTo(-0.06, 0.1, 0, 0.06, 0, 0);
    const heartGeo = new THREE.ShapeGeometry(heartShape);
    const heart = new THREE.Mesh(
      heartGeo,
      new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xef4444,
        emissiveIntensity: 0.8,
        side: THREE.DoubleSide,
      }),
    );
    heart.position.set(0.55, 0.3, 0.04);
    heart.scale.setScalar(1.2);
    monitorGroup.add(heart);

    monitorGroup.position.set(1.8, -0.5, -0.5);
    monitorGroup.rotation.y = -0.4;
    monitorGroup.scale.setScalar(0.85);
    scene.add(monitorGroup);

    // ===== FLOATING PILLS =====
    const pills = [];
    const pillConfigs = [
      { x: 2.6, y: 2.5, z: 0.5, mat: cyanMat },
      { x: -2.2, y: -0.5, z: 1.2, mat: purpleMat },
      { x: 2.8, y: -1.5, z: -0.5, mat: blueMat },
      { x: -2.8, y: 2.8, z: -0.5, mat: cyanMat },
      { x: 1.5, y: 3.2, z: -1.2, mat: purpleMat },
    ];
    pillConfigs.forEach((cfg, i) => {
      const capsule = new THREE.Group();
      // Two-tone pill
      const top = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        cfg.mat,
      );
      top.position.y = 0.06;
      capsule.add(top);
      const bottom = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16, 0, Math.PI * 2, Math.PI / 2),
        new THREE.MeshStandardMaterial({
          color: 0xf8fafc,
          roughness: 0.3,
          metalness: 0.1,
        }),
      );
      bottom.position.y = -0.06;
      capsule.add(bottom);
      const mid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16),
        cfg.mat,
      );
      capsule.add(mid);
      capsule.position.set(cfg.x, cfg.y, cfg.z);
      capsule.rotation.set(i * 0.6, i * 0.4, i * 0.8);
      pills.push(capsule);
      scene.add(capsule);
    });

    // ===== DNA HELIX =====
    const helix = new THREE.Group();
    for (let i = 0; i < 45; i++) {
      const t = i * 0.14;
      const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), cyanMat);
      s1.position.set(Math.cos(t) * 0.35, t * 0.22 - 2.5, Math.sin(t) * 0.35);
      helix.add(s1);
      const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), blueMat);
      s2.position.set(-Math.cos(t) * 0.35, t * 0.22 - 2.5, -Math.sin(t) * 0.35);
      helix.add(s2);
      if (i % 4 === 0) {
        const bar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, 0.7, 6),
          new THREE.MeshStandardMaterial({
            color: 0x67e8f9,
            transparent: true,
            opacity: 0.4,
          }),
        );
        bar.position.set(0, t * 0.22 - 2.5, 0);
        bar.rotation.z = Math.PI / 2;
        bar.rotation.y = t;
        helix.add(bar);
      }
    }
    helix.position.set(2.5, 2.5, -2);
    helix.scale.setScalar(0.7);
    scene.add(helix);

    // ===== MEDICAL PLUS SIGNS =====
    const plusSigns = [];
    [
      { x: -2.5, y: 0.5, z: 0.5 },
      { x: 2.2, y: 3.5, z: -1 },
      { x: -1.8, y: 3.8, z: 0.8 },
    ].forEach((pos) => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.04), cyanMat));
      g.add(new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.04), cyanMat));
      g.position.set(pos.x, pos.y, pos.z);
      plusSigns.push(g);
      scene.add(g);
    });

    // ===== ORBIT RINGS around tooth =====
    [1.4, 1.9, 2.5].forEach((r, i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.012, 8, 100),
        glowRingMat,
      );
      ring.rotation.x = Math.PI / 2 + (i - 1) * 0.25;
      ring.rotation.y = i * 0.35;
      ring.position.y = 0.5;
      scene.add(ring);
    });

    // Small orbiting spheres on the rings
    const orbiters = [];
    [1.4, 1.9, 2.5].forEach((r, i) => {
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 16, 16),
        i === 0 ? cyanMat : i === 1 ? blueMat : purpleMat,
      );
      orbiters.push({
        mesh: orb,
        radius: r,
        speed: 0.8 + i * 0.3,
        offset: i * 2,
      });
      scene.add(orb);
    });

    camera.position.set(0, 1, 6.5);
    camera.lookAt(0, 0.5, 0);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    container.addEventListener("mousemove", onMouseMove);

    // Animation
    let t = 0;
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.008;

      // Tooth follows cursor smoothly
      toothGroup.rotation.y += (mouseX * 0.5 - toothGroup.rotation.y) * 0.04;
      toothGroup.rotation.x += (mouseY * 0.3 - toothGroup.rotation.x) * 0.04;
      // Gentle float
      toothGroup.position.y = 0.2 + Math.sin(t * 1.2) * 0.12;

      // Sparkle twinkle
      sparkle.rotation.y += 0.06;
      sparkle.material.opacity = 0.5 + Math.sin(t * 5) * 0.4;

      // Stethoscope float
      stethGroup.position.y = 1.5 + Math.sin(t * 0.9 + 1) * 0.15;
      stethGroup.rotation.z = 0.4 + Math.sin(t * 0.7) * 0.08;

      // Monitor float
      monitorGroup.position.y = -0.5 + Math.sin(t * 0.8 + 2) * 0.1;

      // Heartbeat scroll
      hbLine.position.x = -((t * 6) % 1.4);

      // Heart pulse
      const pulse = 1 + Math.sin(t * 6) * 0.15;
      heart.scale.set(1.2 * pulse, 1.2 * pulse, 1);

      // Pills float & spin
      pills.forEach((p, i) => {
        p.rotation.y += 0.015;
        p.rotation.x += 0.008;
        p.position.y += Math.sin(t * 1.8 + i * 1.5) * 0.003;
      });

      // DNA helix rotate
      helix.rotation.y += 0.007;
      helix.position.y = 2.5 + Math.sin(t * 1.2) * 0.12;

      // Plus signs
      plusSigns.forEach((p, i) => {
        p.rotation.z += 0.012;
        p.position.y += Math.cos(t * 1.5 + i) * 0.003;
      });

      // Orbiting spheres
      orbiters.forEach((o) => {
        const angle = t * o.speed + o.offset;
        o.mesh.position.set(
          Math.cos(angle) * o.radius,
          0.5 + Math.sin(angle) * o.radius * 0.3,
          Math.sin(angle) * o.radius,
        );
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onMouseMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 min-h-screen flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:w-1/2 md:pr-10 text-white"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-6"
          >
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-300 text-sm font-medium">
              Advanced Dental Care
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight mb-6"
          >
            Your New{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              Smile
            </span>{" "}
            <br />
            Starts Here
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-300 text-lg md:text-xl mb-8 max-w-lg leading-relaxed"
          >
            Experience the future of dental care with our state-of-the-art
            facilities and expert professionals dedicated to your perfect smile.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={handleGetStarted}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <span className="relative z-10">GET STARTED</span>
              <svg
                className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 border-2 border-cyan-500/50 text-white font-bold py-4 px-8 rounded-full hover:bg-cyan-500/10 transform hover:-translate-y-1 transition-all duration-300"
            >
              Learn More
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap gap-8 mt-12"
          >
            {[
              { val: "15+", label: "Years Experience" },
              { val: "10K+", label: "Happy Patients" },
              { val: "98%", label: "Satisfaction Rate" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-bold text-cyan-400">
                  {s.val}
                </div>
                <div className="text-gray-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* 3D Medical Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="md:w-1/2 h-[500px] md:h-[600px] w-full relative"
        >
          <div ref={mountRef} className="w-full h-full" />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
    </div>
  );
};

export default HeaderTop;
