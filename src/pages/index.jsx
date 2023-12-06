import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "src/components/PrivateRoute";
import { AdminPrivateRoute } from "src/components/AdminPrivateRoute";
import useAuthStore from "src/store";
import DashboardLayout from "./Dashboard/components/Layout";
import AdminDashboardLayout from "./Admin/Dashboard/components/Layout";
import MedicineManagement from "./Admin/Dashboard/MedicineManagement";
import CustomerManagement from "./Admin/Dashboard/CustomerManagement";
import AdminManagement from "./Admin/Dashboard/AdminManagement";
import Medicine from "./Dashboard/Medicine";
import NotFound from "./404";
import SignIn from "./SignIn";
import AdminSignIn from "./Admin/SignIn";

function Pages() {
	const { accessToken, userInfo } = useAuthStore();

	return (
		<Routes>
			<Route path="/signin" element={<SignIn />} />
			<Route path="/dashboard/*" element={<PrivateRoute isAuthenticated={accessToken} />}>
				<Route element={<DashboardLayout />}>
					<Route index element={<Medicine />} />
					<Route path="medicines" element={<Medicine />} />
					<Route path="*" element={<NotFound />} />
				</Route>
			</Route>
			<Route path="/admin">
				<Route index element={<AdminSignIn />} />
				<Route path="signin" element={<AdminSignIn />} />
				<Route
					path="dashboard/*"
					element={<AdminPrivateRoute userInfo={userInfo} isAuthenticated={accessToken} />}
				>
					<Route element={<AdminDashboardLayout />}>
						<Route index element={<MedicineManagement />} />
						<Route path="medicines-management" element={<MedicineManagement />} />
						<Route path="customer-management" element={<CustomerManagement />} />
						<Route path="admin-management" element={<AdminManagement />} />
						<Route path="*" element={<NotFound />} />
					</Route>
				</Route>
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default Pages;
