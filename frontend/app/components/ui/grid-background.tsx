import { useEffect, useRef } from "react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";

const GRID_SIZE = 20;

const GridBackground = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    let mouseX = -1000;
    let mouseY = -1000;

    const drawGrid = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const cols = Math.floor(rect.width / GRID_SIZE) + 1;
      const rows = Math.floor(rect.height / GRID_SIZE) + 1;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * GRID_SIZE;
          const y = j * GRID_SIZE;

          const dx = x - mouseX;
          const dy = y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 100;

          if (distance < maxDistance) {
            const scale = 1 - distance / maxDistance;
            const size = 1 + scale * 1;
            const opacity = 0.1 + scale * 0.4;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            const isDark = document.documentElement.classList.contains("dark");
            ctx.fillStyle = isDark
              ? `rgba(255, 255, 255, ${opacity})`
              : `rgba(100, 100, 100, ${opacity})`;
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fillStyle = document.documentElement.classList.contains("dark")
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(100, 100, 100, 0.1)";
            ctx.fill();
          }
        }
      }

      requestAnimationFrame(drawGrid);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    (container || window).addEventListener(
      "mousemove",
      handleMouseMove as EventListener
    );
    (container || window).addEventListener(
      "mouseleave",
      handleMouseLeave as EventListener
    );
    drawGrid();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      (container || window).removeEventListener(
        "mousemove",
        handleMouseMove as EventListener
      );
      (container || window).removeEventListener(
        "mouseleave",
        handleMouseLeave as EventListener
      );
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden h-full">
      <div
        ref={containerRef}
        className="relative min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden h-full"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ touchAction: "none" }}
        />
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </div>
    </div>
  );
};

export default GridBackground;
