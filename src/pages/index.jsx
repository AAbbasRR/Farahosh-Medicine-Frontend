import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "src/components/PrivateRoute";
import useAuthStore from "src/store";
import DashboardLayout from "./Dashboard/components/Layout";
import Medicine from "./Dashboard/Medicine";
import NotFound from "./404";
import SignIn from "./SignIn";

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
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default Pages;
