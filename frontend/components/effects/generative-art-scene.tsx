"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function GenerativeArtScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.2, 64);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pointLightPosition: { value: new THREE.Vector3(0, 0, 5) },
        color: { value: new THREE.Color(0x7dd3fc) },
        burst: { value: 0 },
        hovered: { value: 0 },
        distortAmount: { value: 0.2 },
      },
      vertexShader: `
        uniform float time;
        uniform float burst;
        uniform float hovered;
        uniform float distortAmount;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDisplacement;
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute(permute(permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        void main() {
            vNormal = normal;
            vPosition = position;
            float baseNoise = snoise(position * 2.0 + time * 0.5);
            float fastNoise = snoise(position * 4.0 + time * 1.2) * 0.5;
            float displacement = (baseNoise + fastNoise) * distortAmount;
            displacement += burst * (1.0 + sin(time * 8.0 + position.y * 6.0) * 0.3);
            displacement += hovered * 0.08;
            vDisplacement = displacement;
            vec3 newPosition = position + normal * displacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform vec3 pointLightPosition;
        uniform float burst;
        uniform float hovered;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDisplacement;
        void main() {
            vec3 normal = normalize(vNormal);
            vec3 lightDir = normalize(pointLightPosition - vPosition);
            float diffuse = max(dot(normal, lightDir), 0.0);
            float fresnel = 1.0 - dot(normal, vec3(0.0, 0.0, 1.0));
            fresnel = pow(fresnel, 2.0);
            vec3 burstColor = mix(color, vec3(1.0, 0.7, 1.0), burst * 2.0);
            vec3 hoverGlow = mix(color, vec3(0.6, 0.9, 1.0), hovered * 0.6);
            vec3 finalColor = hoverGlow * diffuse + burstColor * fresnel * (0.5 + hovered * 0.4);
            finalColor += vec3(0.4, 0.6, 1.0) * abs(vDisplacement) * 0.8;
            gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      wireframe: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    let frame = 0;
    let burstValue = 0;
    let hoveredTarget = 0;
    let hoveredValue = 0;
    const rotationVel = { x: 0.0002, y: 0.0005 };
    const dragState = { active: false, lastX: 0, lastY: 0 };
    let autoRotate = true;

    const animate = (t: number) => {
      material.uniforms.time.value = t * 0.0003;

      burstValue *= 0.94;
      material.uniforms.burst.value = burstValue;

      hoveredValue += (hoveredTarget - hoveredValue) * 0.08;
      material.uniforms.hovered.value = hoveredValue;

      const targetDistort = 0.2 + hoveredValue * 0.15;
      material.uniforms.distortAmount.value +=
        (targetDistort - material.uniforms.distortAmount.value) * 0.05;

      if (autoRotate && !dragState.active) {
        mesh.rotation.y += rotationVel.y;
        mesh.rotation.x += rotationVel.x;
      }
      rotationVel.x *= 0.96;
      rotationVel.y *= 0.96;
      if (Math.abs(rotationVel.y) < 0.0005) rotationVel.y = 0.0005;
      if (Math.abs(rotationVel.x) < 0.0002) rotationVel.x = 0.0002;

      const scale = 1 + hoveredValue * 0.04 + burstValue * 0.15;
      mesh.scale.setScalar(scale);

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    const resize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();

    const getNdc = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const move = (e: MouseEvent) => {
      getNdc(e);
      const vec = new THREE.Vector3(ndc.x, ndc.y, 0.5).unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(dist));
      pointLight.position.copy(pos);
      material.uniforms.pointLightPosition.value.copy(pos);

      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObject(mesh).length > 0;
      hoveredTarget = hit ? 1 : 0;
      renderer.domElement.style.cursor = dragState.active ? "grabbing" : hit ? "grab" : "default";

      if (dragState.active) {
        const dx = e.clientX - dragState.lastX;
        const dy = e.clientY - dragState.lastY;
        rotationVel.y = dx * 0.005;
        rotationVel.x = dy * 0.005;
        mesh.rotation.y += rotationVel.y;
        mesh.rotation.x += rotationVel.x;
        dragState.lastX = e.clientX;
        dragState.lastY = e.clientY;
      }
    };

    const down = (e: MouseEvent) => {
      getNdc(e);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.intersectObject(mesh).length > 0) {
        burstValue = 0.6;
        dragState.active = true;
        dragState.lastX = e.clientX;
        dragState.lastY = e.clientY;
        renderer.domElement.style.cursor = "grabbing";
      }
    };

    const up = () => {
      dragState.active = false;
      renderer.domElement.style.cursor = "default";
    };

    const wheel = (e: WheelEvent) => {
      getNdc(e);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.intersectObject(mesh).length === 0) return;
      e.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.002, 2, 5);
    };

    const visibility = () => { autoRotate = !document.hidden; };

    window.addEventListener("resize", resize);
    renderer.domElement.addEventListener("mousemove", move);
    renderer.domElement.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    renderer.domElement.addEventListener("wheel", wheel, { passive: false });
    document.addEventListener("visibilitychange", visibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("mousemove", move);
      renderer.domElement.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      renderer.domElement.removeEventListener("wheel", wheel);
      document.removeEventListener("visibilitychange", visibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />;
}
