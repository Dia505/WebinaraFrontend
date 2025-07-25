import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";

import loading from "../../assets/loading2.gif";
import { useAuth } from "../../context/auth_context";
import "../css_files/public/login.css";

const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("*Email required"),
    password: yup.string().required("*Password required"),
});

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "all",
    });

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const { user, login } = useAuth();

    const loginUser = useMutation({
        mutationKey: "LOGIN",
        mutationFn: async (data) => {
            setIsLoading(true);
            return await login(data);
        },
        onSuccess: (user, variables) => {
            setIsLoading(false);
            console.log("Login success, user: ", user);

            if (!user) {
                console.warn("No user returned from login!");
                return;
            }

            if (user.role === "user") {
                navigate("/");
            } else if (user.role === "admin") {
                navigate("/admin-otp", { state: { email: variables.email } });
            }
        },
        onError: (error) => {
            setIsLoading(false);
            console.log("Error object:", error);

            // Instead of error.response, check error.message directly
            if (error.status === 403) {
                if (error.forcePasswordReset) {
                    // Save token temporarily
                    localStorage.setItem("token", error.token); // or use your auth context

                    toast.warning("Password expired. Please change your password.", {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        theme: "colored",
                    });

                    navigate("/change-password", {
                        state: {
                            userId: error._id
                        }
                    });

                    return;
                }

                if (error.message && typeof error.message === "string") {
                    toast.error(error.message, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        theme: "colored",
                    });
                    return;
                }
            }

            toast.error("Login failed", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
        }
    });

    const onSubmit = (values) => {
        loginUser.mutate(values);
    };

    const [rememberMe, setRememberMe] = useState(false);

    const handleRememberMeChange = (event) => {
        setRememberMe(event.target.checked);
    };

    return (
        <>
            <div className="login-main-window">

                <div className='left-section'>
                    <p className="login-site-name" onClick={() => navigate("/")}>Webinara.</p>
                    <p className="login-site-tagline">Learn. Connect. Grow - one webinar at a time.</p>

                    <img className='login-img' src='src\assets\login.png' />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="right-section-div">
                        <p className="login-site-name2">Webinara.</p>
                        <div className='right-section'>
                            <div className='title-subtitle-div'>
                                <p className='login-title'>Welcome Back!</p>
                                <p className='login-subtitle'>Log in to your account</p>
                            </div>

                            <div className='input-field-div'>
                                <p className='email-input-title'>Email address</p>
                                <input
                                    type="email"
                                    {...register("email")}
                                    className={errors.email ? "input-error" : ""}
                                />
                                {errors.email && <p className="error-message">{errors.email.message}</p>}
                            </div>

                            <div className='input-field-div'>
                                <p className='email-input-title'>Password</p>
                                <input
                                    type='password'
                                    {...register("password")}
                                    className={errors.password ? "input-error" : ""}
                                />
                                {errors.password && <p className="error-message">{errors.password.message}</p>}
                            </div>

                            <div className='rememberMe-forgotPass-div'>
                                <label className='checkbox-label-container'>
                                    {/* Hidden native checkbox input for functionality and accessibility */}
                                    <input
                                        className='remember-me-checkbox'
                                        type='checkbox'
                                        checked={rememberMe}
                                        onChange={handleRememberMeChange}
                                    />
                                    <span className='custom-checkbox-visual'></span>

                                    <p className='remember-me-text'>Remember me</p>
                                </label>

                                <p className='forgot-password-text' onClick={() => navigate("/email-for-otp")}>Forgot password?</p>
                            </div>

                            {isLoading
                                ? <img src={loading} className="login-loading" />
                                : <button type="submit" className='login-button'>Log In</button>
                            }

                            <div className='sign-up-div'>
                                <p className='new-to-localloop-text'>New to Webinara?</p>
                                <p className='sign-up-text' onClick={() => navigate("/register")}>Sign Up</p>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        </>
    )
}

export default Login;