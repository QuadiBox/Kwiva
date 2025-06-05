'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    // Helper to detect article page
    const isArticlePage = (path) => path.startsWith('/s_') || path.startsWith('/blogs/b_');


    // const [bottomPadding, setBottomPadding] = useState(0);

    // useEffect(() => {
    //     const updatePadding = () => {
    //         if (window.innerWidth < 608) { // Only apply on mobile
    //             const newPadding = window.innerHeight - document.documentElement.clientHeight;
    //             setBottomPadding(newPadding);
    //         } else {
    //             setBottomPadding(90); // Reset on larger screens
    //         }
    //     };

    //     window.addEventListener("resize", updatePadding);
    //     updatePadding(); // Initial call

    //     return () => window.removeEventListener("resize", updatePadding);
    // }, []);

    useEffect(() => {
        console.log('firing!!!');
        
        const handleClick = (e) => {
            console.log('works fine');
            
            const buttons = document.querySelectorAll('button');

            // Remove .focus from all buttons
            buttons.forEach((btn) => btn.classList.remove('focus'));

            // If a button was clicked, add .focus
            if (e.target.closest('button')) {
                e.target.closest('button').classList.add('focus');
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);


    useEffect(() => {
        const lastReadingComplete = localStorage.getItem('lastPageReadingComplete');
        const hasJustNavigatedBack = localStorage.getItem('hasJustNavigatedBack');

        if (hasJustNavigatedBack === 'true') {
            // If skip flag is present, remove it and skip modal display
            localStorage.removeItem('hasJustNavigatedBack');
            return;
        }

        if (lastReadingComplete !== null && lastReadingComplete === 'false') {
            setShowModal(true);
        }

        localStorage.removeItem('lastPageReadingComplete');
    }, [pathname]);

    const handleStay = () => {
        setShowModal(false);
    };

    const handleBack = () => {
        localStorage.setItem('hasJustNavigatedBack', 'true');
        setShowModal(false);
        router.back();
    };

    return (
        <div className={`sticky-bar ${openMenu ? 'opened' : "closed"}`}>
            <div className="desktopDisplay">
                <button type="button" data-label={`${openMenu ? "Close" : "Menu"}`} className='menuToggleBtn' onClick={() => { setOpenMenu(prev => !prev) }}>
                    <i className="icofont-plus"></i>
                </button>
                <Link href={"/"} data-label="Histories"><i className="icofont-education"></i></Link>
                <Link href={"/blogs"} data-label="Blogs"><i className="icofont-paper"></i></Link>
                <Link href={"/meme_bank"} data-label="Meme Bank"><i className="icofont-halloween-pumpkin"></i></Link>
                <Link href={"/invite"} data-label="Invite"><i className="icofont-users-alt-5"></i></Link>
                <Link href={"/me"} data-label="Me"><i className="icofont-ui-user"></i></Link>
            </div>

            <div className="mobileDisplay">
                <Link href={"/"} className="unitNavLink _h">
                    <i className="icofont-education"></i>
                    <span>Histories</span>
                </Link>
                <Link href={"/blogs"} className="unitNavLink _hh" data-label="Blogs">
                    <i className="icofont-paper"></i>
                    <span>Blogs</span>
                </Link>
                <Link href={"/meme_bank"} className="unitNavLink _hhh" data-label="Meme Bank">
                    <i className="icofont-halloween-pumpkin"></i>
                    <span>Meme Bank</span>
                </Link>
                <Link href={"/invite"} className="unitNavLink _hhhh" data-label="Invite">
                    <i className="icofont-users-alt-5"></i>
                    <span>Invite</span>
                </Link>
                <Link href={"/me"} className="unitNavLink _hhhhh" data-label="Me">
                    <i className="icofont-ui-user"></i>
                    <span>Me</span>
                </Link>
            </div>

            {showModal && (
                <div className={`modal-overlay ${showModal ? "noOverflow" : ""} `}>
                    <div className="modal-content">
                        {/* {!articleFullyRead ? (
                            <b>You didn&apos;t bother finishing the story, you just might like the rest of it.</b>
                        ) : (
                        )} */}
                        <b>Not so fast my friend!, you should try reading the article again but PATIENTLY this time.</b>
                        <div className="modal-buttons">
                            <button onClick={handleBack}>Go Back</button>
                            <button onClick={handleStay}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar
