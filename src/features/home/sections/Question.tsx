'use client';

import { useState } from "react";

const Question = () => {
    const [faqs, setFaqs] = useState([
        { question: "What is an online golf lesson?", answer: "Hello", open: false },
        { question: "What is an online golf lesson?", answer: "Hello", open: false },
        { question: "What is an online golf lesson?", answer: "Hello", open: false },
    ]);
    const toggleFAQ = (index: number) => {
        setFaqs((prevFaqs) =>
            prevFaqs.map((faq, i) => ({
                ...faq,
                open: i === index ? !faq.open : false,
            }))
        );
    };
    return (
        <div className="question">
            <div className="question__container">
                <div className="title">
                    Câu hỏi thường gặp
                </div>
                {faqs.map((faq, index) => (
                    <div className="question__item" key={index} onClick={() => toggleFAQ(index)}>
                        <div className={`question ${faq.open ? "open" : ""}`} >
                            {faq.question}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12.0001 14.6764C11.8796 14.6764 11.7675 14.6572 11.6636 14.6187C11.5598 14.5802 11.4611 14.5142 11.3675 14.4206L6.87325 9.9264C6.73478 9.78795 6.66395 9.61391 6.66075 9.4043C6.65753 9.1947 6.72837 9.01746 6.87325 8.8726C7.01812 8.72771 7.19375 8.65527 7.40015 8.65527C7.60655 8.65527 7.78218 8.72771 7.92705 8.8726L12.0001 12.9457L16.0732 8.8726C16.2117 8.73413 16.3857 8.6633 16.5953 8.6601C16.8049 8.65688 16.9822 8.72771 17.127 8.8726C17.2719 9.01746 17.3444 9.1931 17.3444 9.3995C17.3444 9.6059 17.2719 9.78153 17.127 9.9264L12.6328 14.4206C12.5392 14.5142 12.4405 14.5802 12.3367 14.6187C12.2328 14.6572 12.1207 14.6764 12.0001 14.6764Z" fill="#6A6A6B" />
                            </svg>
                        </div>
                        <div className={`answer ${faq.open ? "open" : ""}`}>
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Question;