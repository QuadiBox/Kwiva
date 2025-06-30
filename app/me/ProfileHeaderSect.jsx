import Link from "next/link";

const ProfileHeaderSect = () => {
    return (
            <div
                className={`smallHeaderSect`}
                style={{backgroundColor: '#c6c6c6'}}
            >
                <button type="button" className="headerMenuBtn">
                    <span aria-hidden></span>
                    <span aria-hidden></span>
                    <span aria-hidden></span>



                    <div className="popUpLinkCntn">
                        <Link href={'/about'}>About</Link>
                        <Link href={'/contact'}>Contact</Link>
                        <Link href={'/privacy_policy'}>Privacy policy</Link>
                        <Link href={'/terms_of_use'}>Terms of use</Link>
                    </div>
                </button>

                <Link
                    id='noTransform'
                    className="black_logo"
                    href="/"
                >
                    <img src={"/Kwiva1.png"} alt="Kwiva logo" />
                </Link>

                <button
                    type="button"
                    id='noTransform'
                    className="pageShareButton smallShareBtn"
                >
                    Share
                </button>
            </div>
    )
}

export default ProfileHeaderSect
