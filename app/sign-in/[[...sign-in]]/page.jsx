import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { light } from '@clerk/themes'

const Page = () => {
    return (
        <div className='signInCntn'>
            <div className="left" style={{backgroundImage: "url(/login.png)"}}>
                <Link className="black_logo" href={"/"}><img src="/Kwiva1.png" alt="Kwiva logo" /></Link>

                <h2>Let&apos;s get you back into the wave</h2>
            </div>
            <div className="right">
                <div className="theNav">
                    <Link className="black_logo" href={"/"}><img src="/Kwiva1.png" alt="Kwiva logo" /></Link>
                </div>
                <SignIn
                    appearance={{
                        baseTheme: light,
                        variables: {
                            colorBackground: "#ffffff",
                            fontSize: "14px",
                            colorText: "#000000",
                            colorNeutral: "#80808026",
                            colorInputBackground: "transparent"
                        }
                    }}
                ></SignIn>
            </div>
        </div>
    )
}

export default Page
