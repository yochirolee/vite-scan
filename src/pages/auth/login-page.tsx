import { LoginForm } from "@/components/auth/login-form";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/auth-context";

export default function LoginPage() {
	const { user } = useAuthContext();

	if (user) {
		return <Navigate to="/" />;
	}

	return (
		<div className="flex justify-center items-center h-screen">
			<LoginForm />
		</div>
	);
}
