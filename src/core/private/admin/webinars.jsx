import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../context/auth_context";

import noWebinars from "../../../assets/no_webinars.png";
import CreateWebinarForm from "../../../components/webinars/create_webinar_form";
import Insights from "../../../components/webinars/insights";
import AdminSideBar from "../../../components/navigation/admin_side_bar";
import WebinarCard from "../../../components/webinars/webinar_card";
import "../../css_files/private/admin/webinars.css";

function Webinars() {
    const [webinars, setWebinars] = useState([]);
    const { authToken } = useAuth();
    const [showCreateWebinarForm, setShowCreateWebinarForm] = useState(false);
    const [showInsights, setShowInsights] = useState(false);
    const [selectedWebinarForInsights, setSelectedWebinarForInsights] = useState(null);

    const handleInsightsClick = (webinar) => {
        setSelectedWebinarForInsights(webinar);
        setShowInsights(true);
    };

    const decoded = jwtDecode(authToken);
    const adminId = decoded._id || decoded.id;

    const location = useLocation();

    useEffect(() => {
        const fetchWebinars = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/webinar`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    }
                );
                setWebinars(response.data);
            } catch (error) {
                console.error("Failed to fetch webinars:", error);
            }
        };

        fetchWebinars();
    }, [adminId]);

    useEffect(() => {
        if (location.state?.openCreateWebinarForm) {
            setShowCreateWebinarForm(true);
            window.history.replaceState({}, '');
        }
    }, [location.key]);

    return (
        <>
            <div className="webinars-main-window">
                <div className="webinars-side-bar">
                    <AdminSideBar />
                </div>

                <div className="webinars-main-div">
                    <div className="webinars-title-create-div">
                        <p className="webinars-title">Webinars</p>
                        <button className="webinars-create-event-btn" onClick={() => setShowCreateWebinarForm(true)}>Create webinar +</button>
                    </div>

                    <div className="webinars-grid">
                        {webinars.length > 0 ? (
                            webinars.map((webinar) => (
                                <WebinarCard
                                    key={webinar._id}
                                    webinarPhoto={webinar.webinarPhoto}
                                    title={webinar.title}
                                    date={webinar.date}
                                    startTime={webinar.startTime}
                                    endTime={webinar.endTime}
                                    level={webinar.level}
                                    language={webinar.language}
                                    totalSeats={webinar.totalSeats}
                                    _id={webinar._id}
                                    onInsightsClick={() => handleInsightsClick(webinar)}
                                />
                            ))
                        ) :
                            (
                                <div className="no-webinars-div">
                                    <img className="no-webinars-img" src={noWebinars} />
                                    <p className="no-webinars-text">No webinars at the moment</p>
                                </div>

                            )

                        }
                    </div>

                    {showCreateWebinarForm && (
                        <>
                            <div className="webinars-overlay" onClick={() => setShowCreateWebinarForm(false)}></div>
                            <div className="webinars-form-modal">
                                <CreateWebinarForm closeForm={() => setShowCreateWebinarForm(false)} />
                            </div>
                        </>
                    )}

                    {showInsights && selectedWebinarForInsights && (
                        <>
                            <div className="webinars-overlay" onClick={() => setShowInsights(false)}></div>
                            <div className="webinars-form-modal2">
                                <Insights webinar={selectedWebinarForInsights} closeForm={() => setShowInsights(false)} />
                            </div>
                        </>
                    )}

                </div>
            </div>
        </>
    )
}

export default Webinars;