"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const ProgressBarWrapper = () => {
    const [loadingBarWidth, setLoadingBarWidth] = useState(30);
    const pathname = usePathname();
    const router = useRouter();

    const startLoadingBar = () => {
        // Start the bar at 30% for instant feedback
        setLoadingBarWidth(30);
    };

    const midLoadingBar = () => {
         // Simulate further loading progression
        const timer = setTimeout(() => {
            setLoadingBarWidth(60); // Simulate mid-point
        }, 300);

        return timer;
    }

    const stopLoadingBar = () => {
        const timer = midLoadingBar();
        clearTimeout(timer);
        setLoadingBarWidth(100); // Complete the bar
        setTimeout(() => {
            setLoadingBarWidth(0); // Reset after completion
        }, 300);
    };

    useEffect(() => {
        console.log("fvck!!!!");
        stopLoadingBar()
    }, [pathname]);

    useEffect(() => {        
        const handleLinkClick = (e) => {
            // const links = document.querySelectorAll('a[href^="/"]');            
            
            // // Only handle internal links starting with "/"
            // links.forEach((link) => {
            //     if (e.target === link) {
            //         console.log("wokring fine");
            //         startLoadingBar();
            //     }
            // });

            const href = e.target.getAttribute?.("href");
            if (href && href.startsWith("/")) {
                e.preventDefault();
                startLoadingBar();
            }
        };

        // Add delegated event listener to document
        document.addEventListener("click", handleLinkClick);

        // Cleanup event listener
        return () => {
            document.removeEventListener("click", handleLinkClick);
        };
    }, [router]); // Re-run if router changes

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "4px",
                width: `${loadingBarWidth}%`,
                background: "#000000",
                zIndex: 9999,
                transition: "width 0.3s ease-in-out",
            }}
            className="custom_navibar"
        />
    );
};

export default ProgressBarWrapper;
