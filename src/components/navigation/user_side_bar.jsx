import { Link, useLocation } from "react-router-dom";

import bookings from "../../assets/bookings.png";
import profile from "../../assets/profile.png";

import "../css_files/navigation/user_side_bar.css";

function UserSideBar() {
    const location = useLocation();

    return (
        <>
            <div className="user-side-bar-main-window">
                <Link to="/user-profile">
                    <div className={location.pathname === "/user-profile" ? "active-user-side-bar-btn" : "user-side-bar-btn-div"}>
                        <img className="user-side-bar-icon" src={profile} />
                        <p className="user-side-bar-btn">Profile</p>
                    </div>
                </Link>

                <Link to="/my-bookings">
                    <div className={location.pathname === "/my-bookings" ? "active-user-side-bar-btn" : "user-side-bar-btn-div"}>
                        <img className="user-side-bar-icon" src={bookings} />
                        <p className="user-side-bar-btn">My Bookings</p>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default UserSideBar;