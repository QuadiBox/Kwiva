'use client'

import React, { useEffect, useState } from "react";
import "./LoveOverlay.css";

export default function LoveOverlay({ showBubbles }) {
    // CONFIG VARIABLES
    const ICON = "🖤"; // can replace with emoji/svg
    const ICON_COUNT = 60; // number of floating icons
    const MIN_DURATION = 6; // min rise time (seconds)
    const MAX_DURATION = 15; // max rise time (seconds)
    const MIN_FADE = 0.4; // min opacity
    const MAX_FADE = 1; // max opacity
    const MAX_BLUR = 3; // max blur px
    const MIN_SIZE = 18; // px
    const MAX_SIZE = 40; // px
    const OVERLAY_BG = "rgba(197, 197, 197, 0.1)"; // transparent dark background

    const [icons, setIcons] = useState([]);

    useEffect(() => {
        const isMobile = window.innerWidth <= 568; // adjust breakpoint as you like
        const count = isMobile ? 25 : 60;

        let arr = [];
        for (let i = 0; i < count; i++) {
            arr.push({
                id: i,
                left: Math.random() * 100, // horizontal position
                size: Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE,
                duration: Math.random() * (MAX_DURATION - MIN_DURATION) + MIN_DURATION,
                opacity: Math.random() * (MAX_FADE - MIN_FADE) + MIN_FADE,
                blur: Math.random() * MAX_BLUR,
                delay: Math.random() * 5,
            });
        }
        setIcons(arr);
    }, []);

    return (
        <div className="love-overlay" style={{ background: OVERLAY_BG, opacity: `${showBubbles ? 1 : 0}` }}>
            {/* Floating Icons */}
            {icons.map((icon) => (
                <span
                    key={icon.id}
                    className="love-icon"
                    style={{
                        left: `${icon.left}%`,
                        fontSize: `${icon.size}px`,
                        animationDuration: `${icon.duration}s`,
                        animationDelay: `${icon.delay}s`,
                        opacity: icon.opacity,
                        filter: `blur(${icon.blur}px)`,
                        color: "black",
                    }}
                >
                    {ICON}
                </span>
            ))}

            {/* Special slow Thank You heart */}
            <div
                className="love-thankyou"
                style={{ animationDuration: "25s" }}
            >
                <div className="love-thankyou-inner">
                    <span>{ICON}</span>
                    <span className="love-thankyou-text">Thank You</span>
                </div>
            </div>
            <div
                className="love-thankyou theSecond"
                style={{ animationDuration: "17s" }}
            >
                <div className="love-thankyou-inner">
                    <span>{ICON}</span>
                    <span className="love-thankyou-text">Thank You</span>
                </div>
            </div>
        </div>
    );
}
