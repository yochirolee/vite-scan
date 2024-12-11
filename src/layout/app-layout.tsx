import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/common/mode-toggle";
import { useAuthContext } from "@/context/auth-context";
import { LogOut } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const { user, logout } = useAuthContext();
	return (
		<div>
			<nav className="flex justify-between  items-center ">
				{user && <h1 className="text-sm ml-2">{user.username}</h1>}
				<div className="flex items-center ">
					<ModeToggle />
					{user && (
						<Button size="icon" variant="ghost" onClick={() => logout()}>
							<LogOut />
						</Button>
					)}
				</div>
			</nav>
			<Outlet />
			{children}
		</div>
	);
}
