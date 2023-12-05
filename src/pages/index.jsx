import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "src/components/PrivateRoute";
import useAuthStore from "src/store";
import DashboardLayout from "./Dashboard/components/Layout";
import AdminDashboardLayout from "./Admin/Dashboard/components/Layout";
import MedicineManagement from "./Admin/Dashboard/MedicineManagement";
import Medicine from "./Dashboard/Medicine";
import NotFound from "./404";
import SignIn from "./SignIn";
import AdminSignIn from "./Admin/SignIn";

function Pages() {
	const { accessToken } = useAuthStore();

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
				<Route path="login" element={<AdminSignIn />} />
				<Route path="dashboard/*" element={<PrivateRoute isAuthenticated={accessToken} />}>
					<Route element={<AdminDashboardLayout />}>
						<Route index element={<MedicineManagement />} />
						<Route path="medicines-management" element={<MedicineManagement />} />
						<Route path="*" element={<NotFound />} />
					</Route>
				</Route>
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default Pages;
