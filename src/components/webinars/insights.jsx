import axios from "axios";
import { useEffect, useState } from "react";
import "../css_files/webinars/insights.css";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function Insights({ webinar, closeForm }) {
    const [totalBookingCount, setTotalBookingCount] = useState(0);
    const [bookingList, setBookingList] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/api/booking/webinar/${webinar?._id}`,
                    {
                        withCredentials: true,
                    }
                );
                const bookings = response.data;

                setBookingList(bookings);

                setTotalBookingCount(bookings.length);

            } catch (error) {
                console.error("Error fetching booking stats:", error);
            }
        };

        fetchBookings();
    }, [webinar?._id]);

    return (
        <>
            <div className="insights-main-div">
                <div className="insights-title-div">
                    <p className="insights-title">{webinar?.title}</p>
                    <p className="insights-close-btn" onClick={closeForm}>X</p>
                </div>

                <p>Total seats booked: {totalBookingCount}</p>

                <div className="insights-table-wrapper">
                    <table className="insights-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>City</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingList.map((booking, index) => {
                                const user = booking?.userId;
                                console.log(user);
                                return (
                                    <tr key={booking?._id}>
                                        <td>{index + 1}</td>
                                        <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <img
                                                src={user.profilePicture}
                                                alt="profile"
                                                className="insights-table-user-img"
                                            />
                                            {user.fullName}
                                        </td>
                                        <td>{user.mobileNumber}</td>
                                        <td>{user.email}</td>
                                        <td>{user.address}</td>
                                        <td>{user.city}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}

export default Insights;