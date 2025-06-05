'use client'

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function HomeHeader({ headerTitle, headerSubTitle, headerImgSrc, headerText, headerImgType}) {
    const topTopRef = useRef(null);
    const headerRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [scroll2Progress, setScroll2Progress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!topTopRef.current || !headerRef.current) return;

            const topTopRect = topTopRef.current.getBoundingClientRect();
            const distanceFromTop = topTopRect.bottom; // distance from bottom of toptop to top of viewport
            const topTopHeight = topTopRef.current.clientHeight + 55; // distance from bottom of toptop to top of viewport

            const fadeEnd = 60;
            const fadeRange = topTopHeight - fadeEnd;

            const clampedMainHeaderFade = Math.min(Math.max((distanceFromTop - fadeEnd) / fadeRange, 0), 1);
            
            
            
            // Define thresholds
            const fadeStart = 105;
            const clampedProgress = Math.min(Math.max((fadeStart - distanceFromTop) / fadeStart, 0) * 1.9, 1);
            setScroll2Progress(clampedMainHeaderFade)
            setScrollProgress(clampedProgress);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // initial run

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
            <header>
                <div
                    ref={headerRef}
                    className={`smallHeaderSect ${scrollProgress >= 1 ? 'active' : ''}`}
                    style={{
                        backgroundColor: `rgba(198, 198, 198, ${scrollProgress})`, // Optional if you want to fade background too
                    }}
                >
                    <button type="button" className="headerMenuBtn">
                        <span aria-hidden></span>
                        <span aria-hidden></span>
                        <span aria-hidden></span>

                        
                        
                        <div className="popUpLinkCntn">
                            <Link href={'/about'}>About</Link>
                            <Link href={'/contact'}>Contact</Link>
                            <Link href={'/privacy_policy'}>Privacy policy</Link>
                            <Link href={'/terms_of_use'}>Terms of use</Link>
                        </div>
                    </button>

                    <Link
                        className="black_logo"
                        href="/"
                        style={{
                            opacity: scrollProgress,
                            transform: `translateY(${(1 - scrollProgress) * 20}px)`,
                        }}
                    >
                        <img src={headerImgSrc} alt="Kwiva logo" />
                    </Link>

                    <button
                        type="button"
                        className="pageShareButton smallShareBtn"
                        style={{
                            opacity: scrollProgress,
                            transform: `translateY(${(1 - scrollProgress) * 20}px)`,
                        }}
                    >
                        Share
                    </button>
                </div>

                <div className="mainHeaderSect">
                    <div
                        ref={topTopRef}
                        className="toptop"
                        style={{
                            opacity: scroll2Progress,
                            transform: `translateY(${(1 - scroll2Progress) * 30 * -1}px)`
                        }}
                    >
                        <img src={headerImgType === "story" ? "/stories_1.png" : "/blogs_1.png"} alt="Short Histories Image" />
                        <div className="text">
                            <h1>{headerTitle}</h1>
                            <p>{headerSubTitle ? headerSubTitle : "Kwiva."}</p>
                        </div>
                    </div>
                    
                    {
                        headerText && (
                            <p>
                                {headerText}
                            </p>
                        )
                    }
                </div>
            </header>
    );
}
