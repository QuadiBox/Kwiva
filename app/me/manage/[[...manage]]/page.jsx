import Link from 'next/link'
import { light } from '@clerk/themes'
import { UserProfile } from '@clerk/nextjs'

const Page = () => {
    return (
        <main className="storyGrandCntn me">
            <header className='contactHeader'>
                <h1 className="text-3xl font-bold">Manage Your Profile</h1>
            </header>
            <div className="preSect">
                <Link href={"/"}>Home</Link>
                <span><i className="icofont-rounded-right"></i></span>
                <Link href={"/me"}>Me</Link>
                <span><i className="icofont-rounded-right"></i></span>
                <p>Manage Profile</p>
            </div>
            <div className="theManageCntn">
                <UserProfile
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
                ></UserProfile>
            </div>
        </main>
    )
}

export default Page