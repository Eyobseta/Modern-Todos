import React, { useState } from 'react';
import style from './TodoCard.module.css';
import Button from '../button/Button';
import { FaEdit, FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

export default function TodoCard({ todo, onToggleComplete, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDueDate, setEditDueDate] = useState(
    todo.due_date ? todo.due_date.split('T')[0] : ''
  );

  const handleEditSave = () => {
    if (editTitle.trim()) {
      onEdit({
        title: editTitle.trim(),
        due_date: editDueDate || null
      });
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleEditSave();
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const dueDateDisplay = formatDueDate(todo.due_date);

  return (
    <div className={`${style.card} ${todo.completed ? style.completedCard : ''}`}>
      <div className={style.cardContent}>
        <div className={style.status} onClick={onToggleComplete}>
          {todo.completed ? (
            <FaCheckCircle color="#32cd32" size={24} />
          ) : (
            <FaRegCircle color="#8a2be2" size={24} />
          )}
        </div>
        <div className={style.textContent}>
          {isEditing ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleEditSave}
                onKeyPress={handleKeyPress}
                autoFocus
                className={style.editInput}
                placeholder="Task title"
              />
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className={style.editDateInput}
              />
            </>
          ) : (
            <>
              <h2 className={todo.completed ? style.completedText : ''}>{todo.title}</h2>
              {dueDateDisplay && (
                <p className={style.dueDate}>
                  Due: {dueDateDisplay}
                </p>
              )}
            </>
          )}
        </div>
      </div>
      <div className={style.cardAction}>
        <Button size="small" unique='edit' onClick={() => setIsEditing(true)}>
          <FaEdit color="#f06a03" size={20} />
        </Button>
        <Button size="small" unique='edit' onClick={onDelete}>
          <FaTrash color="#d80c0c" size={20} />
        </Button>
      </div>
    </div>
  );
}