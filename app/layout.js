import { Playfair_Display } from "next/font/google";
import { Cinzel } from "next/font/google";
import { Alegreya_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./dashboard.css";
import "./signup.css";
import "./home.css";
import "./navbar.css";
import "./footer.css";
import "./invite.css";
import "./contact.css";
import "./me.css";
import "../icofont/icofont.min.css"

import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./homeComponent/Navbar";


const aleg = Alegreya_Sans({ subsets: ["latin"], weight: ['100', '300', '400', '500', '800', '700', '900'], variable: "--font-b" })
const play = Playfair_Display({ subsets: ["latin"], weight: ['400', '500', '800', '700'], variable: "--font-p" })
const cinzel = Cinzel({ subsets: ["latin"], weight: ['400', '500', '800', '700'], variable: "--font-c" })



export const metadata = {
  title: 'Kwiva',
  description: "Welcome to QuadBox's Kwiva",
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    title: 'Kwiva',
    description: 'A learning community with rewards, stories, blogs, quizzez and laughter — and rewarding our most active users along the way.',
    images: [
      {
        url: "https://kwiva.online/kwiva_large.png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    creator: "@QuadVox",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    title: 'Kwiva',
    description: 'A learning community with rewards, stories, blogs, quizzez and laughter — and rewarding our most active users along the way.',
    images: [
      {
        url: "https://kwiva.online/kwiva_large.png"
      }
    ]
  },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* ✅ Google AdSense verification script */}
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9336754318917790"
     crossorigin="anonymous"></script>
        </head>
        <body className={`${aleg.variable} ${cinzel.variable} ${play.variable}`}>
          {children}
          <Navbar></Navbar>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=G-1FGMSYZ8PG`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1FGMSYZ8PG', {
              page_path: window.location.pathname,
            });
          `}
          </Script>
        </body>
      </html>
    </ClerkProvider>
  );
}
