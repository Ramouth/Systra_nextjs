import PropTypes from 'prop-types';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const WbsPage = lazy(() => import('src/pages/wbs'));
export const TemplatePage = lazy(() => import('src/pages/template'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ActivityPage = lazy(() => import('src/pages/activities'));

// export const WbsCopyPage = lazy(() => import('src/pages/wbs-copy'));
export const ActivitiesCopyPage = lazy(() => import('src/pages/activities_copy'));

const isAuthenticated = () => localStorage.getItem('isLoggedIn') === 'true';

// Protected route component
const ProtectedRoute = ({ children }) => 
  isAuthenticated() ? children : <Navigate to="/login" replace />;

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to="/login" replace />,
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { path: 'template', element: <TemplatePage /> },
        { path: 'wbs', element: <WbsPage /> },
        { path: 'activities/:wbsId', element: <ActivityPage /> },
        // { path: 'wbs-copy/:templateId', element: <WbsCopyPage /> },
        { path: 'activities-copy/:templateId', element: <ActivitiesCopyPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}