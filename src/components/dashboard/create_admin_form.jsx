import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";
import * as yup from "yup";
import { useAuth } from '../../context/auth_context';
const VITE_API_URL = import.meta.env.VITE_API_URL;

import "../css_files/dashboard/create_admin_form.css";

const adminSchema = yup.object().shape({
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
    confirmPassword: yup
        .string()
        .required("*required")
        .oneOf([yup.ref("password"), null], "Passwords must match")
});

function CreateAdminForm({ closeForm }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        resolver: yupResolver(adminSchema),
        mode: "all",
    });

    const { authToken } = useAuth();

    const CSRF_URL = `${VITE_API_URL}/api/csrf-token`;

    const registerAdmin = useMutation({
        mutationKey: "SAVEDATA",
        mutationFn: async (requestData) => {
            console.log(requestData);
            
            const csrfResponse = await axios.get(CSRF_URL, {
                withCredentials: true,
            });

            const csrfToken = csrfResponse.data.csrfToken;

            return axios.post(`${VITE_API_URL}/api/auth/register`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "X-CSRF-Token": csrfToken,
                    },
                    withCredentials: true
                }
            );
        },
        onSuccess: (data) => {
            toast.success("Admin successfully created!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            closeForm();
        },
        onError: (error) => {
            console.error("Error registering new admin:", error);

            const errData = error.response?.data;

            if (error.response?.status === 403 && errData?.field && errData?.message) {
                setError(errData.field, { type: "manual", message: errData.message });
                return;
            }

            toast.error("Failed to register new admin. Please try again.", {
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
        const { email, password } = values;
        registerAdmin.mutate({ email, password });
    };


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="create-admin-form-main-div">
                    <div className="create-admin-form-title-btn-div">
                        <p>Create new admin</p>
                        <p onClick={closeForm}>X</p>
                    </div>

                    <div>
                        <p className='create-admin-input-title'>Email address</p>
                        <input
                            type='text'
                            {...register("email")}
                            className={errors.email ? "input-error" : ""}
                        />
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>

                    <div>
                        <p className='create-admin-input-title'>Password</p>
                        <input
                            type='password'
                            {...register("password")}
                            className={errors.password ? "input-error" : ""}
                        />
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>

                    <div>
                        <p className='create-admin-input-title'>Confirm password</p>
                        <input
                            type='password'
                            {...register("confirmPassword")}
                            className={errors.confirmPassword ? "input-error" : ""}
                        />
                        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="create-admin-form-btn"
                    >
                        Create admin
                    </button>
                </div>
            </form>
        </>
    )
}

export default CreateAdminForm;