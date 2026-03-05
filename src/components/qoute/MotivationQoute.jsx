import React, { useState, useEffect } from 'react';
import style from './MotivationQoute.module.css';

const fallbackQuote = {
    content: "Small steps every day lead to big results. Keep going!",
    author: "Me"
};

export default function MotivationQuote() {
    const [quote, setQuote] = useState(fallbackQuote);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchQuote() {
            setLoading(true);
            try {
                const res = await fetch('https://api.quotable.io/random?maxLength=100');
                if (!res.ok) throw new Error('Failed to fetch quote');
                const data = await res.json();
                setQuote({ content: data.content, author: data.author });
            } catch (error) {
                console.error('Quote fetch error:', error);
                // keep fallback
            } finally {
                setLoading(false);
            }
        }
        fetchQuote();
    }, []);

    return (
        <div className={style.quoteContainer}>
            <div className={style.quoteIcon}>“</div>
            {loading ? (
                <p className={style.quote}>Loading inspiration...</p>
            ) : (
                <>
                    <p className={style.quote}>"{quote.content}"</p>
                    <p className={style.author}>— {quote.author}</p>
                </>
            )}
        </div>
    );
}