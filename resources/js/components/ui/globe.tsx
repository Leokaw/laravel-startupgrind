import * as React from "react";
import createGlobe from "cobe";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface GlobeMarker {
  id: string;
  location: [number, number];
  label: string;
}

// Curated list: Reduced US, Canada, and Europe to major hubs to prevent overcrowding.
const customMarkers: GlobeMarker[] = [
  // --- United States (Major Hubs Only) ---
  { id: "newyork", location: [40.7128, -74.0060], label: "New York" },
  { id: "sanfrancisco", location: [37.7749, -122.4194], label: "San Francisco" },
  { id: "losangeles", location: [34.0522, -118.2437], label: "Los Angeles" },
  { id: "chicago", location: [41.8781, -87.6298], label: "Chicago" },
  { id: "austin", location: [30.2672, -97.7431], label: "Austin" },
  { id: "seattle", location: [47.6062, -122.3321], label: "Seattle" },
  { id: "miami", location: [25.7617, -80.1918], label: "Miami" },
  { id: "boston", location: [42.3601, -71.0589], label: "Boston" },

  // --- Canada (Major Hubs Only) ---
  { id: "toronto", location: [43.6532, -79.3832], label: "Toronto" },
  { id: "vancouver", location: [49.2827, -123.1207], label: "Vancouver" },

  // --- Latin & South America ---
  { id: "aguascalientes", location: [21.8853, -102.2916], label: "Aguascalientes" },
  { id: "asuncion", location: [-25.2637, -57.5759], label: "Asunción" },
  { id: "bogota", location: [4.7110, -74.0721], label: "Bogotá" },
  { id: "brasilia", location: [-15.7975, -47.8919], label: "Brasília" },
  { id: "buenosaires", location: [-34.6037, -58.3816], label: "Buenos Aires" },
  { id: "guadalajara", location: [20.6597, -103.3496], label: "Guadalajara" },
  { id: "lima", location: [-12.0464, -77.0428], label: "Lima" },
  { id: "mexicocity", location: [19.4326, -99.1332], label: "Mexico City" },
  { id: "monterrey", location: [25.6866, -100.3161], label: "Monterrey" },
  { id: "montevideo", location: [-34.9011, -56.1645], label: "Montevideo" },
  { id: "panamacity", location: [8.9824, -79.5199], label: "Panama City" },
  { id: "quito", location: [-0.1807, -78.4678], label: "Quito" },
  { id: "riodejaneiro", location: [-22.9068, -43.1729], label: "Rio de Janeiro" },
  { id: "sanjosecr", location: [9.9281, -84.0907], label: "San José" },
  { id: "sanjuan", location: [18.4655, -66.1057], label: "San Juan" },
  { id: "santiago", location: [-33.4489, -70.6693], label: "Santiago" },
  { id: "saopaulo", location: [-23.5505, -46.6333], label: "São Paulo" },

  // --- Europe (Major Hubs Only) ---
  { id: "london", location: [51.5074, -0.1278], label: "London" },
  { id: "paris", location: [48.8566, 2.3522], label: "Paris" },
  { id: "berlin", location: [52.5200, 13.4050], label: "Berlin" },
  { id: "amsterdam", location: [52.3676, 4.9041], label: "Amsterdam" },
  { id: "stockholm", location: [59.3293, 18.0686], label: "Stockholm" },
  { id: "dublin", location: [53.3498, -6.2603], label: "Dublin" },
  { id: "madrid", location: [40.4168, -3.7038], label: "Madrid" },
  { id: "barcelona", location: [41.3874, 2.1686], label: "Barcelona" },
  { id: "rome", location: [41.9028, 12.4964], label: "Rome" },
  { id: "milan", location: [45.4642, 9.1900], label: "Milan" },
  { id: "warsaw", location: [52.2297, 21.0122], label: "Warsaw" },
  { id: "lisbon", location: [38.7223, -9.1393], label: "Lisbon" },
  { id: "copenhagen", location: [55.6761, 12.5683], label: "Copenhagen" },
  { id: "vienna", location: [48.2082, 16.3738], label: "Vienna" },

  // --- Middle East ---
  { id: "dubai", location: [25.2048, 55.2708], label: "Dubai" },
  { id: "riyadh", location: [24.7136, 46.6753], label: "Riyadh" },
  { id: "telaviv", location: [32.0853, 34.7818], label: "Tel Aviv" },
  { id: "cairo", location: [30.0444, 31.2357], label: "Cairo" },
  { id: "amman", location: [31.9454, 35.9284], label: "Amman" },
  { id: "doha", location: [25.2854, 51.5310], label: "Doha" },
  { id: "tehran", location: [35.6892, 51.3890], label: "Tehran" },
  { id: "istanbul", location: [41.0082, 28.9784], label: "Istanbul" },

  // --- Africa ---
  { id: "capetown", location: [-33.9249, 18.4241], label: "Cape Town" },
  { id: "johannesburg", location: [-26.2041, 28.0473], label: "Johannesburg" },
  { id: "nairobi", location: [-1.2921, 36.8219], label: "Nairobi" },
  { id: "lagos", location: [6.5244, 3.3792], label: "Lagos" },
  { id: "accra", location: [5.6037, -0.1870], label: "Accra" },
  { id: "casablanca", location: [33.5731, -7.5898], label: "Casablanca" },
  { id: "addisababa", location: [9.0320, 38.7469], label: "Addis Ababa" },
  { id: "dakar", location: [14.7167, -17.4677], label: "Dakar" },
  { id: "kampala", location: [0.3476, 32.5825], label: "Kampala" },
  { id: "kinshasa", location: [-4.4419, 15.2663], label: "Kinshasa" },

  // --- Asia & Oceania ---
  { id: "tokyo", location: [35.6762, 139.6503], label: "Tokyo" },
  { id: "seoul", location: [37.5665, 126.9780], label: "Seoul" },
  { id: "beijing", location: [39.9042, 116.4074], label: "Beijing" },
  { id: "shanghai", location: [31.2304, 121.4737], label: "Shanghai" },
  { id: "hongkong", location: [22.3193, 114.1694], label: "Hong Kong" },
  { id: "singapore", location: [1.3521, 103.8198], label: "Singapore" },
  { id: "bangkok", location: [13.7563, 100.5018], label: "Bangkok" },
  { id: "jakarta", location: [-6.2088, 106.8456], label: "Jakarta" },
  { id: "manila", location: [14.5995, 120.9842], label: "Manila" },
  { id: "delhi", location: [28.7041, 77.1025], label: "Delhi" },
  { id: "mumbai", location: [19.0760, 72.8777], label: "Mumbai" },
  { id: "bangalore", location: [12.9716, 77.5946], label: "Bangalore" },
  { id: "karachi", location: [24.8607, 67.0011], label: "Karachi" },
  { id: "dhaka", location: [23.8103, 90.4125], label: "Dhaka" },
  { id: "sydney", location: [-33.8688, 151.2093], label: "Sydney" },
  { id: "melbourne", location: [-37.8136, 144.9631], label: "Melbourne" },
  { id: "auckland", location: [-36.8485, 174.7633], label: "Auckland" },
];

