import { useRef, useState } from "react";
import { motion, easeOut } from "framer-motion";
import "./Podcast.css";

const DesignUser: React.FC = () => {
    const bannerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
    };

    const simulationRef = useRef<HTMLHeadingElement>(null);

    const episodes = [
        { number: 1, date: "2025-12-08", url: "/assets/The_Development_Lens_EP1.mp3" },
    ];
    
    const [minEp, setMinEp] = useState<number | "">( "");
    const [maxEp, setMaxEp] = useState<number | "">( "");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    
    const filteredEpisodes = episodes.filter(ep => {
        const episodeOk =
            (minEp === "" || ep.number >= minEp) &&
            (maxEp === "" || ep.number <= maxEp);
    
        const dateOk =
            (!startDate || ep.date >= startDate) &&
            (!endDate || ep.date <= endDate);
    
        return episodeOk && dateOk;
    });
    

    return (
        <div className="page-container">
            <header className="mission-banner">
                <div className="header-flex">
                    <motion.h1
                        className="mission-title"
                        initial="hidden"
                        animate="visible"
                        variants={bannerVariants}
                    >
                        Podcast
                    </motion.h1>
                </div>
            </header>

            {/* --- Section 1: Podcat image + Summary --- */}
            <section className="content-section">
                <div className="content-card principles-summary-flex">
                    <h2 ref={simulationRef} className="principles-summary-title">The Development Lens</h2>

                    <div className="principles-summary-content">
                    <div className="principles-summary-image-wrapper">
                        <img
                        src="/assets/images/developmentlens.png"
                        alt="Design Principles Summary"
                        className="principles-summary-image"
                        />
                    </div>

                    <div className="principles-summary-text-wrapper">
                        <p className="principles-summary-text">
                        Welcome to <b> The Development Lens</b>, a podcast created by students in the FIRE Global Development & Design stream, exploring how ethical, sustainable, and human-centered choices shape real-world projects. In each episode, you’ll hear thoughtful conversations with our student team, our faculty mentor, and partners working in communities across Africa and the Philippines as we test and refine our Development Ethics Toolkit in relation to the United Nations Sustainable Development Goals (SDGs). We unpack case studies, share behind-the-scenes stories from our independent research projects, and reflect honestly on what works well, what is challenging, and how we can improve as future practitioners. By the end of each episode, you will not only understand what our toolkit is and how it functions, but also hear how it can help development practitioners connect their work to the SDGs, ask better questions, make more ethical decisions, and ultimately design projects that focus on pro-development and center the people they are meant to serve.
                        </p>
                    </div>
                    </div>
                </div>
            </section>

            {/* --- Section 2: Episodes --- */}
            <section className="content-section">
                <div className="content-card">
                    <h2 className="principles-summary-title">Episodes</h2>

                    {/* Filters */}
                    <div className="episode-filters">
                        <div>
                            <label>Episode # Range:</label>
                            <div className="filter-row">
                                <input
                                type="number"
                                min={1}
                                placeholder="Min"
                                value={minEp}
                                onChange={e =>
                                    setMinEp(e.target.value === "" ? "" : Number(e.target.value))
                                }
                                />

                                <input
                                type="number"
                                min={1}
                                placeholder="Max"
                                value={maxEp}
                                onChange={e =>
                                    setMaxEp(e.target.value === "" ? "" : Number(e.target.value))
                                }
                                />

                            </div>
                        </div>

                        <div>
                            <label>Date Range:</label>
                            <div className="filter-row">
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Episodes List */}
                    <div className="episode-list">
                        {filteredEpisodes.map((ep) => (
                            <div key={ep.number} className="episode-item">
                                <div>
                                    <b>{ep.number}.</b> {ep.date}
                                </div>
                                <audio controls src={ep.url}></audio>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <br></br>
        </div>
    );
};

export default DesignUser;
