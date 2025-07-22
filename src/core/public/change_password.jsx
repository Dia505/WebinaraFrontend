import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import * as yup from "yup";

import "../css_files/public/forgot_password/reset_password.css";

const changePasswordSchema = yup.object().shape({
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(16, "Password cannot exceed 16 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[@$!%*?&#]/, "Password must contain at least one special character")
        .required("Password is required"),

    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], "Passwords must match")
        .required("*required"),
});

function ChangePassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const userId = location.state?.userId;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(changePasswordSchema),
        mode: "all",
    });

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem("forceResetToken");
            if (!token) {
                toast.error("Unauthorized access, please login again.", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "colored",
                });
                navigate("/login");
                return;
            }

            const response = await axios.put(
                `https://localhost:443/api/user/${userId}`,
                {
                    newPassword: data.password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // On success, remove the token from localStorage
            localStorage.removeItem("forceResetToken");

            toast.success("Password changed successfully!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            navigate("/login");
        } catch (err) {
            const message = err.response?.data?.message;

            if (message === "You cannot reuse a previous password") {
                toast.error(message, {
                    position: "top-center",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "colored",
                });
                return;
            }

            // fallback error
            toast.error("Failed to changed password", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });

            console.error("Change password error:", err);
        }
    };

    return (
        <>
            <div className="reset-password-main-window">
                <div className='reset-password-left-section'>
                    <p className="reset-password-site-name" onClick={() => navigate("/")}>Webinara.</p>
                    <p className="reset-password-site-tagline">Learn. Connect. Grow - one webinar at a time.</p>

                    <img className='reset-password-img' src='src\assets\login.png' />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="reset-password-right-section">
                        <div className='reset-password-title-subtitle-div'>
                            <p className='reset-password-title'>Change password</p>
                            <p className='reset-password-subtitle'>Set a new password to secure your account</p>
                        </div>

                        <div className='input-field-div'>
                            <p className='reset-password-input-title'>New password</p>
                            <input
                                type="password"
                                {...register("password")}
                                className={errors.password ? "input-error" : ""}
                            />
                            {errors.password && <p className="error-message">{errors.password.message}</p>}
                        </div>

                        <div className='input-field-div'>
                            <p className='reset-password-input-title'>Confirm password</p>
                            <input
                                type="password"
                                {...register("confirmPassword")}
                                className={errors.confirmPassword ? "input-error" : ""}
                            />
                            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
                        </div>

                        <button type="submit" className='reset-password-button'>Reset password</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ChangePassword;