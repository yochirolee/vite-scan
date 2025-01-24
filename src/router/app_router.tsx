import { useAuthContext } from "@/context/auth-context";
import AppLayout from "@/layout/app-layout";
import { LoginForm } from "@/modules/auth/login-form";
import MainPage from "@/modules/scan/main-page";
import ScanPage from "@/modules/scan/ScanPage";
import { Navigate, Route, Routes } from "react-router-dom";

export default function AppRouter() {
	const { user } = useAuthContext();

	return (
		<AppLayout>
			<Routes>
				{user ? (
					<>
						<Route path="/scan" element={<ScanPage />} />
						<Route path="/main" element={<MainPage />} />

						<Route path="*" element={<Navigate to="/main" />} />
					</>
				) : (
					<Route path="/login" element={<LoginForm />} />
				)}
				{/* always redirect to login if no token */}
				<Route path="*" element={<Navigate to="/login" />} />
			</Routes>
		</AppLayout>
	);
}
