import React from "react";

export default function ConfettiBurst() {
  const confettiPieces = Array.from({ length: 44 }, (_, index) => ({
    id: index,
    left: `${(index * 23) % 100}%`,
    delay: `${(index % 11) * 0.08}s`,
    duration: `${2.2 + (index % 5) * 0.18}s`,
    drift: `${((index % 9) - 4) * 18}px`,
    rotation: `${180 + (index % 8) * 45}deg`,
    color: ["#f4c46f", "#bf00ff", "#ecb1ff", "#eeddee"][index % 4],
  }));

  return (
    <div className="confetti-overlay" aria-hidden="true">
      {confettiPieces.map((piece) => (
        <span
          className="confetti-piece"
          key={piece.id}
          style={{
            "--confetti-left": piece.left,
            "--confetti-delay": piece.delay,
            "--confetti-duration": piece.duration,
            "--confetti-drift": piece.drift,
            "--confetti-rotation": piece.rotation,
            "--confetti-color": piece.color,
          }}
        />
      ))}
    </div>
  );
}
