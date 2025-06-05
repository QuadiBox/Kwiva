import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import NavButton from "./navButton";
import { SignedIn, SignedOut } from "@clerk/nextjs";


export default async function RootLayout({ children }) {
    const user = await currentUser();


    return (
        <div className="dashboardGrandCntn">
            
            <nav className="thedashBoardNav">

                <Link className="black_logo" href={"/"}><img src="/Kwiva1.png" alt="Kwiva logo" /></Link>
                <div className="linkList">
                    <Link className="one" href={"/dashboard__"}><i className="icofont-education"></i>All Stories</Link>
                    <Link className="two" href={"/dashboard__/new_story"}><i className="icofont-quill-pen"></i>New Story</Link>
                    <Link className="three" href={"/dashboard__/blogs"}><i className="icofont-paper"></i>Blogs</Link>
                    <Link className="four" href={"/dashboard__/new_blog"}><i className="icofont-plus"></i>New Blog</Link>
                    <Link className="five" href={"/dashboard__/functions"}><i className="icofont-tools-bag"></i>Functions</Link>
                </div>

                <SignedIn>
                    <div className="logoutBtnCntn">
                        <h3>You are logged in as <span>{user?.username ? user?.username : 'John Doe'}</span></h3>
        
                        <SignOutButton>Log out</SignOutButton>
                    </div>

                </SignedIn>

            </nav>
            <NavButton></NavButton>
                
            <main className='dashboardCntn'>
                <div className="header">
                    <div className="dashNavProfile">
                        <h3> Welcome back, {user?.username ? user?.username : 'John Doe'}</h3>
                        <img src={`${user?.imageUrl ? user?.imageUrl : "/kwivicon.png"}`} alt="profile picture" />
                    </div>
                </div>
                { children }
                
            </main>
        </div>
    );
}