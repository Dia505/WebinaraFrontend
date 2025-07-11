import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth_context";
import { jwtDecode } from "jwt-decode";

import "../css_files/navigation/nav_bar.css";

function NavBar() {
    const { authToken } = useAuth();
    const isLoggedIn = !!authToken;

    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                if (!authToken) return;

                const decoded = jwtDecode(authToken);
                const userId = decoded._id || decoded.id;

                const response = await axios.get(
                    `http://localhost:3000/api/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, [authToken]);

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
                        <img className="profile" src={
                            user?.profilePicture
                            // ? user.profilePicture
                            // : "http://localhost:3000/user-images/default_profile_img.png"
                        }
                        // onClick={() => { setIsMenuWindowOpen((prev) => !prev) }}
                        />
                    ) : (
                        <div className="login-signup-div">
                            <button onClick={() => navigate("/login")} className="nav-bar-login-btn">Log In</button>
                            <button onClick={() => navigate("/register")} className="nav-bar-signup-btn">Sign Up</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default NavBar;