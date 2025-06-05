import { Playfair_Display } from "next/font/google";
import { Cinzel } from "next/font/google";
import { Alegreya_Sans } from "next/font/google";
import "./globals.css";
import "./dashboard.css";
import "./signup.css";
import "./home.css";
import "./navbar.css";
import "./footer.css";
import "../icofont/icofont.min.css"

import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./homeComponent/Navbar";


const aleg = Alegreya_Sans({ subsets: ["latin"], weight: ['100', '300', '400', '500', '800', '700', '900'], variable: "--font-a" })
const play = Playfair_Display({ subsets: ["latin"], weight: ['400', '500', '800', '700'], variable: "--font-p" })
const cinzel = Cinzel({ subsets: ["latin"], weight: ['400', '500', '800', '700'], variable: "--font-c" })



export const metadata = {
  title: 'Kwiva',
  description: "Welcome to QuadBox's Kwiva",
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    title: 'Kwiva',
    description: 'Discover',
    images: [
      {
        url: "https://kwiva.online/opengraph-image.png"
      }
    ]
  },
  twitter: {
    card: "summary_image_large",
    creator: "@QuadVox",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    title: 'Kwiva',
    description: 'Discover ',
    images: [
      {
        url: "https://kwiva.online/opengraph-image.png"
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
          {/* <script
            data-ad-client="ca-pub-XXXXXXXXXXXXXXX" // <-- Replace with your own AdSense Publisher ID
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          ></script> */}
        </head>
        <body className={`${aleg.variable} ${cinzel.variable} ${play.variable}`}>
          {children}
          <Navbar></Navbar>
        </body>
      </html>
    </ClerkProvider>
  );
}
