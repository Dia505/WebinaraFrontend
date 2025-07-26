import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";
import * as yup from "yup";
import { useAuth } from "../../context/auth_context";
const VITE_API_URL = import.meta.env.VITE_API_URL;  

import "../css_files/admin_profile/admin_profile_edit_form.css";

const adminProfileEditSchema = yup.object().shape({
    email: yup.string().email("Invalid email"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[@$!%*?&#]/, "Password must contain at least one special character")
});

function AdminProfileEditForm({ closeForm }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(adminProfileEditSchema),
        mode: "all",
    });

    const { user, authToken } = useAuth();
    const [userId, setUserId] = useState(null);

    const CSRF_URL = `${VITE_API_URL}/api/csrf-token`;

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setValue("email", user.email);
                setValue("password", user.password);
                setUserId(user._id);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, []);

    const onSubmit = async (data) => {
        const updatedData = {};

        if (data.email && data.email !== user.email) {
            updatedData.email = data.email;
        }

        if (data.password && data.password !== user.password) {
            updatedData.password = data.password;
        }

        try {
            const csrfResponse = await fetch(CSRF_URL, {
                credentials: 'include' 
            });

            if (!csrfResponse.ok) {
                throw new Error("Failed to fetch CSRF token");
            }

            const { csrfToken } = await csrfResponse.json();

            const response = await fetch(
                `${VITE_API_URL}/api/auth/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                        "X-CSRF-Token": csrfToken
                    },
                    body: JSON.stringify(updatedData),
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                // Extract error message from backend
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update profile");
            }

            const result = await response.json();

            toast.success("Profile updated!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });

            closeForm();

        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error(err.message || "Failed to update profile", {
                position: "top-center",
                closeOnClick: true,
                pauseOnHover: false,
                theme: "colored"
            });
        }
    };

    const handleCancel = () => {
        closeForm();
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="admin-edit-profile-form">
                    <p className="admin-edit-profile-title">Edit profile</p>

                    <div>
                        <p className='admin-edit-profile-input-label'>Email address</p>
                        <input
                            type='email'
                            name='email'
                            className={errors.email ? "input-error" : ""}
                            {...register("email")}
                        />
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>

                    <div>
                        <p className='admin-edit-profile-input-label'>Password</p>
                        <input
                            type='password'
                            name='password'
                            className={errors.password ? "input-error" : ""}
                            {...register("password")}
                        />
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>

                    <div className='admin-edit-profile-btns-div'>
                        <button className='admin-edit-profile-cancel-btn' onClick={handleCancel}>Cancel</button>
                        <button type='submit' className='admin-edit-profile-update-btn'>Update</button>
                    </div>
                </div>
            </form>
        </>
    )
};

export default AdminProfileEditForm;