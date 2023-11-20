import WithAuth from '../config/WithAuth';
import routes from '../config/routes';

// components
import Home from '../pages/Home/Home';
import Lesson from '../pages/Lesson/Lesson';
import Login from '../pages/Login/Login';
import DetailLesson from '../pages/Lesson/DetailLesson';

const publicRouters = [
    {
        path: routes.home,
        component: Home,
        needAuthenticate: true,
    },
    {
        path: routes.lesson,
        component: Lesson,
        needAuthenticate: true,
    },
    {
        path: routes.detailLesson,
        component: DetailLesson,
        needAuthenticate: true,
    },
    {
        path: routes.login,
        component: Login,
        layout: null,
    },
];

publicRouters.forEach((router) => {
    if (router.needAuthenticate) router.component = WithAuth(router.component);
});

export { publicRouters };
