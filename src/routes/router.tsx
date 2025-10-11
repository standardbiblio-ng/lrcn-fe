import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom'
import { ErrorBoundary } from '@/components/global/error-boundary'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Application } from '@/features/application'
import { AuthLayout } from '@/features/auth/auth-layout'
import { SignIn } from '@/features/auth/sign-in'
import { SignUp } from '@/features/auth/sign-up'
import { Dashboard } from '@/features/dashboard'
import { Settings } from '@/features/settings'
import { AuthGuard } from './guards/auth-guard'
import { GuestGuard } from './guards/guest-guard'
import { LazyPage } from './lazy-page'
import { paths } from './paths'

// import { Settings } from '@/features/settings'

// Updated LazyPage utility function that handles both default and named exports

/**
 * ------------------------------------------------------------------------
 * Root Redirect Route
 * Redirects '/' to the main dashboard root.
 * ------------------------------------------------------------------------
 */
export const router = createBrowserRouter([
  {
    path: '/',
    // element: <div>Home Page - Basic test</div>,
    element: <Navigate to={paths.home.root} replace />,

    errorElement: <ErrorBoundary />,
  },

  /**
   * ------------------------------------------------------------------------
   * Auth Routes
   * Handles authentication pages: login, forgot password, reset password.
   * Wrapped with GuestGuard and AuthLayout.
   * ------------------------------------------------------------------------
   */
  {
    // path: '/auth',
    // element: (
    //   <GuestGuard>
    //     <AuthLayout>
    //       <Outlet />
    //     </AuthLayout>
    //   </GuestGuard>
    // ),
    // children: [
    //   {
    //     path: 'login',
    //     element: <div>Login Page</div>,
    //   },
    // ],
    path: paths.auth.root,
    element: (
      <GuestGuard>
        <Outlet />
      </GuestGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      // {
      //   index: true,
      //   element: <Navigate to={paths.auth.login} replace />,
      // },
      {
        path: paths.auth.login,
        // element: LazyPage(() => import('@/features/auth/sign-in')),
        element: <SignIn />,
      },
      {
        path: paths.auth.signup,
        // element: LazyPage(() => import('@/features/auth/sign-up')),
        element: <SignUp />,
      },
      {
        path: paths.auth.forgotPassword,
        element: LazyPage(() => import('@/features/auth/forgot-password')),
      },
      //   {
      //     path: paths.auth.resetPassword,
      //     element: LazyPage(() => import('@/features/auth/reset-password')),
      //   },
    ],
  },

  /**
   * ------------------------------------------------------------------------
   * Main Dashboard Routes (with Sidebar)
   * Protected by AuthGuard and uses DashboardLayout.
   * Includes home, settings
   * ------------------------------------------------------------------------
   */

  {
    path: paths.home.root,
    element: (
      <AuthGuard>
        <AuthenticatedLayout>
          <Outlet />
        </AuthenticatedLayout>
      </AuthGuard>
    ),
    children: [
      // {
      //   path: 'test',
      //   element: <div>test Page</div>,
      // },
      {
        index: true,
        // element: <Navigate to={paths.dashboard.home.root} replace />,
        element: <Dashboard />,
      },

      //   // Home Section
      //   {
      //     path: paths.dashboard.home.root,
      //     children: [
      //       {
      //         index: true,
      //         element: <Navigate to={paths.dashboard.home.overview} replace />,
      //       },
      //       //   {
      //       //     path: paths.dashboard.home.overview.split('/').pop(),
      //       //     element: LazyPage(() => import('@/features/dashboard/home/overview')),
      //       //   },
      //       //   {
      //       //     path: paths.dashboard.home.newEntry.split('/').pop(),
      //       //     element: LazyPage(() => import('@/features/dashboard/home/new-entry')),
      //       //   },
      //       //   {
      //       //     path: paths.dashboard.home.getStarted.split('/').pop(),
      //       //     element: LazyPage(() => import('@/features/dashboard/home/get-started')),
      //       //   },
      //     ],
      //   },

      // Notifications Section
      //   {
      //     path: paths.dashboard.notifications.root,
      //     children: [
      //       {
      //         index: true,
      //         element: LazyPage(() => import('@/features/dashboard/notifications/all')),
      //       },
      //       {
      //         path: paths.dashboard.notifications.unread.split('/').pop(),
      //         element: LazyPage(() => import('@/features/dashboard/notifications/unread')),
      //       },
      //       {
      //         path: paths.dashboard.notifications.important.split('/').pop(),
      //         element: LazyPage(() => import('@/features/dashboard/notifications/important')),
      //       },
      //     ],
      //   },
    ],
  },

  // Applications Section
  {
    path: paths.application.root,
    element: (
      <AuthGuard>
        <AuthenticatedLayout>
          <Outlet />
        </AuthenticatedLayout>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Application />,
      },
      // {
      //   path: paths.dashboard.applications.myApplication.split('/').pop(),
      //   element: LazyPage(() => import('@/features/dashboard/applications/my-application')),
      // },
      // {
      //   path: paths.dashboard.applications.newApplication.split('/').pop(),
      //   element: LazyPage(() => import('@/features/dashboard/applications/new-application')),
      // },
      // {
      //   path: paths.dashboard.applications.status.split('/').pop(),
      //   element: LazyPage(() => import('@/features/dashboard/applications/status')),
      // },
    ],
  },

  // settings Section
  {
    path: paths.settings.root,
    element: (
      <AuthGuard>
        <AuthenticatedLayout>
          <Outlet />
        </AuthenticatedLayout>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Settings />,
      },
      // {
      //   path: paths.dashboard.applications.myApplication.split('/').pop(),
      //   element: LazyPage(() => import('@/features/dashboard/applications/my-application')),
      // },
      // {
      //   path: paths.dashboard.applications.newApplication.split('/').pop(),
      //   element: LazyPage(() => import('@/features/dashboard/applications/new-application')),
      // },
      // {
      //   path: paths.dashboard.applications.status.split('/').pop(),
      //   element: LazyPage(() => import('@/features/dashboard/applications/status')),
      // },
    ],
  },

  /**
   * ------------------------------------------------------------------------
   * Dashboard Routes (No Sidebar)
   * For dashboard pages that do not require the sidebar layout (e.g application).
   * Uses DashboardNoSidebarLayout.
   * ------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Error Pages
   * ------------------------------------------------------------------------
   */
  //   {
  //     path: paths.errors.notFound,
  //     element: LazyPage(() => import('@/features/errors/not-found-error')),
  //   },
  //   {
  //     path: paths.errors.forbidden,
  //     element: LazyPage(() => import('@/features/errors/forbidden')),
  //   },
  //   {
  //     path: paths.errors.serverError,
  //     element: LazyPage(() => import('@/features/errors/general-error')),
  //   },
  //   {
  //     path: paths.errors.maintenance,
  //     element: LazyPage(() => import('@/features/errors/maintenance-error')),
  //   },
  //   {
  //     path: paths.errors.unauthorized,
  //     element: LazyPage(() => import('@/features/errors/unauthorized-error')),
  //   },

  //   /**
  //    * ------------------------------------------------------------------------
  //    * Catch-all Route (404)
  //    * ------------------------------------------------------------------------
  //    */
  //   {
  //     path: '*',
  //     element: <Navigate to={paths.errors.notFound} replace />,
  //   },
])

/**
 * ------------------------------------------------------------------------
 * Router Provider
 * Wraps the app with the router configuration above.
 * ------------------------------------------------------------------------
 */
export function Router() {
  return <RouterProvider router={router} />
}
