import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const VITE_API_URL = import.meta.env.VITE_API_URL;

import noWebinars from "../../../assets/no_webinars.png";
import AdminSideBar from "../../../components/navigation/admin_side_bar";
import CreateWebinarForm from "../../../components/webinars/create_webinar_form";
import Insights from "../../../components/webinars/insights";
import WebinarCard from "../../../components/webinars/webinar_card";
import "../../css_files/private/admin/webinars.css";

function Webinars() {
    const [webinars, setWebinars] = useState([]);
    const [showCreateWebinarForm, setShowCreateWebinarForm] = useState(false);
    const [showInsights, setShowInsights] = useState(false);
    const [selectedWebinarForInsights, setSelectedWebinarForInsights] = useState(null);

    const handleInsightsClick = (webinar) => {
        setSelectedWebinarForInsights(webinar);
        setShowInsights(true);
    };

    const location = useLocation();

    useEffect(() => {
        const fetchWebinars = async () => {
            try {
                const response = await axios.get(`${VITE_API_URL}/api/webinar`,
                    {
                        withCredentials: true
                    }
                );
                setWebinars(response.data);
            } catch (error) {
                console.error("Failed to fetch webinars:", error);
            }
        };

        fetchWebinars();
    }, []);

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