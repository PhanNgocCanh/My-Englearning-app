import { Navigate } from 'react-router-dom';
import routes from './routes';
import jwtDecode from 'jwt-decode';

function WithAuth(Page) {
    return (props) => {
        // validate access token here
        let isAuthenticated = localStorage.getItem('access_token') != null;
        let isValidToken = true;

        if (isAuthenticated) {
            let decodeToken = jwtDecode(localStorage.getItem('access_token'));
            let currentDate = new Date();

            if (decodeToken.exp * 1000 < currentDate.getTime()) {
                isValidToken = false;
            } else {
                localStorage.setItem(
                    'user_info',
                    JSON.stringify({
                        fullname: decodeToken.sub,
                        roles: [decodeToken.auth],
                    }),
                );
            }
        } else {
            isValidToken = false;
        }
        return isValidToken ? <Page {...props} /> : <Navigate to={routes.login} />;
    };
}

export default WithAuth;
