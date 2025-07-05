import Footer from "../homeComponent/Footer";
import Link from "next/link";

export const metadata = {
    title: 'About Kwiva | Learn, Laugh, Live',
    description:
        "Discover the vision behind Kwiva. We\'re building a learning community with stories, how-tos, and laughter — and rewarding our most active users along the way.",
    openGraph: {
        title: 'About Kwiva | Learn, Laugh, Live',
        description: 'Discover the vision behind Kwiva. We\'re building a learning community with stories, how-tos, and laughter — and rewarding our most active users along the way.',
        url: "https://kwiva.online/about",
        type: 'website',
        images: [
            {
                url: "https://kwiva.online/kwiva_large.png"
            }
        ]
    },
    twitter: {
        title: 'About Kwiva | Learn, Laugh, Live',
        creator: "@QuadVox",
        description:
            'Discover the vision behind Kwiva. We\'re building a learning community with stories, how-tos, and laughter — and rewarding our most active users along the way.',
        card: 'summary_large_image',
        url: "https://kwiva.online/about",
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
                <h1>About Kwiva</h1>
                <p>An insight into what we are, what we do | OUR MISSION and things we aim to achieve | OUR VISSION.</p>
            </header>
            <div className="preSect">
                <Link href={"/"}>Home</Link>
                <span><i className="icofont-rounded-right"></i></span>
                <p>About</p>
            </div>

            <article className="theAboutArticle">
                <p className="mb-4">
                    Kwiva is more than just a website, it&apos;s a community of thinkers,
                    doers, dreamers, and explorers. Whether you&apos;re reading about history&apos;s
                    greatest figures & occurrences in our{' '}
                    <strong className="font-semibold">Short Histories</strong> section,
                    learning something practical in our{' '}
                    <strong className="font-semibold">DIY and How-To Blogs</strong>, or
                    simply having a brain tease with our <strong>episodial Quizzez</strong>, you&apos;re part
                    of a bigger mission.
                </p>

                <p className="mb-4">
                    We believe that learning should be fun, easy to access, and rewarding; 
                    literally. That&apos;s why we&apos;ve built Kwiva as a place where your
                    participation earns you more than just knowledge. Every time you read,
                    engage, or share, you&apos;re climbing up our community leaderboard. 
                </p>

                <p className="mb-4">
                    Every two months, we celebrate our top 10 most active users by inviting
                    them to an exclusive <strong>Kwiva Community Quiz Contest</strong>. It&apos;s
                    a live event shared across our social channels, especially{' '}
                    <strong>TikTok</strong> and <strong>Twitter</strong>, and comes with
                    exciting prizes, bragging rights, and maybe even a meme or two. And every year-end, we give back to our community by showing our appreciation to the top 100 users on the ranking leaderboard.
                </p>

                <p className="mb-4">
                    Our mission is simple: <em>Learn, Laugh, Live</em>. And we want you to
                    be part of that journey.
                </p>

                <p className="mb-4">
                    Kwiva is proudly built by everyday people with a passion for knowledge,
                    community, and good vibes. If you&apos;re here, it means you belong.
                </p>

                <p className="mt-8">
                    <strong>Thank you for being here. Let&apos;s make something amazing
                        together.</strong>
                </p>

            </article>

            <Footer></Footer>

        </main>
    );
}
