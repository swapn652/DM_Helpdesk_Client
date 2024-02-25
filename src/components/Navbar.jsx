import React from 'react';
import { useToken } from '../TokenContext.jsx';

export const Navbar = () => {
    const { token, deleteToken } = useToken();

    const logout = () => {
        deleteToken();
    }

  return (
    <div className="w-screen min-h-[4rem] flex flex-row justify-between items-center px-10 bg-gray-300">
        <h1 className="text-3xl font-bold">FB DM Helpdesk</h1>
        {token !== "" && (
            <button className="bg-red-800 text-white text-lg px-6 py-2 rounded-xl" onClick={logout}>Logout</button>
        )}
    </div>
  )
}
