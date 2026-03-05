import React from 'react';
import Modal from './Modal';
import Button from '../button/Button';
import style from './ConfirmationModal.module.css';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={style.content}>
                <h3 className={style.title}>Confirm Action</h3>
                <p className={style.message}>{message}</p>
                <div className={style.actions}>
                    <Button size="small" type="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button size="small" type="danger" onClick={onConfirm}>
                        Confirm
                    </Button>
                </div>
            </div>
        </Modal>
    );
}