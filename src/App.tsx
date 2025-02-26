import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./router/app_router";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import { ThemeProvider } from "./context/theme-context";
import { Toaster } from "sonner";
import { AppProvider } from "./context/app-context";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Reduce staleTime to refresh more frequently
			staleTime: 0,
			refetchOnWindowFocus: true,
			refetchOnMount: true,
			refetchOnReconnect: true,
		},
	},
});

function App() {
	return (
		<div className="max-w-md mx-auto">
			<ThemeProvider defaultTheme="dark" storageKey="theme">
				<BrowserRouter>
					<QueryClientProvider client={queryClient}>
						<ReactQueryDevtools initialIsOpen={true} />
						<AuthProvider>
							<AppProvider>
								<AppRouter />
								<Toaster />
							</AppProvider>
						</AuthProvider>
					</QueryClientProvider>
				</BrowserRouter>
			</ThemeProvider>
		</div>
	);
}

export default App;
