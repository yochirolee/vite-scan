import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./router/app_router";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import { ThemeProvider } from "./context/theme-context";
import { Toaster } from "sonner";
import Layout from "./layout/app-layout";
import { AppProvider } from "./context/app-context";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
		
		},
	},
});

const persister = createSyncStoragePersister({
	storage: window.localStorage,
});

persistQueryClient({
	queryClient,
	persister,
	maxAge: Infinity,
});

function App() {
	return (
		<div className="max-w-md mx-auto">
			<ThemeProvider defaultTheme="system" storageKey="theme">
				<BrowserRouter>
					<QueryClientProvider client={queryClient}>
						<AuthProvider>
							<AppProvider>
								<Layout>
									<AppRouter />
									<Toaster />
								</Layout>
							</AppProvider>
						</AuthProvider>
					</QueryClientProvider>
				</BrowserRouter>
			</ThemeProvider>
		</div>
	);
}

export default App;
