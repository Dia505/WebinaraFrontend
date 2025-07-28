import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import * as yup from "yup";
const VITE_API_URL = import.meta.env.VITE_API_URL;

import "../css_files/webinars/create_webinar_form.css";

const fullWebinarSchema = yup.object().shape({
    title: yup.string(),
    subtitle: yup
        .string()
        .max(300, "Subtitle must be less than 300 characters"),
    category: yup.string(),
    level: yup.string(),
    language: yup.string(),
    date: yup
        .date()
        .transform((value, originalValue) => (originalValue === "" ? undefined : value)),
    startTime: yup.string(),
    endTime: yup.string(),
    webinarPhoto: yup.mixed(),

    host: yup.object().shape({
        fullName: yup.string(),
        bio: yup
            .string()
            .max(300, "Bio must be less than 300 characters"),
        email: yup.string().email("Invalid email"),
        expertise: yup.string(),
        socialMediaLinks: yup
            .array()
            .of(yup.string().url("Invalid URL"))
            .min(1, "*At least one website is required"),
        profilePicture: yup.mixed(),
    }),
});

function EditWebinarForm({ webinar, closeForm }) {
    const [previewImage, setPreviewImage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [subtitleLength, setSubtitleLength] = useState(0);
    const [limitedSeats, setLimitedSeats] = useState(false);

    const [hostPreviewImg, setHostPreviewImg] = useState("");
    const [selectedHostImg, setSelectedHostImg] = useState(null);
    const [bioLength, setBioLength] = useState(0);
    const [chipInput, setChipInput] = useState("");
    const [chips, setChips] = useState([]);

    const navigate = useNavigate();

    const CSRF_URL = `${VITE_API_URL}/api/csrf-token`;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        trigger
    } = useForm({
        resolver: yupResolver(fullWebinarSchema),
        mode: "all"
    });

    useEffect(() => {
        const fetchWebinarDetails = async () => {
            try {
                if (webinar) {
                    setValue("title", webinar.title);
                    setValue("subtitle", webinar.subtitle);
                    setSubtitleLength(webinar.subtitle.length);
                    setValue("category", webinar.category);
                    setValue("level", webinar.level);
                    setValue("language", webinar.language);
                    setValue("date", webinar.date?.split("T")[0]);
                    setValue("startTime", webinar.startTime);
                    setValue("endTime", webinar.endTime);
                    if (webinar.totalSeats != null) {
                        setLimitedSeats(true);
                        setValue("totalSeats", webinar.totalSeats);
                    }
                    setPreviewImage(webinar.webinarPhoto);
                }

                setValue("host.fullName", webinar.hostId.fullName);
                setValue("host.bio", webinar.hostId.bio);
                setSubtitleLength(webinar.hostId.bio.length);
                setValue("host.email", webinar.hostId.email);
                setValue("host.expertise", webinar.hostId.expertise.join(", "));
                setHostPreviewImg(webinar.hostId.profilePicture);
                setChips(webinar.hostId.socialMediaLinks || []);
            } catch (err) {
                console.error("Failed to fetch webinar data", err);
            }
        };

        fetchWebinarDetails();
    }, [webinar]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setSelectedFile(file);
        }
    };

    const handleHostImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setHostPreviewImg(imageUrl);
            setSelectedHostImg(file);
        }
    };

    const handleCheckboxChange = (e) => {
        setLimitedSeats(e.target.checked);
    };

    const handleChipKeyDown = (e) => {
        if (e.key === "Enter" && chipInput.trim()) {
            e.preventDefault();
            try {
                new URL(chipInput);
                const newChips = [...chips, chipInput];
                setChips(newChips);
                setChipInput("");

                setValue("socialMediaLinks", newChips);
                trigger("socialMediaLinks");
            } catch (error) {
                // optionally show URL format error
            }
        }
    };

    const handleRemoveChip = (index) => {
        const newChips = chips.filter((_, i) => i !== index);
        setChips(newChips);
        setValue("socialMediaLinks", newChips);
        trigger("socialMediaLinks");
    };

    useEffect(() => {
        setValue("host.socialMediaLinks", chips, { shouldValidate: true });
    }, [chips]);

    const onSubmit = async (data) => {
        try {
            const csrfResponse = await fetch(CSRF_URL, {
                credentials: 'include'
            });

            if (!csrfResponse.ok) {
                throw new Error("Failed to fetch CSRF token");
            }

            const { csrfToken } = await csrfResponse.json();

            const updatedHost = {
                fullName: data.host.fullName,
                bio: data.host.bio,
                email: data.host.email,
                expertise: data.host.expertise.split(',').map(e => e.trim()),
                socialMediaLinks: data.host.socialMediaLinks,
            }

            if (hostPreviewImg !== webinar.hostId.profilePicture && selectedHostImg) {
                const formData = new FormData();
                formData.append("profilePicture", selectedHostImg);

                const hostProfilePictureResponse = await fetch(
                    `${VITE_API_URL}/api/host/${webinar.hostId._id}/profile-picture`,
                    {
                        method: "PUT",
                        headers: {
                            "X-CSRF-Token": csrfToken
                        },
                        body: formData,
                        credentials: 'include'
                    }
                );
            }

            const hostReponse = await fetch(
                `${VITE_API_URL}/api/host/${webinar.hostId._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-Token": csrfToken
                    },
                    body: JSON.stringify(updatedHost),
                    credentials: 'include'
                }
            );

            const updatedWebinar = {
                title: data.title,
                subtitle: data.subtitle,
                category: data.category,
                level: data.level,
                language: data.language,
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                totalSeats: limitedSeats ? data.totalSeats : null
            }

            await fetch(`${VITE_API_URL}/api/webinar/${webinar._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken
                },
                body: JSON.stringify(updatedWebinar),
                credentials: 'include'
            });

            if (selectedFile) {
                const imageForm = new FormData();
                imageForm.append("webinarPhoto", selectedFile);

                await fetch(`${VITE_API_URL}/api/webinar/${webinar._id}/webinar-image`, {
                    method: "PUT",
                    headers: {
                        "X-CSRF-Token": csrfToken
                    },
                    body: imageForm,
                    credentials: 'include'
                });
            }

            toast.success("Webinar updated successfully!");
            navigate(`/webinar-details/${webinar._id}`);
            closeForm();
        } catch (err) {
            console.error("Failed to update webinar:", err);
            toast.error("Update failed.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="create-webinar-form-main-div">
                    <p className="create-webinar-form-title">Edit webinar</p>
                    <p className='create-webinar-form-title2'>Webinar details</p>

                    <div className="create-webinar-form-centre-div">
                        <div className="create-webinar-form-img-div">
                            <img className="create-webinar-form-img" src={previewImage} alt="webinar" />

                            <input
                                type="file"
                                accept="image/*"
                                id="createWebinarImgInput"
                                className="create-webinar-form-hidden-img-input"
                                onChange={(e) => {
                                    handleImageChange(e);
                                    setValue("webinarPhoto", e.target.files[0], { shouldValidate: true });
                                }}
                            />

                            <button
                                className="create-webinar-form-img-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById("createWebinarImgInput").click();
                                }}
                            >
                                Upload picture
                            </button>
                            {errors.webinarPhoto && <p className="error-message">{errors.webinarPhoto.message}</p>}
                        </div>

                        <div className="create-webinar-form-input-div">
                            <div>
                                <p className='create-webinar-form-input-label'>Title</p>
                                <input
                                    type='text'
                                    name='title'
                                    {...register("title")}
                                    className={errors.title ? "input-error" : ""}
                                />
                                {errors.title && <p className="error-message">{errors.title.message}</p>}
                            </div>

                            <div className="textarea-container">
                                <p className='create-webinar-form-input-label'>Subtitle</p>
                                <textarea
                                    name='subtitle'
                                    maxLength={300}
                                    {...register("subtitle")}
                                    className={errors.subtitle ? "input-error" : ""}
                                    onChange={(e) => {
                                        setSubtitleLength(e.target.value.length);
                                        register("subtitle").onChange(e);
                                    }}
                                />
                                <span className="char-count">{subtitleLength}/300</span>
                                {errors.subtitle && <p className="error-message">{errors.subtitle.message}</p>}
                            </div>


                            <div>
                                <p className='create-webinar-form-input-label'>Category</p>
                                <select
                                    {...register("category")}
                                    defaultValue=""
                                    className={errors.category ? 'select-error' : ''}
                                >
                                    <option value="" disabled hidden>Select a category</option>
                                    <option value="Business">Business</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Design">Design</option>
                                    <option value="Health">Health</option>
                                    <option value="Education">Education</option>
                                    <option value="Career">Career</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                    <option value="Creative">Creative</option>
                                </select>
                                {errors.category && <p className="error-message">{errors.category.message}</p>}
                            </div>

                            <div>
                                <p className='create-webinar-form-input-label'>Level</p>
                                <select
                                    {...register("level")}
                                    defaultValue=""
                                    className={errors.level ? 'select-error' : ''}
                                >
                                    <option value="" disabled hidden>Select a level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                                {errors.level && <p className="error-message">{errors.level.message}</p>}
                            </div>

                            <div>
                                <p className='create-webinar-form-input-label'>Language</p>
                                <select
                                    {...register("language")}
                                    defaultValue=""
                                    className={errors.language ? 'select-error' : ''}
                                >
                                    <option value="" disabled hidden>Select a language</option>
                                    <option value="English">English</option>
                                    <option value="Nepali">Nepali</option>
                                    <option value="Hindi">Hindi</option>
                                </select>
                                {errors.language && <p className="error-message">{errors.language.message}</p>}
                            </div>

                            <div>
                                <p className='create-webinar-form-input-label'>Date</p>
                                <input
                                    type='date'
                                    name='date'
                                    {...register("date")}
                                    className={errors.date ? "input-error" : ""}
                                />
                                {errors.date && <p className="error-message">{errors.date.message}</p>}
                            </div>

                            <div className='create-webinar-form-address-city-div'>
                                <div>
                                    <p className='create-webinar-form-input-label'>Start time</p>
                                    <input
                                        className={errors.address ? 'create-webinar-form-address-input-error' : 'create-webinar-form-address-input'}
                                        type='time'
                                        {...register("startTime")}
                                    />
                                    {errors.startTime && <p className="error-message">{errors.startTime.message}</p>}
                                </div>

                                <div>
                                    <p className='create-webinar-form-input-label'>End time</p>
                                    <input
                                        className='create-webinar-form-address-input'
                                        type='time'
                                        {...register("endTime")}
                                    />
                                </div>
                            </div>

                            <label className="checkbox-label-container">
                                <input
                                    className="limited-seating-checkbox-input"
                                    type="checkbox"
                                    onChange={handleCheckboxChange}
                                />
                                <span className="custom-checkbox-visual"></span>
                                <p className="checkbox-label-text">Limited seating?</p>
                            </label>

                            {limitedSeats === true && (
                                <div>
                                    <input
                                        className={errors.totalSeats ? "input-error" : ""}
                                        type='text'
                                        name='totalSeats'
                                        {...register("totalSeats")}
                                        placeholder='Total number of seats'
                                    />
                                    {errors.totalSeats && <p className="error-message">{errors.totalSeats.message}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='create-webinar-divider'></div>

                    <p className='create-webinar-form-title2'>Host details</p>

                    <div className="create-webinar-form-centre-div">
                        <div className="create-webinar-form-img-div">
                            <img className="create-webinar-form-img" src={hostPreviewImg} alt="webinar" />

                            <input
                                type="file"
                                accept="image/*"
                                id="createHostImgInput"
                                className="create-webinar-form-hidden-img-input"
                                onChange={(e) => {
                                    handleHostImageChange(e);
                                    setValue("host.profilePicture", e.target.files[0], { shouldValidate: true });
                                }}
                            />

                            <button
                                className="create-webinar-form-img-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById("createHostImgInput").click();
                                }}
                            >
                                Upload picture
                            </button>
                        </div>

                        <div className="create-webinar-form-input-div">
                            <div>
                                <p className='create-webinar-form-input-label'>Full name</p>
                                <input
                                    type='text'
                                    name='host.fullName'
                                    {...register("host.fullName")}
                                    className={errors?.host?.fullName ? "input-error" : ""}
                                />
                                {errors?.host?.fullName && <p className="error-message">{errors?.host?.fullName.message}</p>}
                            </div>

                            <div className="textarea-container">
                                <p className='create-webinar-form-input-label'>Bio</p>
                                <textarea
                                    name='host.bio'
                                    maxLength={300}
                                    {...register("host.bio")}
                                    className={errors?.host?.bio ? "input-error" : ""}
                                    onChange={(e) => {
                                        setBioLength(e.target.value.length);
                                        register("host.bio").onChange(e);
                                    }}
                                />
                                <span className="char-count">{bioLength}/300</span>
                                {errors?.host?.bio && <p className="error-message">{errors?.host?.bio.message}</p>}
                            </div>

                            <div>
                                <p className='create-webinar-form-input-label'>Email address</p>
                                <input
                                    type='text'
                                    name='host.email'
                                    {...register("host.email")}
                                    className={errors?.host?.email ? "input-error" : ""}
                                />
                                {errors?.host?.email && <p className="error-message">{errors?.host?.email.message}</p>}
                            </div>

                            <div>
                                <p className='create-webinar-form-input-label'>Expertise</p>
                                <input
                                    type='text'
                                    name='host.expertise'
                                    {...register("host.expertise")}
                                    placeholder="e.g., design, tech, research"
                                    className={errors?.host?.expertise ? "input-error" : ""}
                                />
                                {errors?.host?.expertise && <p className="error-message">{errors?.host?.expertise.message}</p>}
                            </div>

                            <div>
                                <p className='create-webinar-form-input-label'>Social media links</p>
                                <div className="chip-input-wrapper">
                                    <input
                                        type="url"
                                        placeholder="Paste URL and press Enter"
                                        value={chipInput}
                                        onChange={(e) => setChipInput(e.target.value)}
                                        onKeyDown={handleChipKeyDown}
                                        className={errors?.host?.socialMediaLinks ? "input-error" : ""}
                                    />

                                    <div className="chip-container">
                                        {chips.map((url, index) => (
                                            <span key={index} className="chip">
                                                {new URL(url).hostname.replace(/^www\./, '')}
                                                <button
                                                    type="button"
                                                    className="chip-close"
                                                    onClick={() => handleRemoveChip(index)}
                                                >×</button>
                                            </span>
                                        ))}
                                    </div>

                                    {errors?.host?.socialMediaLinks && (
                                        <p className="error-message-2">{errors?.host?.socialMediaLinks.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className='create-webinar-form-btns-div'>
                                <button type='button' className='create-webinar-form-cancel-btn' onClick={closeForm}>Cancel</button>
                                <button
                                    type="submit"
                                    className="create-webinar-form-update-btn"
                                >
                                    Update webinar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default EditWebinarForm;