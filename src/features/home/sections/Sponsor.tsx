'use client';

import React from 'react'
import Marquee from 'react-fast-marquee';
const Sponsor: React.FC = () => {
    const sponsors = [
        { image: "/images/Container-_1_.webp" },
        { image: "/images/Container-_2_.webp" },
        { image: "/images/Container-_3_.webp" },
        { image: "/images/Container.webp" },
        { image: "/images/Margin.webp" },
        { image: "/images/Margin-_1_.webp" },
    ]
    return (
        <div className="sponsor-section">
            <Marquee>

                {Array(50).fill(sponsors).flat().map((item, index) => (
                    <img key={index} src={item.image} alt="" className="sponsor-name" />
                ))}
            </Marquee>
        </div>
    );
}
export default Sponsor;