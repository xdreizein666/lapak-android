import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

type RealTimeCounterProps = {
    endValue: number;
    duration?: number;
    className?: string;
};

export function RealTimeCounter({
    endValue,
    duration = 2000,
    className = "",
}: RealTimeCounterProps) {
    const [count, setCount] = useState(0);
    const startValue = useRef(0);
    const startTime = useRef<number | null>(null);
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        startValue.current = count;
        startTime.current = null;

        const animate = (timestamp: number) => {
            if (!startTime.current) startTime.current = timestamp;
            const progress = timestamp - startTime.current;
            const percentage = Math.min(progress / duration, 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - percentage, 4);

            const nextCount = Math.floor(startValue.current + (endValue - startValue.current) * ease);
            setCount(nextCount);

            if (percentage < 1) {
                requestRef.current = requestAnimationFrame(animate);
            } else {
                setCount(endValue);
            }
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
        };
    }, [endValue, duration]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={className}
        >
            {count.toLocaleString()}
        </motion.div>
    );
}
