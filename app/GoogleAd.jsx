"use client";

import { useEffect, useState, useRef } from "react";

const isAdEnabled = false; // Change to true when Google verifies your site

export default function GoogleAd({ slot = "5983480416", adKey }) {
    const adRef = useRef(null);
    const [visible, setVisible] = useState(true);

    // useEffect(() => {
    //     if (!adRef.current) return;

    //     const observer = new IntersectionObserver(
    //         ([entry]) => {
    //             if (entry.isIntersecting) {
    //                 setVisible(true);
    //                 observer.disconnect(); // load once
    //             }
    //         },
    //         { threshold: 0.15 }
    //     );

    //     observer.observe(adRef.current);
    //     return () => observer.disconnect();
    // }, []);

    useEffect(() => {
        if (
            isAdEnabled &&
            visible &&
            typeof window !== "undefined" &&
            window.adsbygoogle &&
            process.env.NODE_ENV === "production"
        ) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("Adsense push error:", e);
            }
        }
    }, [visible, adKey]);

    if (!isAdEnabled) {
        return (
            <>
                {visible && (
                    <div ref={adRef} className="temporaryAdDisplay">
                        <span></span>
                        This section will display ad.
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            {visible && (
                <ins
                    className="adsbygoogle"
                    style={{ display: "block", width: "100%", minHeight: "200px", margin: "0.1rem auto", textAlign: "center" }}
                    data-ad-client="ca-pub-9336754318917790" // Replace with your actual ad client ID
                    data-ad-slot={slot}
                    data-ad-layout="in-article"
                    data-ad-format="fluid"
                    data-full-width-responsive="true"
                    data-adtest="on"
                    ref={adRef}
                ></ins>
            )}
        </>
    );
}
