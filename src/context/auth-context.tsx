import { useLoginMutation, useRegisterMutation } from "@/api/auth-api";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (email: string, password: string) => void;
	register: (
		email: string,
		password: string,
		name: string,
		agencyId: number,
		roleId: number,
	) => void;
	logout: () => void;
	isLoggingIn: boolean;
	loginError: string | null;
	isRegistering: boolean;
	registerError: string | null;
}

interface User {
	id: string;
	email: string;
	agencyId: number;
	role: string;
	roleId: number;
	username: string;

	// Add other user properties as needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "user";
const TOKEN_KEY = "token";

export function AuthProvider({ children }: { children: ReactNode }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [user, setUser] = useState<User | null>(() => {
		const savedUser = localStorage.getItem(USER_KEY);
		return savedUser ? JSON.parse(savedUser) : null;
	});

	const [token, setToken] = useState<string | null>(() => {
		const savedToken = localStorage.getItem(TOKEN_KEY);
		return savedToken ? JSON.parse(savedToken) : null;
	});

	const loginMutation = useLoginMutation();
	const registerMutation = useRegisterMutation();

	useEffect(() => {
		if (token && isTokenExpired(token)) {
			localStorage.removeItem(TOKEN_KEY);
			logout();
		}
	}, [token]);

	const isTokenExpired = (token: string): boolean => {
		try {
			const decoded: any = jwtDecode(token);
			const currentTime = Date.now() / 1000;

			return decoded.exp < currentTime;
		} catch (error) {
			return true;
		}
	};
	const login = async (email: string, password: string) => {
		return loginMutation.mutate(
			{ email, password },
			{
				onSuccess: (data) => {
					setToken(data.token);
					const decodedToken = jwtDecode<User>(data.token);
					const user: User = {
						id: decodedToken.id,
						email: decodedToken.email,
						agencyId: decodedToken.agencyId,
						role: decodedToken.role,
						roleId: decodedToken.roleId,
						username: decodedToken.username,
					};
					setUser(user);
					//save user to local storage
					localStorage.setItem(TOKEN_KEY, JSON.stringify(data.token));
					localStorage.setItem(USER_KEY, JSON.stringify(user));
					navigate("/");
				},
				onError: (error) => {
					console.log(error);
				},
			},
		);
	};

	const register = async (
		email: string,
		password: string,
		name: string,
		agencyId: number,
		roleId: number,
	) => {
		return registerMutation.mutate(
			{ email, password, name, agencyId, roleId },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["users"] });
				},
				onError: (error) => {
					console.log(error);
				},
			},
		);
	};

	const logout = () => {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);
		setToken(null);
		setUser(null);
		navigate("/login");
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				login,
				register,
				logout,

				isLoggingIn: loginMutation.isPending,
				loginError: loginMutation.error ? loginMutation.error.message : null,
				isRegistering: registerMutation.isPending,
				registerError: registerMutation.error ? registerMutation.error.message : null,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
