import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import GlobalStyle from './components/GlobalStyle';
import reportWebVitals from './reportWebVitals';
import { StyledEngineProvider } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.Fragment>
        <StyledEngineProvider>
            <GlobalStyle>
                <App />
            </GlobalStyle>
        </StyledEngineProvider>
    </React.Fragment>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
