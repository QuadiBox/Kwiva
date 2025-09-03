'use client';

import { useEffect, useRef, useState } from 'react';
// import styles from './DoughnutChart.module.css';

export default function DoughnutChart({
    raised = 7500,
    target = 130000,
    size = 200,  // in pixels, max size
    strokeWidth = 20, // ring thickness
    color = '#00aaff',
    bgColor = '#e0e0e0',
    animationDuration = 1000,  // in ms
}) {
    const capRef = useRef(null);
    const chartRef = useRef(null);

    const [animatedProgress, setAnimatedProgress] = useState(0);
    const [animatedRaised, setAnimatedRaised] = useState(0);
    const progress = Math.min((raised / target) * 100, 100);

    // Animate progress arc and cap
    useEffect(() => {
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;

            const progressValue = Math.min((elapsed / animationDuration) * progress, progress);
            const raisedValue = Math.min((elapsed / animationDuration) * raised, raised);

            setAnimatedProgress(progressValue);
            setAnimatedRaised(raisedValue);

            if (elapsed < animationDuration) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [progress, raised, animationDuration]);

    // Update cap position and conic gradient
    useEffect(() => {
        const angle = (animatedProgress / 100) * 360;
        const radius = size / 2;
        const center = radius;
        const radians = (angle - 90) * (Math.PI / 180);

        const x = center + radius * Math.cos(radians);
        const y = center + radius * Math.sin(radians);

        if (capRef.current) {
            capRef.current.style.left = `${x}px`;
            capRef.current.style.top = `${y}px`;
            capRef.current.style.display = animatedProgress > 0 ? 'block' : 'none';
            capRef.current.style.backgroundColor = color;
        }

        if (chartRef.current) {
            chartRef.current.style.background = `conic-gradient(${color} ${animatedProgress}%, ${bgColor} ${animatedProgress}%)`;
        }
    }, [animatedProgress, size, color, bgColor]);

    const innerSize = size - strokeWidth * 2;

    // Format amounts with commas and fixed decimals
    const formattedRaised = Math.floor(animatedRaised).toLocaleString();
    const formattedTarget = target.toLocaleString();

    return (
        <div className={"container"} style={{ maxWidth: size }}>
            <div
                className={"wrapper"}
                style={{ paddingTop: '100%' }} // 1:1 aspect ratio for responsiveness
            >
                <div ref={chartRef} className={"chart"}>
                    {/* <div ref={capRef} className={"cap"} style={{ width: strokeWidth + 10, height: strokeWidth + 10  }} /> */}

                    <div
                        className={"inner"}
                        style={{
                            top: strokeWidth,
                            left: strokeWidth,
                            width: innerSize,
                            height: innerSize,
                        }}
                    >
                        <span className={"percentage"}>{`${Math.round(animatedProgress)}%`}</span>
                    </div>
                </div>
            </div>

            <div className={"labels"}>
                <div className={"amounts"} aria-live="polite" tabIndex={0} aria-label={`Amount raised: $${formattedRaised}`}>
                    <strong
                        className={"tooltipRaised"}
                        aria-describedby="raisedTooltip"
                    >
                        &#8358;{formattedRaised}
                    </strong>
                    <span className={"tooltipText"}>Raised Amount</span>
                    raised of
                    <strong className={"tooltipTarget"}>&#8358;{formattedTarget}</strong>
                    <span className={"tooltipText"}>Target Amount</span>

                </div>

                <div className={"progressText"} aria-live="polite">
                    {`${formattedRaised} raised of ${formattedTarget}`}
                </div>
            </div>
        </div>
    );
}
