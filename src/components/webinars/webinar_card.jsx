import { useNavigate } from "react-router-dom";
import "../css_files/webinars/webinar_card.css";

function WebinarCard({ webinarPhoto, title, date, startTime, endTime, level, language, totalSeats, _id, onInsightsClick }) {
    const navigate = useNavigate();

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

    return (
        <>
            <div className="webinar-card-main-div">
                <img className="webinar-card-img" src={webinarPhoto} />

                <div>
                    <p className="webinar-card-title">{title}</p>

                    <div className="webinar-card-icon-detail-div">
                        <img className="webinar-card-icon" src="src\assets\blue_calendar.png" />
                        <p className="webinar-card-detail">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>

                    <div className="webinar-card-icon-detail-div">
                        <img className="webinar-card-icon" src="src\assets\blue_clock.png" />
                        <p className="webinar-card-detail">{endTime
                            ? `${formatTo12Hour(startTime)} - ${formatTo12Hour(endTime)}`
                            : `${formatTo12Hour(startTime)} onwards`}</p>
                    </div>

                    <div className="webinar-card-icon-detail-div">
                        <img className="webinar-card-icon" src="src/assets/blue_level.png" alt="level" />
                        <p className="webinar-card-detail">
                            {level}
                        </p>
                    </div>

                    <div className="webinar-card-icon-detail-div">
                        <img className="webinar-card-icon" src="src/assets/blue_language.png" alt="language" />
                        <p className="webinar-card-detail">
                            {language}
                        </p>
                    </div>

                    {totalSeats != null && <p className="limited-seats-text">*Limited seats</p>}
                </div>

                <div className="webinar-card-btns-div">
                    <button className="webinar-card-btn" onClick={() => navigate(`/webinar-details/${_id}`)}>Details</button>
                    {totalSeats != null && (
                        <button className="webinar-card-btn" onClick={onInsightsClick}>Insights</button>
                    )}
                </div>
            </div>
        </>
    )
}

export default WebinarCard;