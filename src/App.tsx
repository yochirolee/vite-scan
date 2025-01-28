import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./router/app_router";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import { ThemeProvider } from "./context/theme-context";
import { Toaster } from "./components/ui/toaster";
import Layout from "./layout/app-layout";
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
			refetchOnMount: false,
			refetchOnReconnect: false,
			staleTime: 5 * 60 * 1000, // 5 m
			retry: true,
		},
	},
});

function App() {
	return (
		<div className="max-w-md mx-auto">
			<ThemeProvider defaultTheme="system" storageKey="theme">
				<BrowserRouter>
					<QueryClientProvider client={queryClient}>
						<AuthProvider>
							<Layout>
								<Toaster />
								<AppRouter />
							</Layout>
						</AuthProvider>
					</QueryClientProvider>
				</BrowserRouter>
			</ThemeProvider>
		</div>
	);
}

export default App;
