import React, { createContext, useState, useContext } from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

// Create the context
const TokenContext = createContext();

// Create a custom hook to use the context
export const useToken = () => useContext(TokenContext);

// Create the context provider
export const TokenProvider = ({ children }) => {
    const cookies = parseCookies();
    const [token, setToken] = useState(cookies.token || '');

    const updateToken = (newToken) => {
        setToken(newToken);
        setCookie(null, 'token', newToken, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });
    };

    const deleteToken = () => {
        setToken('');
        destroyCookie(null, 'token', {
            path: '/',
        });
    };

    return (
        <TokenContext.Provider value={{ token, updateToken, deleteToken }}>
            {children}
        </TokenContext.Provider>
    );
};
