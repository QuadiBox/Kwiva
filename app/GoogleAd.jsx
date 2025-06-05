"use client";

import React from "react";

const isAdEnabled = false; // Change to true when Google verifies your site

export default function GoogleAd() {
    if (!isAdEnabled) {
        return (
            <div className="temporaryAdDisplay">
                <span></span>
                This section will display ad.
            </div>
        );
    }

    return (
        // Example Google AdSense snippet (adjust according to your actual ad slot)
        <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"
        ></ins>
    );
}
