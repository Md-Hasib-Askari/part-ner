// Main template components for page layouts
export {
    MainLayout,
    MainLayoutMinimal,
    MainLayoutWithoutNotifications
} from './main-layout';

export {
    DashboardLayout,
    DashboardLayoutMinimal,
    DashboardLayoutFocused
} from './dashboard-layout';

export {
    AuthLayout,
    SignInLayout,
    SignUpLayout,
    ForgotPasswordLayout,
    ResetPasswordLayout,
    VerifyEmailLayout
} from './auth-layout';

// Re-export default layouts
export { default as MainLayoutDefault } from './main-layout';
export { default as DashboardLayoutDefault } from './dashboard-layout';
export { default as AuthLayoutDefault } from './auth-layout';
