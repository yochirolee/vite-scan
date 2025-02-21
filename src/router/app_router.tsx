import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "@/context/auth-context";
import LoginPage from "@/pages/auth/login-page";
import { ScanXzing } from "@/pages/scan/scan-xzing";
import MainPage from "@/pages";

export default function AppRouter() {
	const { user } = useAuthContext();

	return (
		<Routes>
			{user ? (
				<>
					<Route path="/" element={<MainPage />} />
					<Route path="/scan/:id" element={<ScanXzing />} />
					<Route path="*" element={<Navigate to="/" />} />
				</>
			) : (
				<Route path="/login" element={<LoginPage />} />
			)}
			{/* always redirect to login if no token */}
			<Route path="*" element={<Navigate to="/login" />} />
		</Routes>
	);
}
