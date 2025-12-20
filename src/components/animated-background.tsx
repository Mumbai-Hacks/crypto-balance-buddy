import React, { useState } from "react";
import { usePreloader } from "./preloader";
import { useTheme } from "@/components/theme-provider";
import { Skill } from "@/data/constants";
import Keyboard3D from "./keyboard-3d";

const AnimatedBackground = () => {
  const { bypassLoading } = usePreloader();
  const { theme } = useTheme();
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  React.useEffect(() => {
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
      {/* 3D Keyboard */}
      <div className="absolute inset-0">
        <Keyboard3D onSkillHover={setHoveredSkill} />
      </div>

      {/* Skill info overlay */}
      {hoveredSkill && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
          <div 
            className="px-6 py-4 rounded-xl backdrop-blur-md shadow-2xl border border-white/10"
            style={{ 
              background: theme === "dark" 
                ? "rgba(26, 26, 46, 0.9)" 
                : "rgba(255, 255, 255, 0.9)"
            }}
          >
            <h3 
              className="text-xl font-bold mb-1"
              style={{ color: hoveredSkill.color }}
            >
              {hoveredSkill.label}
            </h3>
            <p className={`text-sm max-w-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              {hoveredSkill.shortDescription}
            </p>
          </div>
        </div>
      )}

      {/* Gradient orbs */}
      <div 
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
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
        className="absolute w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: theme === "dark" 
            ? "radial-gradient(circle, #3b82f6 0%, transparent 70%)"
            : "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
          bottom: "20%",
          right: "10%",
          animation: "pulse-slow 10s ease-in-out infinite reverse",
        }}
      />

      <style>{`
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
