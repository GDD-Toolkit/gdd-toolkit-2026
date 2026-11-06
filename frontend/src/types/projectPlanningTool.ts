export type Bullet = {
    text: string;
    image?: string;
    sub_bullets: Bullet[];
};

export type ProjectPlanningTool = {
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


