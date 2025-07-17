import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useState } from "react";

import loading from "../../../assets/loading2.gif";
import "../../css_files/public/forgot_password/email_for_otp.css";

const emailForOtpSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("*Email required")
});

function EmailForOtp() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(emailForOtpSchema),
        mode: "all",
    });

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post("https://localhost:443/api/reset/send-otp", data);
            console.log("Email: ", data.email);
            navigate('/verify-otp', { state: { email: data.email } });
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("There was an error sending OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="email-for-otp-main-window">
                <div className='email-for-otp-left-section'>
                    <p className="email-for-otp-site-name" onClick={() => navigate("/")}>Webinara.</p>
                    <p className="email-for-otp-site-tagline">Learn. Connect. Grow - one webinar at a time.</p>

                    <img className='email-for-otp-img' src='src\assets\login.png' />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="email-for-otp-right-section">
                        <div className='email-for-otp-title-subtitle-div'>
                            <p className='email-for-otp-title'>Forgot password?</p>
                            <p className='email-for-otp-subtitle'>Enter your email address to receive an OTP</p>
                        </div>

                        <div className='input-field-div'>
                            <p className='email-for-otp-input-title'>Email address</p>
                            <input
                                type="email"
                                {...register("email")}
                                className={errors.email ? "input-error" : ""}
                            />
                            {errors.email && <p className="error-message">{errors.email.message}</p>}
                        </div>

                        {isLoading 
                            ? <img src={loading} className="email-for-otp-loading" />
                            :<button type="submit" className='email-for-otp-button'>Send OTP</button>
                        }

                        <p className="email-for-otp-back-text">
                            <span>&#8592; </span> 
                            Back to 
                            <span className="email-for-otp-login-btn" onClick={() => navigate("/login")}>  Log In</span>
                        </p>
                    </div>
                </form>
            </div>
        </>
    )
}

export default EmailForOtp;