import { useState } from "react";
import { useAuth } from "../../../context/auth_context";

import edit from "../../../assets/edit.png";
import AdminSideBar from "../../../components/navigation/admin_side_bar";
import AdminProfileEditForm from "../../../components/admin_profile/admin_profile_edit_form";
import "../../css_files/private/admin/admin_profile.css";

function AdminProfile() {
    const { user } = useAuth();
    const [showEditProfileForm, setShowEditProfileForm] = useState(false);

    return (
        <>
            <div className="admin-profile-main-window">
                <div className="admin-side-bar-div">
                    <AdminSideBar />
                </div>

                {showEditProfileForm ? (
                    <AdminProfileEditForm closeForm={() => setShowEditProfileForm(false)} />
                ) : (
                    <div className="admin-profile-main-div">
                        <div className="admin-profile-title-btn-div">
                            <p className="admin-profile-title">Profile</p>
                            <img className="admin-profile-edit-btn" src={edit} onClick={() => setShowEditProfileForm(true)} />
                        </div>

                        <div className="admin-profile-detail-div">
                            <p className="admin-profile-detail-title">Email</p>
                            <p className="admin-profile-detail">{user?.email}</p>
                        </div>

                        <div className="admin-profile-detail-div">
                            <p className="admin-profile-detail-title">Password</p>
                            <p className="admin-profile-detail">{user?.password}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default AdminProfile;