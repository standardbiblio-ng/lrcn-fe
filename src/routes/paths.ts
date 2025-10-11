/**
 * ------------------------------------------------------------------------
 * Application Route Paths
 * This file contains all the route path constants and path generators
 * for the application. Use these to avoid hardcoding URLs in your codebase.
 * ------------------------------------------------------------------------
 */
export const paths = {
  // ---------------- Auth Section ----------------
  /**
   * Auth routes for login, password reset, terms, and privacy.
   */
  auth: {
    root: '/auth',
    login: '/auth/login',
    signup: '/auth/signup',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    // terms: '/auth/terms',
    // privacy: '/auth/privacy',
  },

  // ---------------- Dashboard Section ----------------
  /**
   * Main dashboard routes and all nested sections.
   */
  dashboard: {
    root: '/dashboard',

    // -------- Home Section --------
    /**
     * Dashboard home, overview, new entry, and get started.
     */

    // -------- Profile & Settings --------
    /**
     * User profile and settings tabs.
     */
    profile: '/dashboard/settings?tab=account',
    account: '/dashboard/settings?tab=account',
    settings: '/dashboard/settings',
    helpCenter: '/dashboard/help-center',
    notifications: '/dashboard/notifications',
    privacyPolicy: '/dashboard/privacy-policy',
    newPassword: '/dashboard/new-password',
  },
  home: {
    root: '/dashboard',
    overview: '/dashboard/home/overview',
    newEntry: '/dashboard/home/new-entry',
    getStarted: '/dashboard/home/get-started',
  },

  application: {
    root: '/application',
    // overview: '/dashboard/home/overview',
    // newEntry: '/dashboard/home/new-entry',
    // getStarted: '/dashboard/home/get-started',
  },

  settings: {
    root: '/settings',
    // overview: '/dashboard/home/overview',
    // newEntry: '/dashboard/home/new-entry',
    // getStarted: '/dashboard/home/get-started',
  },

  // ---------------- Error Pages Section ----------------
  /**
   * Error and status code pages.
   */
  errors: {
    notFound: '/404',
    forbidden: '/403',
    serverError: '/500',
    maintenance: '/maintenance',
    unauthorized: '/unauthorized',
  },
} as const
