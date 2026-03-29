"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import styles from "@/components/public/public-ui.module.css";

interface ParallaxSceneProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function ParallaxScene({
  children,
  className,
  strength = 18,
}: ParallaxSceneProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const state = {
      x: 0,
      y: 0,
      scroll: 0,
    };

    const updateVars = () => {
      frame = 0;
      node.style.setProperty("--parallax-x", `${state.x}px`);
      node.style.setProperty("--parallax-y", `${state.y}px`);
      node.style.setProperty("--parallax-scroll", `${state.scroll}px`);
    };

    const queueUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateVars);
      }
    };

    const isReduced = () => reducedMotion.matches || window.innerWidth < 780;

    const handleScroll = () => {
      state.scroll = isReduced()
        ? 0
        : Math.max(-strength, Math.min(strength, window.scrollY * -0.03));
      queueUpdate();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (isReduced()) {
        return;
      }

      const bounds = node.getBoundingClientRect();
      const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

      state.x = offsetX * strength;
      state.y = offsetY * strength;
      queueUpdate();
    };

    const resetPointer = () => {
      state.x = 0;
      state.y = 0;
      queueUpdate();
    };

    const handleModeChange = () => {
      if (isReduced()) {
        state.x = 0;
        state.y = 0;
      }

      handleScroll();
    };

    node.addEventListener("pointermove", handlePointerMove);
    node.addEventListener("pointerleave", resetPointer);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleModeChange);
    reducedMotion.addEventListener("change", handleModeChange);

    handleModeChange();

    return () => {
      node.removeEventListener("pointermove", handlePointerMove);
      node.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleModeChange);
      reducedMotion.removeEventListener("change", handleModeChange);

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [strength]);

  return (
    <div className={`${styles.scene} ${className ?? ""}`.trim()} ref={ref}>
      {children}
    </div>
  );
}

