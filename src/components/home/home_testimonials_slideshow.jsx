import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "../css_files/home/home_testimonials_slideshow.css";

const testimonials = [
    {
        text: `Webinara helped me find workshops that actually fit my career path. 
        I’ve attended three sessions already, and each one gave me practical skills I could apply right away. 
        It's now part of my learning routine.`,
        name: "Priya Kandel",
        img: "src/assets/home_testimonial_user1.jpg",
    },
    {
        text: `I stumbled across Webinara while looking for a UX design session, and it’s honestly the best discovery I've made this year. 
        The quality of the speakers and ease of booking is top-notch. It just works.`,
        name: "Aarav Joshi",
        img: "src/assets/home_testimonial_user2.jpg",
    },
    {
        text: `As a freelance educator, Webinara gave me a space to share my expertise without the hassle of organizing everything myself. 
        The platform made hosting seamless, and the audience engagement was incredible.`,
        name: "Maya Acharya",
        img: "src/assets/home_testimonial_user3.png",
    },
];

function HomeTestimonialsSlideshow() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const current = testimonials[currentIndex];

    return (
        <div className="home-testimonial-div">
            <div className="home-testimonial-inner-div">
                <p className="home-testimonial-text">{current.text}</p>

                <div className="home-testimonial-user-div">
                    <img className="home-testimonial-user-img" src={current.img} />
                    <p className="home-testimonial-user-name">{current.name}</p>
                </div>
            </div>

            <div className="home-testimonial-arrow-main-div">
                <div className="home-testimonial-arrow-div" onClick={handlePrev}>
                    <FontAwesomeIcon className="home-testimonial-arrow" icon={faChevronLeft} />
                </div>

                <div className="home-testimonial-arrow-div" onClick={handleNext}>
                    <FontAwesomeIcon className="home-testimonial-arrow" icon={faChevronRight} />
                </div>
            </div>
        </div>
    );
}

export default HomeTestimonialsSlideshow;
