import { Route, Routes } from "react-router-dom";
import NotFound from "./404";
import SignIn from "./SignIn";


function Pages() {
	return (
		<Routes>
			<Route path="/signin" element={<SignIn />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default Pages;
