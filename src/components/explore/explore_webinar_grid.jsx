import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth_context";
import "../css_files/explore/explore_webinar_grid.css";
import "../css_files/home/webinar_grid.css";
import greyCalendar from "../../assets/grey_calendar.png";
import greyClock from "../../assets/grey_clock.png";
import greyBarChart from "../../assets/grey_bar_chart.png";
import greyLanguage from "../../assets/grey_language.png"

function ExploreWebinarGrid({ webinars, fullyBookedWebinars }) {
    const navigate = useNavigate();
    const { authToken } = useAuth();

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

    console.log("Webinar list: ", webinars)

    return (
        <div className="explore-webinars-div">
            {webinars.map((webinar) => {
                const isFullyBooked = fullyBookedWebinars.some(fb => fb._id === webinar._doc?._id || webinar._id);

                return (
                    <div
                        key={webinar._doc?._id || webinar._id}
                        className={
                            webinar._doc?.totalSeats || webinar.totalSeats != null && !isFullyBooked
                                ? "webinar-card-hover"
                                : "webinar-card"
                        }
                        onClick={() => navigate(`/view-webinar/${webinar._doc?._id || webinar._id}`)}
                    >
                        <img className="webinar-img" src={webinar.webinarPhoto} alt="webinar" />

                        <div className="webinar-details-div">
                            <p className="webinar-title">{webinar._doc?.title || webinar.title}</p>
                        </div>

                        <div className="webinar-icon-detail-div">
                            <img className="webinar-icon" src={greyCalendar} alt="calendar" />
                            <p className="webinar-detail">
                                {new Date(webinar._doc?.date || webinar.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        <div className="webinar-icon-detail-div">
                            <img className="webinar-icon" src={greyClock} alt="clock" />
                            <p className="webinar-detail">
                                {webinar._doc?.endTime || webinar.endTime
                                    ? `${formatTo12Hour(webinar._doc?.startTime || webinar.startTime)} - ${formatTo12Hour(webinar._doc?.endTime || webinar.endTime)}`
                                    : `${formatTo12Hour(webinar._doc?.startTime || webinar.startTime)} onwards`}
                            </p>
                        </div>

                        <div className="webinar-icon-detail-div">
                            <img className="webinar-icon" src={greyBarChart} alt="level" />
                            <p className="webinar-detail">
                                {webinar._doc?.level || webinar.level}
                            </p>
                        </div>

                        <div className="webinar-icon-detail-div">
                            <img className="webinar-icon" src={greyLanguage} alt="language" />
                            <p className="webinar-detail">
                                {webinar._doc?.language || webinar.language}
                            </p>
                        </div>

                        <div className="webinar-seats-div">
                            {isFullyBooked && <div className="fully-booked">Fully Booked</div>}
                            {webinar._doc?.totalSeats || webinar.totalSeats != null && <p className="limited-seats-text">*Limited seats</p>}
                        </div>

                        {webinar._doc?.totalSeats || webinar.totalSeats != null && (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button
                                    className="webinar-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (authToken) {
                                            navigate(`/webinar-details/${webinar._doc?._id || webinar._id}`, {
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

export default ExploreWebinarGrid;
