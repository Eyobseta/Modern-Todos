import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import style from './Home.module.css';
import Button from '../components/button/Button';
import TodoCard from '../components/todoCard/TodoCard';
import MotivationQuote from '../components/qoute/MotivationQoute';
import { FaFire, FaSun, FaUserCircle } from 'react-icons/fa';
import apiFetch from '../api';
import ConfirmationModal from '../components/modal/ConfirmationModal';

export default function Home() {
    const { user, logout } = useAuth();
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedDay, setSelectedDay] = useState(() => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date().getDay()];
    });
    const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: '',
    onConfirm: null
    });


    const openConfirmModal = (message, onConfirm) => {
    setModalConfig({ isOpen: true, message, onConfirm });
};


    const navigate = useNavigate();

    // Fetch todos for selected day
    useEffect(() => {
        async function fetchTodos() {
            setLoading(true);
            setError('');
            try {
                const data = await apiFetch(`/todos?day=${selectedDay}`);
                setTodos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchTodos();
    }, [selectedDay]);

    const streakCount = todos.filter(todo => todo.completed).length;

    async function addTodoHandler() {
        if (!newTodo.trim()) return;
        setLoading(true);
        setError('');
        try {
            const createdTodo = await apiFetch('/todos', {
                method: 'POST',
                body: JSON.stringify({ title: newTodo, day: selectedDay }),
            });
            setTodos(prev => [...prev, createdTodo]);
            setNewTodo('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function updateTodo(id, updates) {
        setLoading(true);
        try {
            const updatedTodo = await apiFetch(`/todos/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
            setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function deleteTodo(id) {
        openConfirmModal('Are you sure you want to delete this task?', async () => {
            setModalConfig(prev => ({ ...prev, isOpen: false }));
            setLoading(true);
            try {
                await apiFetch(`/todos/${id}`, { method: 'DELETE' });
                setTodos(prev => prev.filter(t => t.id !== id));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        });
    }

    const handleLogout = () => {
    openConfirmModal('Are you sure you want to logout?', () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        logout();
    });
};

    return (
        <div className={style.home}>
            <div className={style.header}>
                <p className={style.title}>Weekly Todo!</p>
                <div className={style.userSection}>
                    <div className={style.streak}>
                        <FaFire color="orange" size={24} />
                        <span>{streakCount} day streak</span>
                    </div>
                    <div className={style.userInfo}>
                        <FaUserCircle color="#8a2be2" size={28} />
                        <span className={style.username}>{user?.username}</span>
                        <button onClick={handleLogout} className={style.logoutBtn}>Logout</button>
                    </div>
                    <FaSun className={style.themeIcon} size={24} />
                </div>
            </div>

            <div className={style.newTodo}>
                <input
                    type="text"
                    placeholder="Enter Task Title"
                    value={newTodo}
                    onChange={e => setNewTodo(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addTodoHandler()}
                />
                <Button size="medium" type="primary" onClick={addTodoHandler}>
                    Add
                </Button>
            </div>

            {error && <p className={style.error}>{error}</p>}
            {loading && <p className={style.loading}>Loading...</p>}

            <div className={style.todosHeader}>
                <div className={style.days}>
                    <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>
                <a className={style.viewAllLink} onClick={() => navigate('/all')}>
                    View All
                </a>
            </div>

            <div className={style.todos}>
                {todos.length === 0 && !loading && <p className={style.empty}>No todos for {selectedDay}</p>}
                {todos.map(todo => (
                    <TodoCard
                        key={todo.id}
                        todo={todo}
                        onToggleComplete={() => updateTodo(todo.id, { completed: !todo.completed })}
                        onEdit={(newTitle) => updateTodo(todo.id, { title: newTitle })}
                        onDelete={() => deleteTodo(todo.id)}
                    />
                ))}
            </div>

            <MotivationQuote />
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={modalConfig.onConfirm}
                message={modalConfig.message}
            />
        </div>
    );
}