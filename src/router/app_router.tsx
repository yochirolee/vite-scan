import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/auth/login-page";
import { ScanXzing } from "@/pages/scan/scan-xzing";
import MainPage from "@/pages";
import { ProtectedRoute } from "./protected-route";

export default function AppRouter() {
	return (
		<Routes>
			<Route element={<ProtectedRoute />}>
				<Route path="/" element={<MainPage />} />
				<Route path="/scan/:action" element={<ScanXzing />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Route>
			<Route path="/login" element={<LoginPage />} />
			<Route path="*" element={<Navigate to="/login" />} />
		</Routes>
	);
}
