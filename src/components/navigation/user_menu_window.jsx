import { useAuth } from "../../context/auth_context";
import { useNavigate } from "react-router-dom";

import bookings from "../../assets/bookings.png";
import profile from "../../assets/profile.png";
import logoutIcon from "../../assets/logout.png";
import "../css_files/navigation/user_menu_window.css";

function UserMenuWindow({ userProfilePicture, userFullName, isMenuWindowOpen, setIsMenuWindowOpen }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <div className="user-menu-window-div">
                <div className="user-main-window-user-details-div">
                    <img className="user-main-window-user-img" src={userProfilePicture} />
                    <p className="user-main-window-user-name">{userFullName}</p>
                </div>

                <div className="user-main-window-nav-btns-div">
                    <div className="user-main-window-btn-div" onClick={() => navigate("/user-profile")}>
                        <img className="user-main-window-icon" src={profile} />
                        <p className="user-main-window-btn">Profile</p>
                    </div>
                    
                    <div className="user-main-window-btn-div" onClick={() => navigate("/my-bookings")}>
                        <img className="user-main-window-icon" src={bookings} />
                        <p className="user-main-window-btn">My Bookings</p>
                    </div>
                </div>

                <div className="user-main-window-logout-div">
                    <img className="user-main-window-icon" src={logoutIcon} />
                    <p className="user-main-window-logout-btn" onClick={handleLogout}>Log out</p>
                </div>
            </div>
        </>
    )
}

export default UserMenuWindow;