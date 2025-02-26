import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/auth/login-page";
import { ScanXzing } from "@/pages/scan/scan-xzing";
import MainPage from "@/pages";
import { ProtectedRoute } from "./protected-route";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function AppRouter(): JSX.Element {
	return (
		<ErrorBoundary fallback={<div>Something went wrong</div>}>
			<Suspense fallback={<div>Loading...</div>}>
				<Routes>
					<Route element={<ProtectedRoute />}>
						<Route path="/" element={<MainPage />} />
						<Route path="/scan/:action" element={<ScanXzing />} />
						<Route path="*" element={<Navigate to="/" />} />
					</Route>
					<Route path="/login" element={<LoginPage />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</Suspense>
		</ErrorBoundary>
	);
}