function anchorLabelStyle(id: string): React.CSSProperties {
  const visible = `--cobe-visible-${id}`;
  const anchor = `--cobe-${id}`;
  return {
    position: "absolute",
    bottom: "anchor(top)",
    filter: `blur(calc((1 - var(${visible}, 0)) * 8px))`,
    left: "anchor(center)",
    opacity: `var(${visible}, 0)`,
    positionAnchor: anchor,
    transform: "translate(-50%, -4px)",
    transition: "opacity 0.3s ease, filter 0.3s ease",
    pointerEvents: "none",
    zIndex: 20,
  } as React.CSSProperties;
}

export function Globe({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(rootRef, { once: false, margin: "120px" });
  const shouldReduceMotion = useReducedMotion();
  
  const phiAutoRef = React.useRef(0);
  const pointerInteracting = React.useRef<{ x: number; y: number } | null>(null);
  const dragOffset = React.useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = React.useRef(0);
  const thetaOffsetRef = React.useRef(0);
  const isPausedRef = React.useRef(false);
  
  const globeSize = 520;
  const bufferSize = globeSize * 2;

  const handlePointerDown = React.useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerMove = React.useCallback((e: PointerEvent) => {
    if (pointerInteracting.current === null) return;
    const deltaX = e.clientX - pointerInteracting.current.x;
    const deltaY = e.clientY - pointerInteracting.current.y;
    dragOffset.current = { phi: deltaX / 300, theta: deltaY / 1000 };
  }, []);

  const handlePointerUp = React.useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  React.useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  React.useEffect(() => {
    if (!(canvasRef.current && isInView)) return;

    const canvas = canvasRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: bufferSize,
      height: bufferSize,
      phi: phiAutoRef.current + phiOffsetRef.current,
      theta: 0.2 + thetaOffsetRef.current,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 0.95, 0.95], 
      markerColor: [0.9, 0.2, 0.2], 
      glowColor: [0.9, 0.2, 0.2], 
      scale: 1,
      offset: [0, 0],
      opacity: 0.8,
      markers: customMarkers.map(m => ({ id: m.id, location: m.location, size: 0.025 })),
      arcs: [],
    } as never) as unknown as { update: (state: Record<string, unknown>) => void, destroy: () => void };

    let raf = 0;
    const tick = () => {
      if (!isPausedRef.current && !shouldReduceMotion) {
        phiAutoRef.current += 0.003;
      }
      
      const thetaMin = -0.4;
      const thetaMax = 0.4;
      if (thetaOffsetRef.current < thetaMin) {
        thetaOffsetRef.current += (thetaMin - thetaOffsetRef.current) * 0.1;
      } else if (thetaOffsetRef.current > thetaMax) {
        thetaOffsetRef.current += (thetaMax - thetaOffsetRef.current) * 0.1;
      }

      globe.update({
        phi: phiAutoRef.current + phiOffsetRef.current + dragOffset.current.phi,
        theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        width: bufferSize,
        height: bufferSize,
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
    };
  }, [isInView, bufferSize, shouldReduceMotion]);

  return (
    <div ref={rootRef} className={cn("relative aspect-square w-full max-w-[520px]", className)}>
      <motion.div
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0.85, scale: 0.98 }}
        className="relative mx-auto aspect-square w-full"
        initial={{ opacity: 0, scale: 0.96 }}
        style={{ maxWidth: globeSize, height: globeSize, width: globeSize }}
        transition={{ duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <canvas
          className="relative z-10 block size-full cursor-grab touch-none"
          height={bufferSize}
          onPointerDown={handlePointerDown}
          ref={canvasRef}
          style={{ contain: "layout paint size" }}
          width={bufferSize}
        />

        {customMarkers.map((marker) => (
          <div
            key={marker.id}
            style={anchorLabelStyle(marker.id)}
            className="whitespace-nowrap rounded-full border border-primary/20 bg-background/80 px-1.5 py-0.5 font-mono text-[8px] font-medium tracking-tight text-foreground shadow-sm backdrop-blur-md dark:border-primary/50"
          >
            {marker.label}
          </div>
        ))}
      </motion.div>
    </div>
  );
}