export const timing = { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const;
export const fadeIn = { hidden: { opacity: 0 }, show: { opacity: 1, transition: timing } };
export const slideUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: timing } };
export const slideLeft = { hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0, transition: timing } };
export const slideRight = { hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0, transition: timing } };
export const scaleIn = { hidden: { opacity: 0, scale: 0.98 }, show: { opacity: 1, scale: 1, transition: timing } };
export const staggerContainer = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };


