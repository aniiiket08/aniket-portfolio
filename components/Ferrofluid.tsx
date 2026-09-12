/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";
import "./Ferrofluid.css";

export interface FerrofluidProps {
  color?: string;
  background?: string;
  accentColor?: string;
  speed?: number;
  scale?: number;
  turbulence?: number;
  fluidity?: number;
  rimWidth?: number;
  sharpness?: number;
  shimmer?: number;
  glow?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  paused?: boolean;
}

const vertex = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;

uniform vec3 uColor;
uniform vec3 uBackground;
uniform vec3 uAccent;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uOpacity;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uMotion;

varying vec2 vUv;

// Simplex-style 2D noise
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                          dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * snoise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float ridged(vec2 p) {
  return 1.0 - abs(snoise(p));
}

// Surface field: larger forms, gentle liquid transitions
float surfaceField(vec2 p, float t) {
  vec2 q = p * uScale;
  float n1 = fbm(q + vec2(t * 0.08, -t * 0.06));
  float n2 = fbm(q * 1.3 - vec2(t * 0.05, t * 0.07) + 12.3);
  float r  = ridged(q * 0.6 + vec2(t * 0.04, t * 0.05));
  float n3 = fbm(q * 0.45 + vec2(-t * 0.04, t * 0.03) + 24.1);

  float field = n1 * 0.52 + n2 * 0.32 + r * uTurbulence * 0.32 + n3 * 0.36;
  field = field * 0.5 + 0.5;
  return field;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
  float t = uTime * uSpeed * uMotion;

  // Calm, slow fluid breathing
  float baseLevel = 0.44 + sin(t * 0.15) * 0.025;
  float fluid = surfaceField(p * (1.0 + uFluidity * 0.2), t);

  // Subtle mouse interaction
  vec2 mouseDelta = uv - uPointer;
  float mouseDist = length(mouseDelta * vec2(aspect, 1.0));
  float mouseRadius = max(uMouseRadius, 0.001);
  float mouseFalloff = smoothstep(mouseRadius, 0.0, mouseDist);
  float mouseWave = sin(mouseDist * 16.0 - t * 4.0) * 0.5 + 0.5;
  float mouseInfluence = mouseFalloff * (0.5 + mouseWave * 0.5) * uPointerActive;
  fluid += mouseInfluence * uMouseStrength * 0.25;

  // Surface normal
  float e = 0.004;
  float fx = surfaceField(vec2(p.x + e, p.y) * (1.0 + uFluidity * 0.2), t)
           - surfaceField(vec2(p.x - e, p.y) * (1.0 + uFluidity * 0.2), t);
  float fy = surfaceField(vec2(p.x, p.y + e) * (1.0 + uFluidity * 0.2), t)
           - surfaceField(vec2(p.x, p.y - e) * (1.0 + uFluidity * 0.2), t);
  vec3 normal = normalize(vec3(-fx, -fy, 0.022 * uSharpness));

  // Fluid wave body and crest
  float h = fluid - baseLevel;
  float body = smoothstep(0.04, 0.42, h);
  float rim  = smoothstep(0.22, 0.05, abs(h - 0.22)) * uRimWidth;

  // Lighting - low intensity, dark and restrained
  vec3 lightDir = normalize(vec3(0.5, 0.7, 0.5));
  float diffuse = max(dot(normal, lightDir), 0.0);
  // Restrained specular: NO bright white or pale lavender
  float specular = pow(max(dot(reflect(-lightDir, normal), normalize(vec3(0.0, 0.0, 1.0))), 0.0), 42.0);
  float fresnel = pow(1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);

  // Subtle dark fluid shimmer
  float shimmer = fbm(p * 8.0 + t * 0.25) * 0.5 + 0.5;
  shimmer = pow(shimmer, 5.0) * uShimmer;

  // Very dark, deep-violet palette:
  // 1. Deep near-black fluid trench
  vec3 deepShade = mix(uBackground, uColor, 0.35);
  // 2. Muted deep violet body
  vec3 midShade  = mix(uColor, uAccent, 0.45);
  // 3. Restrained deep violet crest highlight (NOT white or light lavender!)
  vec3 crestHighlight = mix(uAccent, uColor * 1.15, 0.35);

  vec3 col = mix(deepShade, midShade, body);
  col = mix(col, crestHighlight, rim * 0.75);
  col += specular * 0.22 * crestHighlight;
  col += fresnel * 0.16 * uAccent;
  col += shimmer * uAccent * 0.12;

  // Soft low-intensity violet glow
  float glow = smoothstep(0.52, 0.94, fluid) * uGlow;
  col += glow * uColor * 0.15;

  // Mask against deep black background (~90% near-black base)
  float mask = smoothstep(0.05, 0.45, body + rim * 0.35);
  vec3 final = mix(uBackground, col, mask * uOpacity);

  // Vignette
  float vignette = smoothstep(1.35, 0.35, length(p));
  final = mix(uBackground, final, mix(0.85, 1.0, vignette));

  // Subtle film grain
  float grain = (hash21(uv * uResolution + t) - 0.5) * 0.014;
  final += grain;

  gl_FragColor = vec4(final, 1.0);
}
`;

const parseHex = (hex: string) => [
  parseInt(hex.slice(1, 3), 16) / 255,
  parseInt(hex.slice(3, 5), 16) / 255,
  parseInt(hex.slice(5, 7), 16) / 255,
];

const Ferrofluid = ({
  color = "#1E0E38",
  background = "#050308",
  accentColor = "#351555",
  speed = 0.16,
  scale = 0.72,
  turbulence = 0.62,
  fluidity = 0.52,
  rimWidth = 0.9,
  sharpness = 0.95,
  shimmer = 0.18,
  glow = 0.25,
  opacity = 0.78,
  mouseInteraction = true,
  mouseStrength = 0.35,
  mouseRadius = 0.35,
  paused = false,
}: FerrofluidProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return undefined;

    let renderer: Renderer;
    let gl: any;
    let raf = 0;
    let disposed = false;
    let contextLost = false;
    let pageVisible = !document.hidden;
    let reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const pointer = {
      x: 0.5,
      y: 0.5,
      tx: 0.5,
      ty: 0.5,
      active: 0,
      activeTarget: 0,
    };
    const startTime = performance.now();

    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        premultipliedAlpha: false,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      });
      gl = renderer.gl;
    } catch (error) {
      console.warn("Ferrofluid: WebGL could not be initialized.", error);
      return undefined;
    }

    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    const [cr, cg, cb] = parseHex(color);
    const [br, bg, bb] = parseHex(background);
    const [ar, ag, ab] = parseHex(accentColor);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: false,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uColor: { value: new Vec3(cr, cg, cb) },
        uBackground: { value: new Vec3(br, bg, bb) },
        uAccent: { value: new Vec3(ar, ag, ab) },
        uResolution: { value: new Float32Array([1, 1]) },
        uPointer: { value: new Float32Array([0.5, 0.5]) },
        uPointerActive: { value: 0 },
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uTurbulence: { value: turbulence },
        uFluidity: { value: fluidity },
        uRimWidth: { value: rimWidth },
        uSharpness: { value: sharpness },
        uShimmer: { value: shimmer },
        uGlow: { value: glow },
        uOpacity: { value: opacity },
        uMouseStrength: { value: mouseStrength },
        uMouseRadius: { value: mouseRadius },
        uMotion: { value: reduceMotion ? 0.2 : 1 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const renderOnce = () => {
      if (disposed || contextLost) return;
      renderer.render({ scene: mesh });
    };

    const resize = () => {
      if (disposed || contextLost) return;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      renderer.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setSize(rect.width, rect.height);
      program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;
      renderOnce();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!mouseInteraction) return;
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = 1 - (event.clientY - rect.top) / rect.height;
      pointer.activeTarget = 1;
    };

    const onPointerLeave = () => {
      pointer.activeTarget = 0;
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible && !paused && !raf) {
        raf = requestAnimationFrame(loop);
      }
      if (!pageVisible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const onReducedMotion = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      program.uniforms.uMotion.value = reduceMotion ? 0.2 : 1;
    };

    const loop = (now: number) => {
      if (disposed || contextLost || paused) return;
      const elapsed = (now - startTime) * 0.001;
      const idleX = 0.5 + Math.sin(elapsed * 0.15) * 0.14;
      const idleY = 0.5 + Math.cos(elapsed * 0.12) * 0.10;
      const targetX = pointer.activeTarget > 0 ? pointer.tx : idleX;
      const targetY = pointer.activeTarget > 0 ? pointer.ty : idleY;
      const damping = pointer.activeTarget > 0 ? 0.08 : 0.03;
      pointer.x += (targetX - pointer.x) * damping;
      pointer.y += (targetY - pointer.y) * damping;
      pointer.active += ((pointer.activeTarget > 0 ? 1 : 0.15) - pointer.active) * 0.035;

      program.uniforms.uPointer.value[0] = pointer.x;
      program.uniforms.uPointer.value[1] = pointer.y;
      program.uniforms.uPointerActive.value = pointer.active;
      program.uniforms.uTime.value = elapsed;

      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("webglcontextlost", onContextLost as EventListener);
    document.addEventListener("visibilitychange", onVisibility);
    mediaQuery?.addEventListener?.("change", onReducedMotion);

    resize();
    if (!paused && pageVisible) {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost as EventListener);
      document.removeEventListener("visibilitychange", onVisibility);
      mediaQuery?.removeEventListener?.("change", onReducedMotion);

      if (canvas.parentNode === container) container.removeChild(canvas);
      (renderer as any)?.dispose?.();
    };
  }, [
    color,
    background,
    accentColor,
    speed,
    scale,
    turbulence,
    fluidity,
    rimWidth,
    sharpness,
    shimmer,
    glow,
    opacity,
    mouseInteraction,
    mouseStrength,
    mouseRadius,
    paused,
  ]);

  return <div ref={containerRef} className="ferrofluid" aria-hidden="true" />;
};

export default Ferrofluid;
