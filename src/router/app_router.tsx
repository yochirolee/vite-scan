import { useAuthContext } from "@/context/auth-context";
import AppLayout from "@/layout/app-layout";
import { LoginForm } from "@/modules/auth/login-form";
import ScanPage from "@/modules/scan/ScanPage";
import { Navigate, Route, Routes } from "react-router-dom";

export default function AppRouter() {
	const {  user } = useAuthContext();
	console.log(user);
	return (
		<AppLayout>
			<Routes>
				{user ? (
					<>
						<Route path="/scan" element={<ScanPage />} />
						<Route path="*" element={<Navigate to="/scan" />} />
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
