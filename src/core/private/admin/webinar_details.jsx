import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/auth_context";

import deleteIcon from "../../../assets/delete.png";
import editIcon from "../../../assets/edit.png";
import AdminSideBar from "../../../components/navigation/admin_side_bar";
import EditWebinarForm from "../../../components/webinars/edit_webinar_form";
import "../../css_files/private/admin/webinar_details.css";

function WebinarDetails() {
    const { _id } = useParams();
    const [webinar, setWebinar] = useState(null);
    const [showDeleteWebinarPopUp, setShowDeleteWebinarPopUp] = useState(false);
    const { authToken } = useAuth();
    const navigate = useNavigate();
    const [showWebinarEditForm, setShowWebinarEditForm] = useState(false);

    useEffect(() => {
        if (showDeleteWebinarPopUp) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [showDeleteWebinarPopUp]);

    const formatTo12Hour = (timeStr) => {
        if (!timeStr) return "";

        const [hour, minute] = timeStr.split(":");
        const date = new Date();
        date.setHours(+hour, +minute);

        return date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).toLowerCase();
    };

    useEffect(() => {
        const fetchWebinarDetails = async () => {
            try {
                const response = await axios.get(`https://localhost:443/api/webinar/${_id}`);
                setWebinar(response.data);
            } catch (error) {
                console.error("Error fetching webinar:", error);
            }
        };
        fetchWebinarDetails();
    }, [_id]);

    const handleDeleteWebinar = async () => {
        try {
            await axios.delete(`https://localhost:443/api/webinar/${webinar._id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                withCredentials: true
            });

            await axios.delete(`https://localhost:443/api/host/${webinar.hostId._id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                withCredentials: true
            });

            toast.success("Webinar deleted successfully!");
            setShowDeleteWebinarPopUp(false);
            navigate("/webinars");

        } catch (error) {
            console.error("Failed to delete webinar:", error);
            toast.error("Failed to delete webinar. Try again.");
        }
    };

    return (
        <>
            <div className="webinar-details-main-window">
                <div className="webinar-details-side-bar">
                    <AdminSideBar />
                </div>

                <div className="webinar-details-main-div">
                    <img
                        className="webinar-details-img"
                        src={webinar?.webinarPhoto}
                    />
                    <div className="webinar-details-title-edit-div">
                        <p className="webinar-details-title">Event details</p>
                        <img onClick={() => setShowWebinarEditForm(true)} src={editIcon} className="webinar-details-edit-icon" />
                    </div>

                    <div className="webinar-details-details-div">
                        <div className="webinar-details-details">
                            <div>
                                <p className="webinar-details-detail-title">Title</p>
                                <p className="webinar-details-detail">{webinar?.title}</p>
                            </div>

                            <div>
                                <p className="webinar-details-detail-title">Subtitle</p>
                                <div className="webinar-details-subtitle-div">
                                    <p className="webinar-details-detail">{webinar?.subtitle}</p>
                                </div>
                            </div>
                        </div>

                        <div className="webinar-details-details">
                            <div>
                                <p className="webinar-details-detail-title">Level</p>
                                <p className="webinar-details-detail">{webinar?.level}</p>
                            </div>

                            <div>
                                <p className="webinar-details-detail-title">Language</p>
                                <p className="webinar-details-detail">{webinar?.language}</p>
                            </div>
                        </div>

                        <div className="webinar-details-details">
                            <div>
                                <p className="webinar-details-detail-title">Date</p>
                                <p className="webinar-details-detail">{new Date(webinar?.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>

                            <div>
                                <p className="webinar-details-detail-title">Time</p>
                                <p className="webinar-details-detail">{webinar?.endTime
                                    ? `${formatTo12Hour(webinar?.startTime)} - ${formatTo12Hour(webinar?.endTime)}`
                                    : `${formatTo12Hour(webinar?.startTime)} onwards`}</p>
                            </div>

                            {webinar?.totalSeats != null && (
                                <div>
                                    <p className="webinar-details-detail-title">Total seats</p>
                                    <p className="webinar-details-detail">{webinar?.totalSeats}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="webinar-details-divider"></div>

                    <p className="host-details-title">Host details</p>

                    <div className="host-details-div">
                        <img className="host-details-img" src={webinar?.hostId?.profilePicture} />

                        <div className="webinar-details-details">
                            <div>
                                <p className="webinar-details-detail-title">Full name</p>
                                <p className="webinar-details-detail">{webinar?.hostId?.fullName}</p>
                            </div>

                            <div>
                                <p className="webinar-details-detail-title">Email address</p>
                                <p className="webinar-details-detail">{webinar?.hostId?.email}</p>
                            </div>

                            <div>
                                <p className="webinar-details-detail-title">Expertise</p>
                                <div className="webinar-details-host-expertise-div">
                                    {webinar?.hostId?.expertise?.map((exp, index) => (
                                        <div key={index} className="host-expertise-item">
                                            {exp}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="webinar-details-detail-title">Social media links</p>
                                <div className="webinar-details-social-link-div">
                                    {webinar?.hostId?.socialMediaLinks?.map((link, index) => {
                                        let domain;
                                        try {
                                            domain = new URL(link).hostname.replace("www.", "");
                                        } catch {
                                            domain = link;
                                        }

                                        return (
                                            <div className="webinar-details-social-link">
                                                <a
                                                    key={index}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="host-social-link"
                                                >
                                                    {domain}
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="webinar-details-details">
                            <div>
                                <p className="webinar-details-detail-title">Bio</p>
                                <div className="webinar-details-subtitle-div">
                                    <p className="webinar-details-detail">{webinar?.hostId?.bio}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="webinar-details-delete-btn" onClick={() => setShowDeleteWebinarPopUp(true)}>Delete webinar</button>

                    {showDeleteWebinarPopUp && (
                        <>
                            <div className="webinar-details-overlay" onClick={() => setShowDeleteWebinarPopUp(false)}></div>
                            <div className="webinar-details-delete-form-modal">
                                <div className="webinar-details-delete-pop-up">
                                    <img src={deleteIcon} className="webinar-details-delete-icon" />
                                    <p className="webinar-details-delete-title">Delete Webinar</p>

                                    <div className="webinar-details-subtitle-div">
                                        <p>You’re going to delete “{webinar?.title}” webinar. Are you sure? </p>
                                    </div>

                                    <div className="webinar-details-delete-pop-up-btns">
                                        <button type='button' className='delete-pop-up-cancel-btn' onClick={() => setShowDeleteWebinarPopUp(false)}>No, keep it</button>
                                        <button type='button' className='delete-pop-up-delete-btn' onClick={handleDeleteWebinar}>Yes, delete</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {showWebinarEditForm && (
                        <>
                            <div className="webinar-details-overlay" onClick={() => setShowWebinarEditForm(false)}></div>
                            <div className="webinar-details-form-modal2">
                                <EditWebinarForm webinar={webinar} closeForm={() => setShowWebinarEditForm(false)} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default WebinarDetails;