//write a context for the app

import { createContext, useContext, useState } from "react";

interface AppContextType {
	cameraMode: boolean;
	setCameraMode: (cameraMode: boolean) => void;
	
}
export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
	const [cameraMode, setCameraMode] = useState(false);

	return (
		<AppContext.Provider value={{ cameraMode, setCameraMode }}>{children}</AppContext.Provider>
	);
};

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (context === undefined) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
};
