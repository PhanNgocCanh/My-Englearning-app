import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { publicRouters } from './routers';
import { DefaultLayout } from './components/Layout';

function App() {
    return (
        <Router>
            <Routes>
                {publicRouters.map((router, index) => {
                    const Page = router.component;
                    let Layout = DefaultLayout;

                    if (router.layout) {
                        Layout = router.layout;
                    } else if (router.layout === null) {
                        Layout = Fragment;
                    }

                    return (
                        <Route
                            key={index}
                            path={router.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}
            </Routes>
        </Router>
    );
}

export default App;
