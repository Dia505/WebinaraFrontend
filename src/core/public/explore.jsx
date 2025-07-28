import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
const VITE_API_URL = import.meta.env.VITE_API_URL;

import noResultsImg from "../../assets/no_search_result.png";
import searchIcon from "../../assets/search_icon.png";
import ExploreWebinarGrid from "../../components/explore/explore_webinar_grid";
import Footer from "../../components/navigation/footer";
import NavBar from "../../components/navigation/nav_bar";
import "../css_files/public/explore.css";

function Explore() {
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("");
    const [dateRange, setDateRange] = useState("");
    const [level, setLevel] = useState("");
    const [language, setLanguage] = useState("");
    const [webinars, setWebinars] = useState([]);
    const [fullyBookedWebinars, setFullyBookedWebinars] = useState([]);
    const [alreadyBookedWebinars, setAlreadyBookedWebinars] = useState([]);

    const { query } = useParams();
    const [searchParams] = useSearchParams();
    const categoryFromQuery = searchParams.get("category");

    useEffect(() => {
        if (categoryFromQuery) {
            setCategory(categoryFromQuery);
        }
    }, [categoryFromQuery]);

    useEffect(() => {

        if (!categoryFromQuery) {
            const fetchWebinars = async () => {
                try {
                    const webinarResponse = await axios.get(`${VITE_API_URL}/api/webinar/home-webinars`);
                    const webinarsData = webinarResponse.data;
                    setWebinars(webinarsData);

                    const fullyBooked = [];

                    for (const webinar of webinarsData) {
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

                    for (const webinar of webinarsData) {
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
                    console.error("Error fetching webinars:", error);
                }
            };
            fetchWebinars();
        }
    }, [categoryFromQuery]);

    useEffect(() => {
        const fetchFilteredEvents = async () => {
            try {
                const params = new URLSearchParams();
                if (category) params.append("category", category);
                if (level) params.append("level", level);
                if (language) params.append("language", language);
                if (dateRange) params.append("dateRange", dateRange);

                const response = await axios.get(`${VITE_API_URL}/api/webinar/filter?${params.toString()}`);
                setWebinars(response.data);
            } catch (error) {
                console.error("Error fetching filtered webinars:", error);
            }
        };

        if (category || level || language || dateRange) {
            fetchFilteredEvents();
        }
    }, [category, level, language, dateRange]);

    useEffect(() => {
        if (query) {
            setSearchQuery(query);
            handleSearch(query);
        }
    }, [query]);

    const handleSearch = async (customQuery) => {
        const q = (customQuery ?? searchQuery).trim();
        if (!q) return;

        try {
            const response = await axios.get(`${VITE_API_URL}/api/webinar/search?query=${encodeURIComponent(q)}`);
            setWebinars(response.data);
        } catch (error) {
            console.error("Search failed:", error);
        }
    };

    return (
        <div className="explore-main-window">
            <NavBar />

            <div className="search-bar-div">
                <p className="explore-title">Explore</p>
                <p className="explore-subtitle">Find webinars that match your interests and goals.</p>
                <div>
                    <input
                        className="explore-search-bar"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                    />
                    <img
                        className="explore-search-icon"
                        src={searchIcon}
                        onClick={handleSearch}
                        alt="Search"
                    />
                </div>
            </div>

            <div className="explore-bottom-div">
                <div className="explore-filter-div">
                    <div className="explore-filter-level1">
                        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                            <option value="" disabled hidden>Select a time frame</option>
                            <option value="today">Today</option>
                            <option value="this-week">This week</option>
                            <option value="next-7-days">Next 7 days</option>
                            <option value="this-month">This month</option>
                        </select>

                        <select value={level} onChange={(e) => setLevel(e.target.value)}>
                            <option value="" disabled hidden>Choose a level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>

                        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <option value="" disabled hidden>Choose a language</option>
                            <option value="English">English</option>
                            <option value="Nepali">Nepali</option>
                            <option value="Hindi">Hindi</option>
                        </select>
                    </div>

                    <div className="explore-filter-level2">
                        {[
                            "Business", "Technology", "Design", "Health",
                            "Education", "Career", "Finance", "Marketing",
                            "Lifestyle", "Creative"
                        ].map((cat) => (
                            <div
                                key={cat}
                                className={`explore-category-card ${category === cat ? 'selected' : ''}`}
                                onClick={() => setCategory(cat)}
                            >
                                <p className="explore-category-title">{cat}</p>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="explore-webinar-grid-div">
                    {webinars.length === 0 ? (
                        <div className="no-results-div">
                            <img className="no-results-img" src={noResultsImg} />
                            <p className="no-results-message">Looks like there’s nothing here right now. Try something else!</p>
                        </div>
                    ) : (
                        <ExploreWebinarGrid webinars={webinars} fullyBookedWebinars={fullyBookedWebinars} alreadyBookedWebinars={alreadyBookedWebinars} />
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Explore;
