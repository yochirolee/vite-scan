import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/auth/login-page";
import { ScanXzing } from "@/pages/scan/scan-xzing";
import MainPage from "@/pages";
import { ProtectedRoute } from "./protected-route";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import DeliveryPage from "@/pages/scan/delivery-page";
import DeliveryPhotosForm from "@/pages/scan/delivery-photos-form";
import DeliverySignature from "@/pages/scan/delivery-signature";

export default function AppRouter(): JSX.Element {
	return (
		<ErrorBoundary fallback={<div>Something went wrong</div>}>
			<Suspense fallback={<div>Loading...</div>}>
				<Routes>
					<Route path="/" element={<ProtectedRoute />}>
						<Route index element={<MainPage />} />
						<Route path="scan/:action" element={<ScanXzing />} />

						<Route path="delivery" element={<DeliveryPage />} />
						<Route path="delivery/photos" element={<DeliveryPhotosForm/>} />
						<Route path="delivery/signature" element={<DeliverySignature />} />
						<Route path="*" element={<Navigate to="/" />} />
					</Route>
					<Route path="/login" element={<LoginPage />} />
					<Route path="*" element={<Navigate to="/login" replace />} />
				</Routes>
			</Suspense>
		</ErrorBoundary>
	);
}
