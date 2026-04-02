import React, { useState, useEffect } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import style from './MotivationQoute.module.css';

const fallbackQuote = {
    content: "Small steps every day lead to big results. Keep going!",
    author: "Me"
};

export default function MotivationQuote() {
    const [quote, setQuote] = useState(fallbackQuote);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const fetchQuote = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch('https://api.quotable.io/random?maxLength=100');
            if (!res.ok) throw new Error('Failed to fetch quote');
            const data = await res.json();
            setQuote({ content: data.content, author: data.author });
        } catch (err) {
            console.error('Quote fetch error:', err);
            setError(true);
            // keep fallback, but show error briefly
            setTimeout(() => setError(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuote();
    }, []);

    return (
        <div className={style.quoteContainer}>
            <div className={style.quoteIcon}>“</div>
            <button 
                className={style.refreshBtn} 
                onClick={fetchQuote} 
                disabled={loading}
                aria-label="Get new quote"
            >
                <FaSyncAlt className={loading ? style.spin : ''} />
            </button>
            {loading ? (
                <p className={style.quote}>Loading inspiration...</p>
            ) : error ? (
                <p className={style.quote}>✨ Couldn't fetch new quote, but here's one for you: "{quote.content}"</p>
            ) : (
                <>
                    <p className={style.quote}>"{quote.content}"</p>
                    <p className={style.author}>— {quote.author}</p>
                </>
            )}
        </div>
    );
}