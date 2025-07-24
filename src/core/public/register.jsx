import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import * as yup from "yup";
const VITE_API_URL = import.meta.env.VITE_API_URL;

import '../css_files/public/register.css';

const userSchema = yup.object().shape({
    fullName: yup.string().required("*required"),
    mobileNumber: yup.string().matches(/^9[678]\d{8}$/, "Invalid mobile number").required("*required"),
    address: yup.string().required("*required"),
    city: yup.string().required("*required"),
    email: yup.string().email("Invalid email").required("*required"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(16, "Password cannot exceed 16 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[@$!%*?&#]/, "Password must contain at least one special character")
        .required("*required"),
    terms: yup
        .boolean()
        .oneOf([true]),
});

function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        resolver: yupResolver(userSchema),
        mode: "all",
    });

    const [termsAndConditions, setTermsAndConditions] = useState(false);
    const navigate = useNavigate();

    const handleTermsAndConditionsChange = (event) => {
        setTermsAndConditions(event.target.checked);
    };

    const registerUser = useMutation({
        mutationKey: "SAVEDATA",
        mutationFn: (requestData) => {
            console.log(requestData);
            return axios.post(`${VITE_API_URL}/api/user`, requestData);
        },
        onSuccess: (data) => {
            toast.success("Registration successful!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            navigate("/login");
        },
        onError: (error) => {
            console.error("Error registering event explorer:", error);

            const errData = error.response?.data;

            if (error.response?.status === 403 && errData?.field && errData?.message) {
                setError(errData.field, { type: "manual", message: errData.message });
                return;
            }

            toast.error("Failed to register event explorer. Please try again.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
        },
    });

    const onSubmit = (values) => {
        registerUser.mutate(values);
    };

    return (
        <>
            <div className="register-main-window">
                <div className='register-left-section'>
                    <p className="register-site-name" onClick={() => navigate("/")}>Webinara.</p>
                    <p className="register-site-tagline">Learn. Connect. Grow - one webinar at a time.</p>

                    <img className='register-img' src='src\assets\login.png' />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='register-right-section-div'>
                        <p className="register-site-name2">Webinara.</p>
                        <div className='register-right-section'>
                            <div>
                                <p className='register-title'>Sign up</p>
                                <p className='register-subtitle'>Discover local experiences, curated just for your vibe</p>
                            </div>

                            <div className='input-fields-div'>
                                <div>
                                    <input
                                        type='text'
                                        placeholder='Full name'
                                        {...register("fullName")}
                                        className={errors.fullName ? "input-error" : ""}
                                    />
                                    {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
                                </div>

                                <div>
                                    <input
                                        type='text'
                                        placeholder='Mobile number'
                                        {...register("mobileNumber")}
                                        className={errors.mobileNumber ? "input-error" : ""}
                                    />
                                    {errors.mobileNumber && <p className="error-message">{errors.mobileNumber.message}</p>}
                                </div>

                                <div className='address-city-div'>
                                    <div>
                                        <input
                                            className={errors.address ? 'address-input-error' : 'address-input'}
                                            type='text'
                                            placeholder='Address'
                                            {...register("address")}
                                        />
                                        {errors.address && <p className="error-message">{errors.address.message}</p>}
                                    </div>

                                    <div>
                                        <select
                                            className={errors.city ? 'select-error' : 'city-drop-down'}
                                            {...register("city")}
                                        >
                                            <option value="" disabled selected hidden>Select a city</option>
                                            <option value="Kathmandu">Kathmandu</option>
                                            <option value="Lalitpur">Lalitpur</option>
                                            <option value="Bhaktapur">Bhaktapur</option>
                                            <option value="Pokhara">Pokhara</option>
                                            <option value="Chitwan">Chitwan</option>
                                            <option value="Biratnagar">Biratnagar</option>
                                            <option value="Birgunj">Birgunj</option>
                                            <option value="Butwal">Butwal</option>
                                            <option value="Dharan">Dharan</option>
                                            <option value="Hetauda">Hetauda</option>
                                            <option value="Nepalgunj">Nepalgunj</option>
                                            <option value="Dhangadhi">Dhangadhi</option>
                                            <option value="Janakpur">Janakpur</option>
                                            <option value="Itahari">Itahari</option>
                                        </select>
                                        {errors.city && <p className="error-message">{errors.city.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <input
                                        type='email'
                                        placeholder='Email address'
                                        className={errors.email ? "input-error" : ""}
                                        {...register("email")}
                                    />
                                    {errors.email && <p className="error-message">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <input
                                        type='password'
                                        placeholder='Password'
                                        className={errors.password ? "input-error" : ""}
                                        {...register("password")}
                                    />
                                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                                </div>
                            </div>

                            <label className='terms-and-condition-div'>
                                <input
                                    className='terms-and-condition-checkbox'
                                    type='checkbox'
                                    {...register("terms")}
                                    checked={termsAndConditions}
                                    onChange={handleTermsAndConditionsChange}
                                />
                                <span className={`terms-and-condition-custom-checkbox-visual ${errors.terms ? 'checkbox-error' : ''}`}></span>

                                <div className='terms-and-condition-text-div'>
                                    <p className='terms-and-condition-text'>Yes, I understand and agree to the
                                        <span className='terms-and-conditions-highlights'> LocalLoop Terms of Service</span>,
                                        including the <span className='terms-and-conditions-highlights'> User Agreement </span>
                                        and <span className='terms-and-conditions-highlights'> Privacy Policy</span></p>
                                </div>
                            </label>

                            <button type="submit" className='register-button'>Create my account</button>

                            <div className='register-login-div'>
                                <p className='register-already-have-account-text'>Already have an account?</p>
                                <p className='register-login-text' onClick={() => navigate("/login")}>Log In</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Register;