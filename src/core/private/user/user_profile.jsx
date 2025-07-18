import { useState } from "react";
import { useAuth } from "../../../context/auth_context";

import edit from "../../../assets/edit.png";
import NavBar from "../../../components/navigation/nav_bar";
import UserSideBar from "../../../components/navigation/user_side_bar";
import UserProfileEditForm from "../../../components/user_profile/user_profile_edit_form";
import "../../css_files/private/user/user_profile.css";

function UserProfile() {
    const { user } = useAuth();
    const [showEditProfileForm, setShowEditProfileForm] = useState(false);

    return (
        <>
            <div className="user-profile-main-window">
                <div className="user-profile-nav-bar-div">
                    <NavBar />
                </div>

                <div className="user-profile-side-bar-content-div">
                    <UserSideBar />

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