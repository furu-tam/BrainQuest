"use client";

import { useEffect, type CSSProperties } from "react";

interface TowerFallAnimationProps {
  avatar: string;
  fromFloor: number;
  onComplete: () => void;
}

export function TowerFallAnimation({
  avatar,
  fromFloor,
  onComplete,
}: TowerFallAnimationProps) {
  const visibleFloors = Math.min(Math.max(fromFloor, 1), 10);
  const startPercent = Math.max(12, 78 - visibleFloors * 6);

  useEffect(() => {
    const timer = setTimeout(onComplete, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="tower-fall-overlay" role="dialog" aria-label="Rơi khỏi tháp">
      <div className="tower-fall-backdrop" />
      <div className="tower-fall-scene">
        <p className="tower-fall-title">Ối! Trượt tay rồi!</p>

        <div className="tower-fall-stage">
          <div className="tower-fall-cloud tower-fall-cloud-left">☁️</div>
          <div className="tower-fall-cloud tower-fall-cloud-right">☁️</div>

          <div className="tower-fall-building">
            {Array.from({ length: visibleFloors }, (_, i) => visibleFloors - i).map((f) => (
              <div
                key={f}
                className={`tower-fall-step ${f === fromFloor ? "tower-fall-step-active" : ""}`}
              >
                <span>T{f}</span>
              </div>
            ))}
          </div>

          <div
            className="tower-fall-avatar"
            style={
              {
                "--fall-start": `${startPercent}%`,
                "--fall-end": "74%",
              } as CSSProperties
            }
          >
            <span className="tower-fall-avatar-icon">{avatar}</span>
            <span className="tower-fall-avatar-trail">💫</span>
          </div>

          <div className="tower-fall-ground">
            <span>🌱</span>
            <span className="tower-fall-ground-label">Tầng 1</span>
          </div>
        </div>

        <p className="tower-fall-sub">Bắt đầu leo lại từ đây nhé!</p>
      </div>
    </div>
  );
}
