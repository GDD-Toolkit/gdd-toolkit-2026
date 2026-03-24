import "./ToolModal.css";

type Bullet = {
    text: string;
    image?: string;
    sub_bullets: Bullet[];
};

type ProjectPlanningTool = {
    name: string;
    type: string[];
    time: string[];
    image: string;
    learning_obj: Bullet[];
    characteristics: Bullet[];
    process: Bullet[];
    benefits: Bullet[];
    drawbacks: Bullet[];
    example: Bullet[];
    resources: Bullet[];
    use_case_video?: string;
    slideshow?: string;
    evaluation: Bullet[];
};

export default function ToolModal({
    tool,
    onClose,
}: {
    tool: ProjectPlanningTool;
    onClose: () => void;
}) {
    const typeColors: Record<string, string> = {
        "Six Sigma": "#dbeafe",          // light blue
        "Process Mapping": "#fef3c7",    // light yellow
        "Decision Making": "#fce7f3",    // light pink
        "User-Centric": "#d1fae5",       // light green
        "Efficiency/Innovation": "#fff7ed", // light orange
        "Quality Management": "#ede9fe"  // light purple
    };    

    const timeColors: Record<string, string> = {
        "Short-term": "#dcfce7",
        "Long-term": "#fee2e2",
    };

    return (
        <div className="tool-modal-overlay">
            <div className="tool-modal">
                {/* Header */}
                <div className="modal-header">
                    <button className="back-button" onClick={onClose}>
                        ← Back
                    </button>
                    <h2 className="modal-title">{tool.name}</h2>
                </div>

                {/* Image */}
                <img src={tool.image} alt={tool.name} className="modal-main-image" />

                {/* Keywords */}
                <div className="modal-section modal-card">
                    <h3>Keywords</h3>
                    <div className="keywords-wrapper">
                        {tool.type.map((ty) => (
                                <span
                                    key={ty}
                                    className="tool-badge"
                                    style={{ backgroundColor: typeColors[ty] }}
                                >
                                    {ty}
                                </span>
                            ))}

                            {tool.time.map((ti) => (
                                <span
                                    key={ti}
                                    className="tool-badge"
                                    style={{ backgroundColor: timeColors[ti] }}
                                >
                                    {ti}
                                </span>
                            ))}
                    </div>
                </div>

                {/* Learning Obj + Characteristics */}
                <div className="modal-grid-2">
                    <div className="modal-card">
                        <h3>Learning Objectives</h3>
                        <BulletList bullets={tool.learning_obj} />
                    </div>
                    <div className="modal-card">
                        <h3>Characteristics</h3>
                        <BulletList bullets={tool.characteristics} />
                    </div>
                </div>

                {/* Process */}
                <div className="modal-section modal-card">
                    <h3>Process</h3>
                    <BulletList bullets={tool.process} />
                </div>

                {/* Benefits + Drawbacks */}
                <div className="modal-grid-2">
                    <div className="modal-card">
                        <h3>Benefits</h3>
                        <BulletList bullets={tool.benefits} />
                    </div>
                    <div className="modal-card">
                        <h3>Drawbacks</h3>
                        <BulletList bullets={tool.drawbacks} />
                    </div>
                </div>

                {/* Example */}
                <div className="modal-section modal-card">
                    <h3>Example</h3>
                    <BulletList bullets={tool.example} />
                </div>

                {/* Resources + Use Case Video */}
                <div className="modal-grid-2">
                    <div className="modal-card">
                        <h3>Resources</h3>
                        <BulletList bullets={tool.resources} isLink={true} />
                    </div>
                    <div className="modal-card">
                        <h3>Use Case Video / Slideshow</h3>
                        {tool.use_case_video ? (
                            tool.use_case_video.endsWith(".mp4") ? (
                                <video
                                    src={tool.use_case_video}
                                    controls
                                    className="modal-video"
                                />
                            ) : (
                                <iframe
                                    className="modal-video"
                                    src={tool.use_case_video}
                                    title="Tool Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            )
                        ) : tool.slideshow ? (
                            <iframe
                                className="modal-video"
                                src={tool.slideshow}
                                title="Tool Slideshow"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <p style={{ textAlign: "center", color: "#6b7280" }}>
                                No video or slideshow available.
                            </p>
                        )}
                    </div>
                </div>

                {/* Evaluation */}
                <div className="modal-section modal-card">
                    <h3>Evaluation</h3>
                    <BulletList bullets={tool.evaluation} />
                </div>
            </div>
        </div>
    );
}

function BulletList({ bullets, isLink }: { bullets: Bullet[], isLink?: boolean }) {
    // Recursive function to render bullets and all nested sub-bullets
    const renderBullet = (b: Bullet) => (
        <>
            {/* Bullet text */}
            {isLink ? (
                <a href={b.text} target="_blank" rel="noopener noreferrer">
                    {b.text}
                </a>
            ) : (
                b.text
            )}

            {/* Recursive sub-bullets */}
            {b.sub_bullets.length > 0 && (
                <ul className="sub-bullet-list">
                    {b.sub_bullets.map((sb, j) => (
                        <li key={j}>
                            {renderBullet(sb)}
                        </li>
                    ))}
                </ul>
            )}

            {/* Image after all nested sub-bullets */}
            {b.image && (
                <img
                    src={b.image}
                    alt="Bullet illustration"
                    style={{
                        display: "block",
                        marginTop: "0.5rem",
                        maxWidth: "100%",
                        borderRadius: "0.5rem",
                    }}
                />
            )}
        </>
    );

    return (
        <ul className="bullet-list">
            {bullets.map((b, i) => (
                <li key={i}>
                    {renderBullet(b)}
                </li>
            ))}
        </ul>
    );
}