import { Navigate, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/auth-context";
import AppLayout from "@/layout/app-layout";

interface ProtectedRouteProps {
	allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
	const { user } = useAuthContext();
	const location = useLocation();
	const navigate = useNavigate();

	if (!user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (allowedRoles && !allowedRoles.includes(user.role || "")) {
		navigate("/", { state: { from: location }, replace: true });
	}

	return <AppLayout>{<Outlet />}</AppLayout>;
};
