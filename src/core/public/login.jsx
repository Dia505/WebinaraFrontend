import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

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

    const { login } = useAuth();

    const loginUser = useMutation({
        mutationKey: "LOGIN",
        mutationFn: async (data) => {
            const response = await axios.post("http://localhost:3000/api/auth/login", data);
            return response.data;
        },
        onSuccess: (response) => {
            console.log(response);

            login(response.token);

            navigate("/");
        },
        onError: (error) => {
            console.log(error);
            console.log(error.response?.data);

            const errData = error.response?.data;

            if (error.response?.status === 403 && errData?.field && errData?.message) {
                setError(errData.field, { type: "manual", message: errData.message });
                return;
            }

            alert(errData?.message || "Login failed!");
        },
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

                            <button type="submit" className='login-button'>Log In</button>

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