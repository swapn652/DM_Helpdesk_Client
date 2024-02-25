import { FBPageIntegrationCard } from './FBPageIntegrationCard';
import { parseCookies, setCookie } from 'nookies';
import { usePagesContext } from '../PagesContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SuccessfulFBPageIntegrationCard } from './SuccessfulFBPageIntegrationCard';
import { useToken } from '../TokenContext.jsx';
import { useNavigate } from "react-router-dom";

export const FBPageIntegrationPage = () => {
    const [userToken, setUserToken] = useState("");
    const [longLivedUserToken, setLongLivedUserToken] = useState("");
    const [userId, setUserId] = useState("");
    const { pages, setPages } = usePagesContext();
    const { token, updateToken } = useToken();
    const navigate = useNavigate();

    useEffect(() => {
        if(token === "")
            navigate("/login");
    }, [token])

    const handleLogin = () => {
        window.FB.login(function(response) {
          setUserToken(response.authResponse.accessToken);
          getLongLivedUserToken(response.authResponse.accessToken);
        }, {
          config_id: '1055326218913003'
        });
      };

    useEffect(() => {
        const getLongLivedUserToken = async () => {
            try {
                const response = await axios.get(`https://graph.facebook.com/v12.0/oauth/access_token`, {
                    params: {
                        grant_type: 'fb_exchange_token',
                        client_id: import.meta.env.VITE_FB_APP_ID,
                        client_secret: import.meta.env.VITE_FB_APP_SECRET,
                        fb_exchange_token: userToken
                    }
                });
                setLongLivedUserToken(response.data.access_token);
            } catch(error) {
                console.error(error);
            }
        };

        getLongLivedUserToken();
    }, [userToken])

    useEffect(() => {
        // console.log(longLivedUserToken);
        const getUserId = async () => {
            try {
                const response = await axios.get(`https://graph.facebook.com/me`, {
                    params: {
                        access_token: longLivedUserToken
                    }
                });
                setUserId(response.data.id);
            } catch(error) {
                console.error(error);
            }
        };

        getUserId();
    }, [longLivedUserToken])
    
    useEffect(() => {
        const getPagesInfo = async () => {
            try {
                const response = await axios.get(`https://graph.facebook.com/${userId}/accounts`, {
                    params: {
                        access_token: longLivedUserToken
                    }
                });
                const formattedPages = response.data.data.map(page => ({
                    id: page.id,
                    access_token: page.access_token,
                    name: page.name
                }));
                setPages(formattedPages);

                // Store page information in cookies
                const cookies = parseCookies();
                formattedPages.forEach(page => {
                    setCookie(null, `page_${page.id}`, JSON.stringify(page), {
                        maxAge: 30 * 24 * 60 * 60, // 30 days
                        path: '/',
                    });
                });
            } catch(error) {
                console.error(error);
            }
        };

        getPagesInfo();
    }, [userId, longLivedUserToken]);

    useEffect(() => {
        console.log(pages);
    }, [pages])

  return (
    <div className = "flex items-center justify-center min-h-screen min-w-screen bg-blue-900 gap-20">
        {pages.length == 0 && <FBPageIntegrationCard handleLogin = { handleLogin }/> }
        {pages && pages.map((page, index) => (
            <SuccessfulFBPageIntegrationCard key={index} page={page} />
        ))}
    </div>
  )
}
