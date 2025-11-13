import { useEffect, useState } from "react";

interface Star {
  id: number;
  size: number;
  left: string;
  top: string;
  duration: string;
  delay: string;
}

export const Stars = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < 400; i++) {
      newStars.push({
        id: i,
        size: Math.random() * 2 + 0.5,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        duration: (Math.random() * 3 + 2) + 's',
        delay: Math.random() * 5 + 's',
      });
    }
    setStars(newStars);
  }, []);

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            width: star.size + 'px',
            height: star.size + 'px',
            left: star.left,
            top: star.top,
            animationDuration: star.duration,
            animationDelay: star.delay,
          }}
        />
      ))}
    </>
  );
};
