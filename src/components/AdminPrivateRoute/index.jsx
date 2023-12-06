import { Navigate, Outlet } from "react-router-dom";

export const AdminPrivateRoute = ({ children, userInfo, isAuthenticated }) => {
	if (!isAuthenticated) {
		return <Navigate to="/admin/signin" replace />;
	}
	if (!userInfo?.is_staff && !userInfo?.is_superuser) {
		return <Navigate to="/signin" replace />;
	}

	return children ? children : <Outlet />;
};
