import React from 'react'
import Link from 'next/link'
import ContactForm from './ContactForm'
import Footer from '../homeComponent/Footer'

export async function generateMetadata() {
    return {
        title: 'Contact Us | Kwiva',
        description: "Get in touch with Kwiva support group. We're here to help you with any inquiries or support you need.",
        openGraph: {
            type: "website",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
            title: 'Contact Kwiva',
            description: 'Reach out to us for any questions, support, or feedback. Kwiva is here for you.',
        },
        twitter: {
            card: "Contact",
            creator: "@QuadVox",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
            title: 'Contact Us | Kwiva',
            description: 'Need help or have a question? Contact Kwiva support today!',
        },
    }
}


const Page = () => {
    return (
        <div className="storyGrandCntn histories">
            <section className='contactHeader'>
                <h1>Contact Us</h1>
                <p>We&apos;d love to hear from you. Reach out via the form or the contact details below.</p>
            </section>
            <div className="preSect">
                <Link href={"/"}>Home</Link>
                <span><i className="icofont-rounded-right"></i></span>
                <p>Contact</p>
            </div>
            <ContactForm></ContactForm>
            <section className="otherContactOptions">
                <h2>Or Contact Us Directly</h2>
                <div className="contact_alterntives">
                    <div className="unitAlt">
                        <h3 className='altLabel'><i className="icofont-ui-email"></i> Email:</h3>
                        <a href="mailto:kwivaonline@gmail.com">kwivaonline@gmail.com</a>
                    </div>
                    <div className="unitAlt">
                        <h3 className='altLabel'><i className="icofont-phone"></i> Telephone:</h3>
                        <a href="tel:+2349063699656">+234-90-6369-9656</a>
                    </div>
                    <div className="unitAlt">
                        <h3 className='altLabel'><i className="icofont-ui-social-link"></i> Socials:</h3>
                        <div className="justFlex">
                            <a target='_blank' href='/'><img src="/whatsapp.svg" alt="twitter logo" /></a>
                            <a target='_blank' href='/'><img src="/telegram.svg" alt="twitter logo" /></a>
                            <a target='_blank' href='/'><img src="/x.svg" alt="twitter logo" /></a>
                            <a target='_blank' href='/'><img src="/insta.svg" alt="instagram logo" /></a>
                        </div>
                    </div>
                </div>

                <h4>We aim to reply within 24 - 48 hours.</h4>
            </section>
            <Footer></Footer>
        </div>
    )
}

export default Page
