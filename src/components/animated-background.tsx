import React, { useEffect, useState } from "react";
import { usePreloader } from "./preloader";
import { useTheme } from "@/components/theme-provider";

const AnimatedBackground = () => {
  const { bypassLoading } = usePreloader();
  const { theme } = useTheme();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
    bypassLoading();
  }, [bypassLoading]);

  return (
    <div 
      className="w-full h-full overflow-hidden relative"
      style={{ 
        background: theme === "dark" 
          ? "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%)"
          : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)"
      }}
    >
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: theme === "dark" 
              ? `radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(59, 130, 246, 0.4) 100%)`
              : `radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(79, 70, 229, 0.3) 100%)`,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Gradient orbs */}
      <div 
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: theme === "dark" 
            ? "radial-gradient(circle, #8b5cf6 0%, transparent 70%)"
            : "radial-gradient(circle, #6366f1 0%, transparent 70%)",
          top: "10%",
          left: "10%",
          animation: "pulse-slow 8s ease-in-out infinite",
        }}
      />
      <div 
        className="absolute w-80 h-80 rounded-full opacity-20 blur-3xl"
        style={{
          background: theme === "dark" 
            ? "radial-gradient(circle, #3b82f6 0%, transparent 70%)"
            : "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
          bottom: "20%",
          right: "10%",
          animation: "pulse-slow 10s ease-in-out infinite reverse",
        }}
      />
      <div 
        className="absolute w-64 h-64 rounded-full opacity-15 blur-3xl"
        style={{
          background: theme === "dark" 
            ? "radial-gradient(circle, #a855f7 0%, transparent 70%)"
            : "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "pulse-slow 12s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
