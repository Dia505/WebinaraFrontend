import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CategoryGrid from "../../components/home/category_grid";
import HomeTestimonialsSlideshow from "../../components/home/home_testimonials_slideshow";
import WebinarGrid from "../../components/home/webinar_grid";
import NavBar from "../../components/navigation/nav_bar";
import Footer from "../../components/navigation/footer";
import "../css_files/public/home.css";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/explore/${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <>
            <div className="home-main-window">
                <NavBar />

                <div className="home-top-section">
                    <img className="home-img" src="src\assets\home.png" />

                    <div className="home-title-div">
                        <p className="home-title">Where Experts Share. And You Level Up.</p>

                        <p className="home-subtitle">Join interactive, expert-led sessions across design, business, technology, wellness, personal development,
                            and more, all from the comfort of your screen. Whether you're looking to upgrade your skills,
                            explore a new passion, or simply learn something new, Webinara brings real-time learning experiences directly to you - anytime, anywhere.
                        </p>

                        <div>
                            <input
                                className="home-search-bar"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSearch();
                                }}
                            />
                            <img className="home-search-icon" src="src\assets\search_icon.png" onClick={handleSearch} />
                        </div>
                    </div>
                </div>

                <div className="home-webinar-div">
                    <p className="home-webinar-text">Upcoming webinars</p>
                    <WebinarGrid />
                </div>

                <div className="home-webinar-div">
                    <p className="home-webinar-text">Search by category</p>
                    <CategoryGrid />
                </div>

                <div className="home-about-testimonial-div">
                    <div className="home-about-div">
                        <img className="home-about-img" src="src\assets\home_about.png" />
                        <div className="home-about-texts-div">
                            <p className="home-about-title">Webinara is your gateway to live learning</p>
                            <p className="home-about-subtitle">Webinara is a real-time learning platform built to bridge the gap between
                                passionate learners and industry experts. Designed to host high-quality, interactive webinars across fields like design,
                                business, and technology, Webinara makes professional knowledge accessible and engaging. From hosting live sessions to discovering
                                new skills, it empowers individuals and communities to connect, teach, and grow — all within a seamless online experience.
                            </p>
                        </div>
                    </div>

                    <div className="home-testimonials-div">
                        <div className="home-testimonials-text-div">
                            <p className="home-testimonials-title">Testimonials</p>
                            <p className="home-testimonials-subtitle">Shared experiences from learners and hosts who’ve discovered, taught, and grown with Webinara</p>
                        </div>

                        <HomeTestimonialsSlideshow />
                    </div>
                </div>

                <Footer/>
            </div>
        </>
    )
}

export default Home;