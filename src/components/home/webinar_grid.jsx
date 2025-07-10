import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth_context";
import "../css_files/home/webinar_grid.css";

function WebinarGrid() {
    const [webinars, setWebinars] = useState([]);
    const [fullyBookedWebinars, setFullyBookedWebinars] = useState([]);
    const navigate = useNavigate();
    const {authToken} = useAuth();

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
        const fetchWebinars = async () => {
            try {
                const webinarResponse = await axios.get("http://localhost:3000/api/webinar/home-webinars");
                const webinarsData = webinarResponse.data;
                setWebinars(webinarsData);

                const fullyBooked = [];

                for (const webinar of webinarsData) {
                    if (webinar.totalSeats === null) continue;

                    const fullBookingResponse = await axios.get(
                        `http://localhost:3000/api/webinar/check-full-booking/${webinar._id}`
                    );

                    const isFullyBooked = fullBookingResponse?.data?.full;
                    if (isFullyBooked) {
                        fullyBooked.push(webinar);
                    }
                }

                setFullyBookedWebinars(fullyBooked);
            } catch (error) {
                console.error("Error fetching webinars:", error);
            }
        };

        fetchWebinars();
    }, []);

    return (
        <div className="webinars-div">
            {webinars.map((webinar) => {
                const isFullyBooked = fullyBookedWebinars.some(fb => fb._id === webinar._id);

                return (
                    <div
                        key={webinar._id}
                        className={
                            webinar.totalSeats != null && !isFullyBooked
                                ? "webinar-card-hover"
                                : "webinar-card"
                        }
                        onClick={() => navigate(`/webinar-details/${webinar._id}`)}
                    >
                        <img className="webinar-img" src={webinar.webinarPhoto} alt="webinar" />

                        <div className="webinar-details-div">
                            <p className="webinar-title">{webinar.title}</p>
                        </div>

                        <div className="webinar-icon-detail-div">
                            <img className="webinar-icon" src="src/assets/grey_calendar.png" alt="calendar" />
                            <p className="webinar-detail">
                                {new Date(webinar.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        <div className="webinar-icon-detail-div">
                            <img className="webinar-icon" src="src/assets/grey_clock.png" alt="clock" />
                            <p className="webinar-detail">
                                {webinar.endTime
                                    ? `${formatTo12Hour(webinar.startTime)} - ${formatTo12Hour(webinar.endTime)}`
                                    : `${formatTo12Hour(webinar.startTime)} onwards`}
                            </p>
                        </div>

                        <div className="webinar-seats-div">
                            {isFullyBooked && <div className="fully-booked">Fully Booked</div>}
                            {webinar.totalSeats != null && <p className="limited-seats-text">*Limited seats</p>}
                        </div>

                        {webinar.totalSeats != null && (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button
                                    className="webinar-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (authToken) {
                                            navigate(`/webinar-details/${webinar._id}`, {
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
    );
}

export default WebinarGrid;
