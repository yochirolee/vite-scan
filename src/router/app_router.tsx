import { useAuthContext } from "@/context/auth-context";
import { LoginForm } from "@/modules/auth/login-form";
import GeolocationPage from "@/modules/location";
import { ScanXzing } from "@/modules/scan-xzing";
import { ContainerSelectPage } from "@/modules/scan/container-select-page";
import MainPage from "@/modules/scan/main-page";
import ScanPage from "@/modules/scan/ScanPage";
import Ungroup from "@/modules/scan/ungroup";
import UngroupContainer from "@/modules/scan/ungroup-container";
import { Navigate, Route, Routes } from "react-router-dom";

export default function AppRouter() {
	const { user } = useAuthContext();

	return (
		<Routes>
			{user ? (
				<>
					<Route path="/scan" element={<ScanPage />} />
					<Route path="/select" element={<ContainerSelectPage />} />
					<Route path="/ungroup/:id" element={<UngroupContainer />} />
					<Route path="/main" element={<MainPage />} />
					<Route path="/new-ungroup/:id" element={<Ungroup />} />
					<Route path="/scan/:id" element={<ScanXzing />} />
					<Route path="/location" element={<GeolocationPage />} />
					<Route path="*" element={<Navigate to="/main" />} />
				</>
			) : (
				<Route path="/login" element={<LoginForm />} />
			)}
			{/* always redirect to login if no token */}
			<Route path="*" element={<Navigate to="/login" />} />
		</Routes>
	);
}
