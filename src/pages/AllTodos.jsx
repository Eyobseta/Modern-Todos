import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import style from './AllTodos.module.css';
import Button from '../components/button/Button';
import { FaArrowLeft, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import apiFetch from '../api';

export default function AllTodos() {
    const { user } = useAuth();
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAllTodos() {
            setLoading(true);
            try {
                const data = await apiFetch('/todos');
                setTodos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchAllTodos();
    }, []);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const grouped = days.reduce((acc, day) => {
        acc[day] = todos.filter(todo => todo.day === day);
        return acc;
    }, {});

    return (
        <div className={style.container}>
            <div className={style.header}>
                <Button size="small" onClick={() => navigate(-1)}>
                    <FaArrowLeft size={20} />
                </Button>
                <h1>All Tasks</h1>
                <div>{user?.username && <span>Hi, {user.username}</span>}</div>
            </div>

            {loading && <p className={style.loading}>Loading...</p>}
            {error && <p className={style.error}>{error}</p>}

            <div className={style.daysGrid}>
                {days.map(day => (
                    <div key={day} className={style.daySection}>
                        <h2 className={style.dayTitle}>{day}</h2>
                        {grouped[day].length === 0 ? (
                            <p className={style.empty}>No tasks</p>
                        ) : (
                            <ul className={style.todoList}>
                                {grouped[day].map(todo => (
                                    <li key={todo.id} className={style.todoItem}>
                                        {todo.completed ? (
                                            <FaCheckCircle color="#32cd32" size={20} />
                                        ) : (
                                            <FaRegCircle color="#8a2be2" size={20} />
                                        )}
                                        <span className={todo.completed ? style.completed : ''}>
                                            {todo.title}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}