import React, { useState } from 'react';
import style from './TodoCard.module.css';
import Button from '../button/Button';
import { FaEdit, FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

export default function TodoCard({ todo, onToggleComplete, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const handleEditSave = () => {
    if (editValue.trim() && editValue !== todo.title) {
      onEdit(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleEditSave();
  };

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
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSave}
            onKeyPress={handleKeyPress}
            autoFocus
            className={style.editInput}
          />
        ) : (
          <h2 className={todo.completed ? style.completedText : ''}>{todo.title}</h2>
        )}
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