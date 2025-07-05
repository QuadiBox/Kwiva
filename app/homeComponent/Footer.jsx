import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer>
            <div className="quicklinks">
                <h2>Quick Links:</h2>
                <div className="quickLinkWrapper">
                    <Link href={"/"}>
                        <span></span>
                        Histories
                    </Link>
                    <Link href={"/blogs"}>
                        <span></span>
                        Blogs
                    </Link>
                    <Link href={"/invite"}>
                        <span></span>
                        Invite
                    </Link>
                    <Link href={"/contact"}>
                        <span></span>
                        Contact
                    </Link>
                    <Link href={"/me"}>
                        <span></span>
                        Me
                    </Link>

                </div>
            </div>

            <div className="theLinks">
                <h2>Administration:</h2>
                <Link href={"/about"}>
                    About
                </Link>
                <Link href={"/contact"}>
                    Contact
                </Link>
            </div>
            <div className="theLinks">
                <h2>Legislation:</h2>
                <Link href={"/privacy_policy"}>
                    Privacy Policy
                </Link>
                <Link href={"/terms_of_use"}>
                    Terms of use
                </Link>
            </div>

            <div className="socials">
                <h2>Follow us on our socials</h2>
                <div className="justFlex">
                    <a target='_blank' href='https://whatsapp.com/channel/0029VbAgAp490x2mpcIAN13P'><img src="/whatsapp.svg" alt="whatsapp logo" /></a>
                    <a target='_blank' href='https://t.me/kwivaonlineng'><img src="/telegram.svg" alt="telegram logo" /></a>
                    <a target='_blank' href='https://x.com/Kwivaonline'><img src="/x.svg" alt="twitter logo" /></a>
                    <a target='_blank' href='https://www.tiktok.com/@kwivaonline'><img src="/tiktok.svg" alt="tiktok logo" /></a>
                </div>
            </div>

            <img src="/kwiva_large.png" alt="kwiva logo" />
        </footer>
    )
}

export default Footer
