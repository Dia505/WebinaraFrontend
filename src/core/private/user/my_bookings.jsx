import axios from "axios";
import { useEffect, useState } from "react";
const VITE_API_URL = import.meta.env.VITE_API_URL;

import BookingCard from "../../../components/my_bookings/booking_card";
import NavBar from "../../../components/navigation/nav_bar";
import UserSideBar from "../../../components/navigation/user_side_bar";
import "../../css_files/private/user/my_bookings.css";

function MyBookings() {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("upcoming");

    useEffect(() => {
        const fetchUpcomingBookings = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/api/booking/upcoming`,
                    {
                        withCredentials: true,
                    }
                );
                setUpcomingBookings(response.data);
            } catch (error) {
                console.error("Error fetching upcoming bookings:", error);
            }
        };

        fetchUpcomingBookings();
    }, []);

    useEffect(() => {
        const fetchPastBookings = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/api/booking/past`,
                    {
                        withCredentials: true,
                    }
                );
                setPastBookings(response.data);
            } catch (error) {
                console.error("Error fetching past bookings:", error);
            }
        };

        fetchPastBookings();
    }, []);

    return (
        <>
            <div className="my-bookings-main-window">
                <div className="my-bookings-nav-bar-div">
                    <NavBar />
                </div>

                <div className="my-bookings-side-bar-content-div">
                    <UserSideBar />

                    <div className="my-bookings-main-section">
                        <p className="my-bookings-title">My Bookings</p>

                        <div className="my-bookings-filter-div">
                            <p
                                className={`my-bookings-filter-btn ${selectedFilter === "upcoming" ? "my-bookings-filter-btn-selected" : ""}`}
                                onClick={() => setSelectedFilter("upcoming")}
                            >
                                Upcoming
                            </p>

                            <p
                                className={`my-bookings-filter-btn ${selectedFilter === "past" ? "my-bookings-filter-btn-selected" : ""}`}
                                onClick={() => setSelectedFilter("past")}
                            >
                                Past
                            </p>
                        </div>

                        <div className="my-bookings-list">
                            {selectedFilter === "upcoming" ? (
                                upcomingBookings.map((webinar) => (
                                    <BookingCard
                                        key={webinar?._id}
                                        webinarPhoto={webinar?.webinarDetails?.webinarPhoto}
                                        level={webinar?.webinarDetails?.level}
                                        language={webinar?.webinarDetails?.language}
                                        date={webinar?.webinarDetails?.date}
                                        startTime={webinar?.webinarDetails?.startTime}
                                        endTime={webinar?.webinarDetails?.endTime}
                                        title={webinar?.webinarDetails?.title}
                                        hostFullName={webinar?.webinarDetails?.hostFullName}
                                    />
                                ))
                            ) : (
                                pastBookings.map((webinar) => (
                                    <BookingCard
                                        key={webinar?._id}
                                        webinarPhoto={webinar?.webinarDetails?.webinarPhoto}
                                        level={webinar?.webinarDetails?.level}
                                        language={webinar?.webinarDetails?.language}
                                        date={webinar?.webinarDetails?.date}
                                        startTime={webinar?.webinarDetails?.startTime}
                                        endTime={webinar?.webinarDetails?.endTime}
                                        title={webinar?.webinarDetails?.title}
                                        hostFullName={webinar?.webinarDetails?.hostFullName}

                                    />
                                ))
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default MyBookings;