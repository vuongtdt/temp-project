import Page404 from 'layouts/404';
import Settings from 'layouts/settings';
import Login from 'layouts/Login';
import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import Layout from './layouts';
import Loadable from './lib/component/Loading/Loadable';

// layouts

// import Login from './pages/Login';
// import NotFound from './pages/Page404';
// import Register from './pages/Register';

// ----------------------------------------------------------------------
const Fanpages = Loadable(lazy(() => import('./layouts/Fanpages')));
const ChatFanpage = Loadable(lazy(() => import('./layouts/ChatFanpage')));

export default function Router() {

  return useRoutes([
    { path: '/404', element: <Page404 /> },
    { path: '/*', element: <Navigate to="/404" /> },
    { path: '/login', element: <Login /> },
    {
      path: '/',
      element: <Layout />,
      children: [
        // { path: '', element: <Home /> },
        { path: '', element: <Fanpages /> },
        { path: 'message/:id', element: <ChatFanpage /> },
        { path: '/settings', element: <Settings /> },
      ],
    },
    // {
    //   path: '/',
    //   element: <LogoOnlyLayout />,
    //   children: [
    //     { path: '/', element: <Navigate to="/dashboard/app" /> },
    //     { path: 'login', element: <Login /> },
    //     { path: 'register', element: <Register /> },
    //     { path: '404', element: <NotFound /> },
    //     { path: '*', element: <Navigate to="/404" /> },
    //   ],
    // },
    // { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
