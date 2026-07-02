import React from "react";

export default function AnimatedWaveBackground() {
  const offsets = Array.from({ length: 30 }, (_, index) => index * 1.9 - 28);
  const particles = [
    { left: "9%", size: "3px", delay: "0s", duration: "10.5s", drift: "28px" },
    { left: "22%", size: "4px", delay: "1.6s", duration: "11.8s", drift: "34px" },
    { left: "37%", size: "3px", delay: "0.9s", duration: "9.8s", drift: "24px" },
    { left: "52%", size: "5px", delay: "2.3s", duration: "12.6s", drift: "38px" },
    { left: "68%", size: "3px", delay: "1.1s", duration: "10.2s", drift: "26px" },
    { left: "81%", size: "4px", delay: "2.9s", duration: "11.4s", drift: "32px" },
    { left: "92%", size: "3px", delay: "1.8s", duration: "10.8s", drift: "22px" },
  ];

  return (
    <div className="animated-wave-bg" aria-hidden="true">
      <div className="synthwave-fade" />
      <div className="synthwave-pixels">
        {particles.map((particle, index) => (
          <span
            className="synthwave-pixel"
            key={`${particle.left}-${index}`}
            style={{
              "--pixel-left": particle.left,
              "--pixel-size": particle.size,
              "--pixel-delay": particle.delay,
              "--pixel-duration": particle.duration,
              "--pixel-drift": particle.drift,
            }}
          />
        ))}
      </div>
      <svg
        className="synthwave-wave-svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a5fff" stopOpacity="0.08" />
            <stop offset="18%" stopColor="#2d7dff" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#7b2dff" stopOpacity="0.5" />
            <stop offset="82%" stopColor="#2d7dff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1a5fff" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="wavePink" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff00bf" stopOpacity="0.08" />
            <stop offset="35%" stopColor="#ff37d0" stopOpacity="0.5" />
            <stop offset="65%" stopColor="#b100ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ff00bf" stopOpacity="0.08" />
          </linearGradient>
          <filter id="waveGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="waveHotspot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4fd8" stopOpacity="0.95" />
            <stop offset="38%" stopColor="#8f3bff" stopOpacity="0.42" />
            <stop offset="75%" stopColor="#00d9ff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#00d9ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse
          className="synthwave-hotspot"
          cx="720"
          cy="188"
          rx="174"
          ry="70"
          fill="url(#waveHotspot)"
        />

        <g className="synthwave-ribbon synthwave-ribbon-cyan">
          {offsets.map((offset) => (
            <path
              key={`cyan-${offset}`}
              className="synthwave-line"
              d="M-40,196 C76,162 168,118 278,162 C392,208 492,250 612,196 C738,136 848,102 968,152 C1092,206 1194,244 1308,190 C1380,156 1438,142 1480,148"
              style={{ transform: `translateY(${offset}px)` }}
            />
          ))}
        </g>

        <g className="synthwave-ribbon synthwave-ribbon-pink">
          {offsets.map((offset) => (
            <path
              key={`pink-${offset}`}
              className="synthwave-line"
              d="M-40,202 C88,224 186,248 304,198 C420,150 530,116 648,166 C772,220 884,246 1002,198 C1128,146 1238,112 1360,164 C1410,186 1450,194 1480,192"
              style={{ transform: `translateY(${offset * 0.8}px)` }}
            />
          ))}
        </g>

        <g className="synthwave-ribbon synthwave-ribbon-blue">
          {offsets.map((offset) => (
            <path
              key={`blue-${offset}`}
              className="synthwave-line synthwave-line-thin"
              d="M-40,206 C64,186 164,164 286,184 C420,206 534,234 662,194 C782,156 896,136 1016,174 C1144,214 1266,228 1386,196 C1422,186 1452,182 1480,184"
              style={{ transform: `translateY(${offset * 0.62}px)` }}
            />
          ))}
        </g>

        <g className="synthwave-core">
          <path
            className="synthwave-core-line synthwave-core-line-cyan"
            d="M-40,198 C84,168 182,134 302,176 C422,218 534,244 654,188 C780,128 890,108 1012,160 C1130,210 1242,236 1356,186 C1410,162 1454,152 1480,156"
          />
          <path
            className="synthwave-core-line synthwave-core-line-pink"
            d="M-40,204 C96,228 198,242 320,190 C434,142 544,120 664,170 C790,222 902,248 1024,194 C1144,142 1258,118 1378,170 C1424,190 1458,196 1480,194"
          />
          <path
            className="synthwave-beat-travel"
            d="M-40,201 C92,186 198,154 314,182 C438,212 548,222 668,180 C790,138 902,140 1026,182 C1144,222 1260,214 1378,184 C1424,172 1458,170 1480,174"
          />
        </g>
      </svg>
    </div>
  );
}
