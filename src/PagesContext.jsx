import { createContext, useState, useContext, useEffect } from 'react';
import { setCookie, parseCookies } from 'nookies'; // Install 'nookies' using npm or yarn

const PagesContext = createContext(null);

export const usePagesContext = () => useContext(PagesContext);

export const PagesProvider = ({ children }) => {
  const initialPages = parseCookies().pages ? JSON.parse(parseCookies().pages) : [];
  const [pages, setPages] = useState(initialPages);

  const deletePage = (pageId) => {
    const updatedPages = pages.filter((page) => page.id !== pageId);
    setPages(updatedPages);
    // Update cookies
    const updatedPagesString = JSON.stringify(updatedPages);
    setCookie(null, 'pages', updatedPagesString, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
  };

  useEffect(() => {
    // Update the cookie whenever the pages change
    setCookie(null, 'pages', JSON.stringify(pages), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
  }, [pages]);

  return (
    <PagesContext.Provider value={{ pages, setPages, deletePage }}>
      {children}
    </PagesContext.Provider>
  );
};
