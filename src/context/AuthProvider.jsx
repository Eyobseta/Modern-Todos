import React, { useReducer, useEffect } from 'react';
import { AuthContext } from './authContext';
import apiFetch from '../api';

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
};

function authReducer(state, action) {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_TOKEN':
            return { ...state, token: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'LOGIN':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
            };
        case 'LOGOUT':
            localStorage.removeItem('token');
            return {
                ...state,
                user: null,
                token: null,
                loading: false,
            };
        default:
            return state;
    }
}

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        let isMounted = true;

        if (state.token) {
            apiFetch('/auth/me', {
                headers: { Authorization: `Bearer ${state.token}` }
            })
                .then(res => {
                    if (!isMounted) return;
                    if (res.ok) return res.json();
                    throw new Error('Invalid token');
                })
                .then(userData => {
                    if (isMounted) {
                        dispatch({ type: 'SET_USER', payload: userData });
                        dispatch({ type: 'SET_LOADING', payload: false });
                    }
                })
                .catch(() => {
                    if (isMounted) {
                        localStorage.removeItem('token');
                        dispatch({ type: 'SET_TOKEN', payload: null });
                        dispatch({ type: 'SET_LOADING', payload: false });
                    }
                });
        } else {
            // No token: ensure loading becomes false after a microtask
            Promise.resolve().then(() => {
                if (isMounted) dispatch({ type: 'SET_LOADING', payload: false });
            });
        }

        return () => {
            isMounted = false;
        };
    }, [state.token]); // depends only on token

    const login = (userData, token) => {
        dispatch({ type: 'LOGIN', payload: { user: userData, token } });
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    const value = {
        user: state.user,
        token: state.token,
        loading: state.loading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};