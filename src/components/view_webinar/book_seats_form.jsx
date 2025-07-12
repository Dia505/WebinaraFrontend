import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth_context";

import calendar from "../../assets/calendar.png";
import clock from "../../assets/clock.png";
import levelIcon from "../../assets/level.png";
import languageIcon from "../../assets/language.png";
import loading from "../../assets/loading.gif";
import "../css_files/view_webinar/book_seats_form.css";

function BookSeatsForm({ webinarId, webinarPhoto, title, level, language, date, startTime, endTime, fullName, mobileNumber, email, closeForm }) {
    const { authToken } = useAuth();
    const { handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);

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

    const onSubmit = async (data) => {
        setIsLoading(true);

        const bookingData = {
            webinarId: webinarId
        };

        try {
            const response = await fetch("http://localhost:3000/api/booking",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bookingData),
                }
            );

            toast.success("Booking successful! We've sent you a confirmation email.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });

            closeForm();
        } catch (err) {
            console.error("Error booking seats:", err);
            toast.error("Failed to book seats");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="booking-form-main-div">
                    <div className="booking-form-top-div">
                        <img className="booking-form-img" src={webinarPhoto} />

                        <div className="booking-form-event-details-div">
                            <p className="booking-form-close-btn" onClick={closeForm}>X</p>

                            <div className="booking-form-title-div">
                                <p className="booking-form-title">{title}</p>
                            </div>

                            <div className="booking-form-details-container">
                                <div className="booking-form-icon-detail-div">
                                    <img className="booking-form-icon" src={calendar} />
                                    <p className="booking-form-detail">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>

                                <div className="booking-form-icon-detail-div">
                                    <img className="booking-form-icon" src={clock} />
                                    <p className="booking-form-detail">{endTime
                                        ? `${formatTo12Hour(startTime)} - ${formatTo12Hour(endTime)}`
                                        : `${formatTo12Hour(startTime)} onwards`}</p>
                                </div>

                                <div className="booking-form-icon-detail-div">
                                    <img className="booking-form-icon" src={levelIcon} />
                                    <p className="booking-form-detail">{level}</p>
                                </div>

                                <div className="booking-form-icon-detail-div">
                                    <img className="booking-form-icon" src={languageIcon} />
                                    <p className="booking-form-detail">{language}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="booking-form-bottom-div">
                        <div className="booking-form-explorer-details-div">
                            <div>
                                <p>Full name</p>
                                <input
                                    type='text'
                                    value={fullName}
                                    disabled
                                />
                            </div>

                            <div>
                                <p>Mobile number</p>
                                <input
                                    type='text'
                                    value={mobileNumber}
                                    disabled
                                />
                            </div>

                            <div>
                                <p>Email address</p>
                                <input
                                    type='text'
                                    value={email}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="booking-form-btn-div">
                            {isLoading
                                ? <img src={loading} className="book-form-loading" />
                                : <button type="submit" className="booking-form-button">Book a seat</button>
                            }
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default BookSeatsForm;