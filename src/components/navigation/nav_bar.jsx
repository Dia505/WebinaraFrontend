import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth_context";

import "../css_files/navigation/nav_bar.css";
import UserMenuWindow from "./user_menu_window";

function NavBar() {
    const { user } = useAuth();
    const isLoggedIn = !!user;

    const location = useLocation();
    const navigate = useNavigate();

    const [isMenuWindowOpen, setIsMenuWindowOpen] = useState(false);

    return (
        <>
            <div className="nav-bar-main-div">
                <p className="nav-bar-site-title">Webinara.</p>

                <div className="nav-bar-buttons">
                    <Link to="/">
                        <p className={location.pathname === "/" ? "active-link" : ""}>Home</p>
                    </Link>
                    <Link to="/explore">
                        <p className={location.pathname === "/explore" ? "active-link" : ""}>Explore</p>
                    </Link>
                    <Link to="/contact">
                        <p className={location.pathname === "/contact" ? "active-link" : ""}>Contact</p>
                    </Link>
                </div>

                <div className="nav-bar-auth-buttons">
                    {isLoggedIn ? (
                        <img className="profile" src={user?.profilePicture}
                            onClick={() => { setIsMenuWindowOpen((prev) => !prev) }}
                        />
                    ) : (
                        <div className="login-signup-div">
                            <button onClick={() => navigate("/login")} className="nav-bar-login-btn">Log In</button>
                            <button onClick={() => navigate("/register")} className="nav-bar-signup-btn">Sign Up</button>
                        </div>
                    )}
                </div>

                {isMenuWindowOpen && (
                    <div className="user-menu-window">
                        <UserMenuWindow
                            userProfilePicture={user?.profilePicture}
                            userFullName={user?.fullName}
                            isMenuWindowOpen={isMenuWindowOpen}
                            setIsMenuWindowOpen={setIsMenuWindowOpen}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

export default NavBar;