"use client";

import { useMemo, useEffect, type CSSProperties } from "react";

interface TowerFallAnimationProps {
  avatar: string;
  fromFloor: number;
  onComplete: () => void;
}

const STAGE_HEIGHT = 320;
const GROUND_HEIGHT = 72;
const STEP_GAP = 4;

export function TowerFallAnimation({
  avatar,
  fromFloor,
  onComplete,
}: TowerFallAnimationProps) {
  const floors = useMemo(
    () => Array.from({ length: fromFloor }, (_, i) => fromFloor - i),
    [fromFloor]
  );

  const stepHeight = Math.min(22, Math.max(14, Math.floor(180 / Math.max(fromFloor, 1))));
  const towerHeight = fromFloor * stepHeight + Math.max(0, fromFloor - 1) * STEP_GAP;
  const topStepCenterFromBottom = GROUND_HEIGHT + towerHeight - stepHeight / 2;
  const fallStartPercent = ((STAGE_HEIGHT - topStepCenterFromBottom) / STAGE_HEIGHT) * 100;
  const fallEndPercent = ((STAGE_HEIGHT - GROUND_HEIGHT + 16) / STAGE_HEIGHT) * 100;

  useEffect(() => {
    const timer = setTimeout(onComplete, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const sceneStyle = {
    "--fall-start": `${Math.max(8, fallStartPercent)}%`,
    "--fall-end": `${Math.min(82, fallEndPercent)}%`,
    "--step-height": `${stepHeight}px`,
  } as CSSProperties;

  return (
    <div className="tower-fall-overlay" role="dialog" aria-label="Rơi khỏi tháp">
      <div className="tower-fall-backdrop" />
      <div className="tower-fall-scene">
        <p className="tower-fall-title">Ối! Trượt tay rồi!</p>
        <p className="tower-fall-countdown">
          Tầng {fromFloor} → Tầng 1
        </p>

        <div className="tower-fall-stage" style={sceneStyle}>
          <div className="tower-fall-cloud tower-fall-cloud-left">☁️</div>
          <div className="tower-fall-cloud tower-fall-cloud-right">☁️</div>

          <div className="tower-fall-building">
            {floors.map((f) => (
              <div
                key={f}
                className={`tower-fall-step ${f === fromFloor ? "tower-fall-step-active" : ""}`}
              >
                <span>Tầng {f}</span>
              </div>
            ))}
          </div>

          <div className="tower-fall-avatar">
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
