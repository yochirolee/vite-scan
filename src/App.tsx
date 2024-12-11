import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./router/app_router";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import { ThemeProvider } from "./context/theme-context";
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
			staleTime: 5 * 60 * 1000, // 5 m
			retry: false,
		},
	},
});

function App() {
	return (
		<div className="max-w-md mx-auto border h-screen">
			<main className="p-1 space-y-2">
				<ThemeProvider defaultTheme="system" storageKey="theme">
					<BrowserRouter>
						<QueryClientProvider client={queryClient}>
						<AuthProvider>
								<AppRouter />
							</AuthProvider>
						</QueryClientProvider>
					</BrowserRouter>
				</ThemeProvider>
			</main>
		</div>
	);
}

export default App;
