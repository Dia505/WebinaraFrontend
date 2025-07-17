import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";

import "../../css_files/public/forgot_password/verify_otp.css";

const verifyOtp = yup.object().shape({
    otp: yup
        .string()
        .required("*OTP required")
        .matches(/^\d{6}$/, "*OTP must be 6 digits"),
});

function VerifyOtp() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(verifyOtp),
        mode: "all",
    });

    const navigate = useNavigate();

    const location = useLocation();
    const email = location.state?.email;

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("https://localhost:443/api/reset/verify-otp", {
                email: email,
                otp: data.otp,
            });
            navigate("/reset-password", { state: { email, otp: data.otp } });
        } catch (err) {
            console.log(err.response ? err.response.data.message : 'Something went wrong');
        }
    };

    return (
        <>
            <div className="verify-otp-main-window">
                <div className='verify-otp-left-section'>
                    <p className="verify-otp-site-name" onClick={() => navigate("/")}>Webinara.</p>
                    <p className="verify-otp-site-tagline">Learn. Connect. Grow - one webinar at a time.</p>

                    <img className='verify-otp-img' src='src\assets\login.png' />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="verify-otp-right-section">
                        <div className='verify-otp-title-subtitle-div'>
                            <p className='verify-otp-title'>Forgot password?</p>
                            <p className='verify-otp-subtitle'>Check your email and enter the OTP to continue</p>
                        </div>

                        <div className='input-field-div'>
                            <p className='verify-otp-input-title'>OTP code</p>
                            <input
                                type="text"
                                {...register("otp")}
                                className={errors.otp ? "input-error" : ""}
                            />
                            {errors.otp && <p className="error-message">{errors.otp.message}</p>}

                        </div>

                        <button type="submit" className='verify-otp-button'>Verify OTP</button>

                        <p className="verify-otp-back-text">
                            <span>&#8592; </span>
                            Back to
                            <span className="verify-otp-login-btn" onClick={() => navigate("/login")}>  Log In</span>
                        </p>
                    </div>
                </form>
            </div>
        </>
    )
}

export default VerifyOtp;