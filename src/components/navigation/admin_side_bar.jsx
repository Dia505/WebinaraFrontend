import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth_context";

import dashboard from "../../assets/dashboard.png";
import logoutIcon from "../../assets/logout.png";
import webinar from "../../assets/webinar.png";
import "../css_files/navigation/admin_side_bar.css";

function AdminSideBar() {
    const location = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return(
        <>
            <div className="admin-side-bar-main-div">
                <p className="admin-side-bar-site-title">Webinara.</p>

                <div className="admin-side-bar-nav-btns-div">
                    <p className="main-menu-text">Main menu</p>
                    <div className="admin-side-bar-divider"></div>

                    <Link to="/dashboard">
                        <div className={location.pathname === "/dashboard" ? "admin-side-bar-selected-btn" : "admin-side-bar-btn-div"}>
                            <img className="admin-side-bar-icon" src={dashboard} />
                            <p>Dashboard</p>
                        </div>
                    </Link>

                    <Link to="/webinar">
                        <div className={location.pathname === "/webinar" ? "admin-side-bar-selected-btn" : "admin-side-bar-btn-div"}>
                            <img className="admin-side-bar-webinar-icon" src={webinar} />
                            <p>Webinars</p>
                        </div>
                    </Link>
                </div>

                <div className="admin-side-bar-logout-div">
                    <img className="admin-side-bar-icon" src={logoutIcon} />
                    <p className="admin-side-bar-logout-btn" onClick={handleLogout}>Log out</p>
                </div>
            </div>
        </>
    )
}

export default AdminSideBar;