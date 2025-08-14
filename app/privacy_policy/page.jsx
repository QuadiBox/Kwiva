import Footer from "../homeComponent/Footer";
import Link from "next/link";


export const metadata = {
    title: 'Privacy Policy | Kwiva',
    description:
        'Review how Kwiva collects, uses, and protects your data. Learn about your rights under the GDPR and our commitment to privacy.',
    openGraph: {
        title: 'Privacy Policy | Kwiva',
        description: 'Review how Kwiva collects, uses, and protects your data. Learn about your rights under the GDPR and our commitment to privacy.',
        url: 'https://kwiva.online/privacy_policy',
        type: 'website',
        images: [
            {
                url: "https://kwiva.online/kwiva_large.png"
            }
        ]
    },
    twitter: {
        title: 'Privacy Policy | Kwiva',
        description:
            'Review how Kwiva collects, uses, and protects your data. Learn about your rights under the GDPR and our commitment to privacy.',
        card: 'summary_large_image',
        url: 'https://kwiva.online/privacy_policy',
        images: [
            {
                url: "https://kwiva.online/kwiva_large.png"
            }
        ]
    },
};


export default function Page() {
    return (
        <main className="storyGrandCntn histories">
            <header className='contactHeader'>
                <h1 className="text-3xl font-bold">Privacy Policy</h1>
                <p>
                    At Kwiva, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your
                    personal information when you use our website and services.
                </p>
            </header>
            <div className="preSect">
                <Link href={"/"}>Home</Link>
                <span><i className="icofont-rounded-right"></i></span>
                <p>Privacy policy</p>
            </div>

            <article className="theAboutArticle">
                <section>
                    <h2 className="text-xl font-semibold">Information We Collect</h2>
                    <p>
                        When you create an account with us using Clerk, we collect information such as your name, email address, and
                        authentication metadata. We also track interactions with our content (e.g., article views, referrals) to
                        give points and improve our services.
                    </p>
                    <p>
                        Additionally, if you contact us using the form on our Contact page, we collect your name, subject, and message
                        so we can respond accordingly.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">How We Use Your Information</h2>
                    <ul className="list-disc list-inside">
                        <li>To authenticate users and manage accounts (via Clerk)</li>
                        <li>To improve user experience and engagement (via Firestore-based analytics and gamification)</li>
                        <li>To send responses to contact form submissions (via Nodemailer to Gmail)</li>
                        <li>To prevent abuse and monitor platform integrity</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">Use of Cookies, Cache and Local Storage</h2>
                    <p>
                        We use browser localStorage to store non-sensitive session data, such as user interaction progress and
                        referral tracking. This helps reduce server load and optimize performance. You may clear your browser storage
                        at any time. Cookies may also be used by third-party services we integrate with (like Clerk). We use server-based caching system (CDN) to temporarily save some page&apos;s HTML content for fast page loads and increased performance.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">Third-Party Services</h2>
                    <p>
                        We use several trusted third-party services to operate Kwiva:
                    </p>
                    <ul className="list-disc list-inside">
                        <li><strong>Clerk:</strong> Authentication and user session management</li>
                        <li><strong>Firebase Firestore:</strong> Database for storing user data, stories, and referral analytics</li>
                        <li><strong>Vercel:</strong> Hosting and edge performance</li>
                        <li><strong>Nodemailer:</strong> For sending contact form submissions to our Gmail inbox</li>
                    </ul>
                    <p>
                        These services may store or process your data outside your country, including in the United States.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">GDPR Compliance</h2>
                    <p>
                        If you are located in the European Union (EU) or European Economic Area (EEA), you have certain rights under
                        the General Data Protection Regulation (GDPR), including:
                    </p>
                    <ul className="list-disc list-inside">
                        <li>The right to access the personal data we hold about you</li>
                        <li>The right to correct or delete your personal data</li>
                        <li>The right to withdraw consent at any time</li>
                        <li>The right to object to our use and processing of your data</li>
                        <li>The right to data portability</li>
                    </ul>
                    <p>
                        You can exercise any of these rights by contacting us at <Link href={"/contact"}>Contact us</Link> or simply send a mail to <a href="mailto:kwivaonline@gmail.com">kwivaonline@gmail.com</a>.
                    </p>
                    <p>
                        We process your data under the legal bases of your consent, contract fulfillment (e.g., account creation), and
                        our legitimate interest in providing and improving our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">Data Security</h2>
                    <p>
                        We take reasonable precautions to protect your information. Our database and infrastructure are secured using
                        modern encryption, and we never share your personal information without your consent unless required by law.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">Children&apos;s Privacy</h2>
                    <p>
                        Kwiva is not intended for users under the age of 13. We do not knowingly collect data from children. If you
                        believe a child has provided personal information, please contact us so we can delete it.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">Policy Updates</h2>
                    <p>
                        We may update this Privacy Policy from time to time. Changes will be posted here, and your continued use of
                        Kwiva constitutes agreement with the updated terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">Contact Us</h2>
                    <p>
                        For questions about this policy or to exercise your data rights, reach us at <Link href={"/contact"}>Contact us</Link> or simply send a direct mail to <a href="mailto:kwivaonline@gmail.com">kwivaonline@gmail.com</a>.
                    </p>
                </section>

            </article>

            <Footer></Footer>

        </main>
    );
}
