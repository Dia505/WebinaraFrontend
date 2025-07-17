import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/auth_context";

import edit from "../../../assets/edit.png";
import "../../css_files/private/user/user_profile.css";
import NavBar from "../../../components/navigation/nav_bar";
import UserSideBar from "../../../components/navigation/user_side_bar";
import UserProfileEditForm from "../../../components/user_profile/user_profile_edit_form";

function UserProfile() {
    const { authToken } = useAuth();
    const [user, setUser] = useState(null);
    const [showEditProfileForm, setShowEditProfileForm] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                if (!authToken) return;

                const decoded = jwtDecode(authToken);
                const userId = decoded._id || decoded.id;

                const response = await axios.get(
                    `https://localhost:443/api/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                        withCredentials: true
                    }
                );

                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, [authToken]);

    return(
        <>
            <div className="user-profile-main-window">
                <div className="user-profile-nav-bar-div">
                    <NavBar/>
                </div>

                <div className="user-profile-side-bar-content-div">
                    <UserSideBar/>

                    {showEditProfileForm ? (
                        <UserProfileEditForm closeForm={() => setShowEditProfileForm(false)} />
                    ) : (
                        <div className="user-profile-div">
                            <div className="user-profile-title-btn-div">
                                <p className="user-profile-title">Profile</p>
                                <img className="user-profile-edit-btn" src={edit} onClick={() => setShowEditProfileForm(true)} />
                            </div>

                            <div className="user-profile-img-details-div">
                                <img className="user-profile-img" src={user?.profilePicture} />

                                <div className="user-profile-details-div">
                                    <div className="user-profile-name-number-div">
                                        <div className="user-profile-detail-div">
                                            <p className="user-profile-detail-title">Name</p>
                                            <p className="user-profile-detail">{user?.fullName}</p>
                                        </div>

                                        <div className="user-profile-detail-div">
                                            <p className="user-profile-detail-title">Mobile number</p>
                                            <p className="user-profile-detail">{user?.mobileNumber}</p>
                                        </div>
                                    </div>

                                    <div className="user-profile-address-city-div">
                                        <div className="user-profile-detail-div">
                                            <p className="user-profile-detail-title">Address</p>
                                            <p className="user-profile-detail">{user?.address}</p>
                                        </div>

                                        <div className="user-profile-detail-div">
                                            <p className="user-profile-detail-title">City</p>
                                            <p className="user-profile-detail">{user?.city}</p>
                                        </div>
                                    </div>

                                    <div className="user-profile-detail-div">
                                        <p className="user-profile-detail-title">Email address</p>
                                        <p className="user-profile-detail">{user?.email}</p>
                                    </div>

                                    <div className="user-profile-detail-div">
                                        <p className="user-profile-detail-title">Password</p>
                                        <p className="user-profile-detail">{user?.password ? "•".repeat(user?.password.length) : ""}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default UserProfile;