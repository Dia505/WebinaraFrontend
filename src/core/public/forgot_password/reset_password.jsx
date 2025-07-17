import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import * as yup from "yup";

import "../../css_files/public/forgot_password/reset_password.css";

const resetPasswordSchema = yup.object().shape({
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

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, otp } = location.state || {};

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(resetPasswordSchema),
        mode: "all",
    });

    const onSubmit = async (data) => {
        try {
            const response = await axios.put("https://localhost:443/api/reset/reset-password", {
                email: email,
                otp: otp,
                newPassword: data.password,
            });

            toast.success("Password reset successfully!", {
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
            console.log(err.response ? err.response.data.message : 'Something went wrong');
        }
    };

    return(
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
                            <p className='reset-password-title'>Reset password</p>
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

                        <p className="reset-password-back-text">
                            <span>&#8592; </span>
                            Back to
                            <span className="reset-password-login-btn" onClick={() => navigate("/login")}>  Log In</span>
                        </p>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ResetPassword;