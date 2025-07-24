import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth_context";
const VITE_API_URL = import.meta.env.VITE_API_URL;

import facebook from "../../assets/facebook2.png";
import instagram from "../../assets/instagram.png";
import tiktok from "../../assets/tiktok.png";
import viewCalendar from "../../assets/view_webinar_calendar.png";
import viewClock from "../../assets/view_webinar_clock.png";
import viewLanguage from "../../assets/view_webinar_language.png";
import viewLevel from "../../assets/view_webinar_level.png";
import x from "../../assets/X.png";
import Footer from "../../components/navigation/footer";
import NavBar from "../../components/navigation/nav_bar";
import BookSeatsForm from "../../components/view_webinar/book_seats_form";
import SimilarWebinars from "../../components/view_webinar/similar_webinars";
import "../css_files/public/view_webinar.css";

function ViewWebinar() {
    const { _id } = useParams();
    const { authToken, user } = useAuth();
    const [webinar, setWebinar] = useState(null);
    const [isFullyBooked, setIsFullyBooked] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const navigate = useNavigate();
    const [alreadyBooked, setAlreadyBooked] = useState(false);

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

    const location = useLocation();

    useEffect(() => {
        if (location.state?.openBookingForm) {
            setShowBookingForm(true);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchWebinarDetails = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/api/webinar/${_id}`);
                const webinarData = response.data;
                setWebinar(webinarData);

                if (webinarData.totalSeats != null) {
                    const fullyBookedResponse = await axios.get(
                        `${VITE_API_URL}/api/webinar/check-full-booking/${_id}`
                    );
                    setIsFullyBooked(fullyBookedResponse.data?.full ?? false);
                    return;
                }

                setIsFullyBooked(false);

            } catch (error) {
                console.error("Error fetching webinar:", error);
            }
        };

        fetchWebinarDetails();
    }, [_id]);

    useEffect(() => {
        const checkIfBooked = async () => {
            try {
                const response = await axios.get(
                    `${VITE_API_URL}/api/booking/check-booking/${_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        },
                        withCredentials: true
                    }
                );
                setAlreadyBooked(response.data.alreadyBooked);
            } catch (error) {
                console.error("Error checking booking status:", error);
            }
        };

        if (_id && authToken) {
            checkIfBooked();
        }
    }, [_id, authToken]);

    return (
        <>
            <div className="view-webinar-main-window">
                <NavBar />

                <div className="view-webinar-top-section">
                    <p className="view-webinar-title">{webinar?.title}</p>

                    <div className="view-webinar-details">
                        <div className="webinar-icon-detail-div">
                            <img className="webinar-icon" src={viewCalendar} alt="calendar" />
                            <p className="webinar-detail">
                                {new Date(webinar?.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        <div className="webinar-icon-detail-div">
                            <img className="webinar-icon" src={viewClock} alt="clock" />
                            <p className="webinar-detail">
                                {webinar?.endTime
                                    ? `${formatTo12Hour(webinar?.startTime)} - ${formatTo12Hour(webinar?.endTime)}`
                                    : `${formatTo12Hour(webinar?.startTime)} onwards`}
                            </p>
                        </div>

                        <div className="webinar-icon-detail-div">
                            <img className="webinar-icon" src={viewLevel} alt="level" />
                            <p className="webinar-detail">
                                {webinar?.level}
                            </p>
                        </div>

                        <div className="webinar-icon-detail-div">
                            <img className="webinar-icon" src={viewLanguage} alt="language" />
                            <p className="webinar-detail">
                                {webinar?.language}
                            </p>
                        </div>

                        <div className="webinar-seats-div">
                            {isFullyBooked && <div className="fully-booked">Fully Booked</div>}
                            {webinar?.totalSeats != null && <p className="limited-seats-text">*Limited seats</p>}
                        </div>
                    </div>
                </div>

                <div className="view-webinar-bottom-section">
                    <img
                        className="webinar-details-img"
                        src={webinar?.webinarPhoto}
                    />

                    <div className="view-webinar-subtitle-btn-div">
                        <p className="view-webinar-subtitle">{webinar?.subtitle}</p>

                        {isFullyBooked ? (
                            <div className="view-webinar-fully-booked-div">
                                Fully booked
                            </div>
                        )
                            : alreadyBooked ? (
                                <div className="view-webinar-already-booked-div">
                                    Seat booked ✅
                                </div>
                            )
                                : (webinar?.totalSeats != null) && (
                                    <button
                                        className="view-webinar-ticket-btn"
                                        onClick={() => {
                                            if (user) {
                                                setShowBookingForm(true);
                                            } else {
                                                navigate("/login");
                                            }
                                        }}
                                    >
                                        Book seats
                                    </button>
                                )}
                    </div>

                    <div className="view-webinar-host-div">
                        <p className="view-webinar-host-title">Meet your host!</p>

                        <div className="view-webinar-host-inner-div">
                            <img src={webinar?.hostId?.profilePicture} className="view-webinar-host-img" />

                            <div className="view-webinar-host-details">
                                <p className="view-webinar-host-name">{webinar?.hostId?.fullName} <span className="view-webinar-host-email">({webinar?.hostId?.email})</span></p>

                                <p className="view-webinar-host-bio">{webinar?.hostId?.bio}</p>

                                <div className="view-webinar-host-expertise-div">
                                    {webinar?.hostId?.expertise?.map((exp, index) => (
                                        <div key={index} className="host-expertise-item">
                                            {exp}
                                        </div>
                                    ))}
                                </div>

                                <div className="view-webinar-host-social-media-div">
                                    {webinar?.hostId?.socialMediaLinks?.map((link, index) => {
                                        let icon = null;

                                        if (link.includes("facebook.com")) {
                                            icon = facebook;
                                        } else if (link.includes("instagram.com")) {
                                            icon = instagram;
                                        } else if (link.includes("tiktok.com")) {
                                            icon = tiktok;
                                        } else if (link.includes("x.com") || link.includes("twitter.com")) {
                                            icon = x;
                                        }

                                        return icon ? (
                                            <a href={link} target="_blank" rel="noopener noreferrer" key={index}>
                                                <img src={icon} alt="social-icon" className="social-icon" />
                                            </a>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="view-webinar-similar-webinars-div">
                        <p className="view-webinar-similar-webinars-text">Similar webinars</p>
                        <SimilarWebinars category={webinar?.category} currentWebinarId={webinar?._id} />
                    </div>
                </div>

                <Footer />

                {showBookingForm && webinar && (
                    <>
                        <div className="view-webinar-overlay" onClick={() => setShowBookingForm(false)}></div>
                        <div className="view-webinar-form-modal">
                            <BookSeatsForm
                                closeForm={() => setShowBookingForm(false)}
                                webinarId={webinar._id}
                                webinarPhoto={webinar.webinarPhoto}
                                title={webinar.title}
                                level={webinar.level}
                                language={webinar.language}
                                date={webinar.date}
                                startTime={webinar.startTime}
                                endTime={webinar.endTime}
                                fullName={user?.fullName}
                                mobileNumber={user?.mobileNumber}
                                email={user?.email}
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default ViewWebinar;