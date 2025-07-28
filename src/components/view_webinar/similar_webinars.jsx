import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import blueCalendar from "../../assets/blue_calendar.png";
import blueClock from "../../assets/blue_clock.png";
import blueLanguage from "../../assets/blue_language.png";
import blueLevel from "../../assets/blue_level.png";
const VITE_API_URL = import.meta.env.VITE_API_URL;

import "../css_files/view_webinar/similar_webinars.css";

function SimilarWebinars({ category, currentWebinarId }) {
    const [similarWebinars, setSimilarWebinars] = useState([]);
    const navigate = useNavigate();
    const [fullyBookedWebinars, setFullyBookedWebinars] = useState([]);
    const [alreadyBookedWebinars, setAlreadyBookedWebinars] = useState([]);

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
        if (!category) return;

        const fetchSimilarWebinars = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/api/webinar/webinar-category?category=${category}`);
                let webinars = response.data;

                webinars = webinars.filter(webinar => webinar._id !== currentWebinarId);

                const shuffled = webinars.sort(() => 0.5 - Math.random());
                const limited = shuffled.slice(0, 3);

                setSimilarWebinars(limited);

                const fullyBooked = [];

                for (const webinar of webinars) {
                    if (!webinar._id || webinar.totalSeats === null) continue;

                    const fullBookingResponse = await axios.get(
                        `${VITE_API_URL}/api/webinar/check-full-booking/${webinar._id}`
                    );

                    const isFullyBooked = fullBookingResponse?.data?.full;
                    if (isFullyBooked) {
                        fullyBooked.push(webinar);
                    }
                }

                setFullyBookedWebinars(fullyBooked);

                const alreadyBooked = [];

                for (const webinar of webinars) {
                    if (webinar.totalSeats === null) continue;

                    const alreadyBookedResponse = await axios.get(
                        `${VITE_API_URL}/api/booking/check-booking/${webinar._id}`, {
                        withCredentials: true
                    }
                    );

                    const isAlreadyBooked = alreadyBookedResponse?.data?.alreadyBooked;
                    if (isAlreadyBooked) {
                        alreadyBooked.push(webinar);
                    }
                }

                setAlreadyBookedWebinars(alreadyBooked);

            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchSimilarWebinars();
    }, [category, currentWebinarId]);

    return (
        <>
            <div className="similar-webinars-div">
                {similarWebinars.map((webinar) => {
                    const isFullyBooked = fullyBookedWebinars.some(fb => fb._id === webinar._id);
                    const isAlreadyBooked = alreadyBookedWebinars.some(ab => ab._id === webinar._id);

                    return (
                        <div
                            key={webinar._id}
                            className={
                                webinar.totalSeats != null && !isFullyBooked && !isAlreadyBooked
                                    ? "webinar-card-hover"
                                    : "webinar-card"
                            }
                            onClick={() => navigate(`/view-webinar/${webinar._id}`)}
                        >
                            <img className="webinar-img" src={webinar.webinarPhoto} alt="webinar" />

                            <div className="webinar-details-div">
                                <p className="webinar-title">{webinar.title}</p>
                            </div>

                            <div className="webinar-icon-detail-div">
                                <img className="webinar-icon" src={blueCalendar} alt="calendar" />
                                <p className="webinar-detail">
                                    {new Date(webinar.date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>

                            <div className="webinar-icon-detail-div">
                                <img className="webinar-icon" src={blueClock} alt="clock" />
                                <p className="webinar-detail">
                                    {webinar.endTime
                                        ? `${formatTo12Hour(webinar.startTime)} - ${formatTo12Hour(webinar.endTime)}`
                                        : `${formatTo12Hour(webinar.startTime)} onwards`}
                                </p>
                            </div>

                            <div className="webinar-icon-detail-div">
                                <img className="webinar-icon" src={blueLevel} alt="level" />
                                <p className="webinar-detail">{webinar.level}</p>
                            </div>

                            <div className="webinar-icon-detail-div">
                                <img className="webinar-icon" src={blueLanguage} alt="language" />
                                <p className="webinar-detail">{webinar.language}</p>
                            </div>

                            <div className="webinar-seats-div">
                                {(isAlreadyBooked || isFullyBooked) && (
                                    <div
                                        className={
                                            isAlreadyBooked
                                                ? "already-booked"
                                                : isFullyBooked
                                                    ? "fully-booked"
                                                    : ""
                                        }
                                    >
                                        {isAlreadyBooked
                                            ? "Seat booked ✅"
                                            : "Fully Booked"}
                                    </div>
                                )}
                                {webinar.totalSeats != null && (
                                    <p className="limited-seats-text">*Limited seats</p>
                                )}
                            </div>

                            {webinar.totalSeats != null && (
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <button
                                        className="webinar-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (user) {
                                                navigate(`/view-webinar/${webinar._id}`, {
                                                    state: { openBookingForm: true },
                                                });
                                            } else {
                                                navigate("/login");
                                            }
                                        }}
                                    >
                                        Book seats
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    )
}

export default SimilarWebinars;