import "../../css_files/private/user/user_profile.css";
import NavBar from "../../../components/navigation/nav_bar";

function UserProfile() {
    return(
        <>
            <div className="user-profile-main-window">
                <div className="user-profile-nav-bar-div">
                    <NavBar/>
                </div>

                <div className="user-profile-side-bar-content-div">

                </div>
            </div>
        </>
    )
}

export default UserProfile;