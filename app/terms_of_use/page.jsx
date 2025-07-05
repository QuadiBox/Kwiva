import Footer from "../homeComponent/Footer";
import Link from "next/link";


export const metadata = {
    title: 'Terms of Use | Kwiva',
    description:
        'Read our detailed Terms of Use to understand the rights, responsibilities, and acceptable behavior when using Kwiva.',
    openGraph: {
        title: 'Terms of Use | Kwiva',
        description: 'Read our detailed Terms of Use to understand the rights, responsibilities, and acceptable behavior when using Kwiva',
        url: "https://kwiva.online/terms_of_use",
        type: 'website',
        images: [
            {
                url: "https://kwiva.online/kwiva_large.png"
            }
        ]
    },
    twitter: {
        title: 'Terms of Use | Kwiva',
        description:
            'Read our detailed Terms of Use to understand the rights, responsibilities, and acceptable behavior when using Kwiva',
        card: 'summary_large_image',
        url: "https://kwiva.online/terms_of_use",
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
                <h1 className="text-3xl font-bold">Terms of Use</h1>
                <p>
                    Welcome to Kwiva. These Terms of Use (“Terms”) govern your use of our website, products, and services. By accessing or using Kwiva, you agree to be bound by these Terms and our Privacy Policy.
                </p>
            </header>
            <div className="preSect">
                <Link href={"/"}>Home</Link>
                <span><i className="icofont-rounded-right"></i></span>
                <p>Terms of use</p>
            </div>

            <main className="theAboutArticle">
                <section>
                    <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
                    <p>
                        By using our platform, you confirm that you accept these Terms and agree to comply with them. If you do not
                        agree to these Terms, you must not use Kwiva.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">2. Description of Services</h2>
                    <p>
                        Kwiva is a digital content platform that delivers historical storytelling, practical how-to articles, and
                        community-driven engagement experiences, including referral-based rewards and public competitions.
                    </p>
                    <p>
                        We use technologies including Next.js for development, Firebase Firestore for data storage, Clerk for
                        authentication, and Nodemailer for email communication.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">3. Eligibility</h2>
                    <p>
                        You must be at least 13 years of age to use Kwiva. If you are under 18, you must have your parent or
                        guardian&apos;s permission to use our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">4. Account Registration and Security</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account credentials and for all activities
                        that occur under your account. We use Clerk to manage authentication and session handling.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">5. User Content</h2>
                    <p>
                        You may post or submit content to Kwiva, including but not limited to story contributions, comments, and
                        referrals. You grant Kwiva a non-exclusive, worldwide, royalty-free license to use, modify, and display your
                        content solely for the purpose of operating and promoting the platform.
                    </p>
                    <p>
                        You are solely responsible for the legality and accuracy of any content you contribute.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
                    <p>
                        All intellectual property on the platform, including articles, graphics, design elements, and trademarks, are
                        owned by Kwiva or our licensors. You may not copy, reproduce, distribute, or create derivative works from any
                        part of Kwiva without express permission.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">7. Referral Program and Points System</h2>
                    <p>
                        Kwiva offers a referral program that rewards users with points for referring new users. Points may be used to
                        participate in platform activities, promotions, or competitions.
                    </p>
                    <ul className="list-disc list-inside">
                        <li>Each successful referral earns the referrer 20 points.</li>
                        <li>Referrals are tracked via unique referral links using query parameters.</li>
                        <li>Kwiva reserves the right to revoke points for fraudulent or abusive behavior.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">8. User Conduct</h2>
                    <p>Users agree not to:</p>
                    <ul className="list-disc list-inside">
                        {/* <li>Post abusive, harmful, or misleading content</li> */}
                        <li>Infringe upon intellectual property or privacy rights</li>
                        <li>Use Kwiva for unlawful purposes</li>
                        <li>Attempt to gain unauthorized access to other user accounts or backend systems</li>
                    </ul>
                    <p>
                        We reserve the right to suspend or terminate accounts violating these rules.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">9. Termination</h2>
                    <p>
                        We may suspend or terminate your access to Kwiva at any time for any reason, including but not limited to
                        violations of these Terms or applicable laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">10. Disclaimers</h2>
                    <p>
                        Kwiva is provided “as is” and “as available.” We do not guarantee that our services will always be secure or
                        free from bugs or errors.
                    </p>
                    <p>
                        We are not liable for any loss or damage arising from your use of our platform, including user-generated
                        content.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">11. Limitation of Liability</h2>
                    <p>
                        Kwiva, its affiliates, partners, and service providers shall not be liable for any indirect, incidental,
                        special, consequential or punitive damages resulting from your use of the site or services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">12. Modification of Terms</h2>
                    <p>
                        We reserve the right to modify these Terms at any time. Changes will be posted on this page. Continued use of
                        Kwiva constitutes acceptance of the updated Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">13. Governing Law</h2>
                    <p>
                        These Terms shall be governed and interpreted according to the laws of Nigeria, without regard to its conflict
                        of law principles.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">14. Contact Information</h2>
                    <p>
                        If you have any questions or concerns about these Terms, please contact us at:{' '}
                        <Link href={"/contact"}>Contact us</Link> or simply send a direct mail to <a href="mailto:kwivaonline@gmail.com">kwivaonline@gmail.com</a>.
                    </p>
                </section>

            </main>

            <Footer></Footer>

        </main>
    );
}
