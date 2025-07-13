import calendarIcon from "../../assets/blue_calendar.png";
import clockIcon from "../../assets/blue_clock.png";
import levelIcon from "../../assets/blue_level.png";
import languageIcon from "../../assets/blue_language.png";
import "../css_files/my_bookings/booking_card.css";

function BookingCard({ webinarPhoto, title, level, language, date, startTime, endTime, hostFullName }) {
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
            <div className="booking-card-main-div">
                <img className="booking-card-img" src={webinarPhoto} />

                <div className="booking-card-details-div">
                    <p className="booking-card-event-title">{title}</p>

                    <div className="booking-card-location-date-time-div">

                        <div className="booking-card-icon-detail-div">
                            <img className="booking-card-icon" src={calendarIcon} />
                            <p className="booking-card-detail">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>

                        <div className="booking-card-icon-detail-div">
                            <img className="booking-card-icon" src={clockIcon} />
                            <p className="booking-card-detail">{endTime
                                ? `${formatTo12Hour(startTime)} - ${formatTo12Hour(endTime)}`
                                : `${formatTo12Hour(startTime)} onwards`}</p>
                        </div>

                        <div className="booking-card-icon-detail-div">
                            <img className="booking-card-icon" src={levelIcon} />
                            <p className="booking-card-detail">{level}</p>
                        </div>

                        <div className="booking-card-icon-detail-div">
                            <img className="booking-card-icon" src={languageIcon} />
                            <p className="booking-card-detail">{language}</p>
                        </div>
                    </div>

                    <p className="booking-card-seats">Hosted by {hostFullName}</p>
                </div>
            </div>
        </>
    )
}

export default BookingCard;