import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/common/mode-toggle";
import { useAuthContext } from "@/context/auth-context";
import { LogOut } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const { user, logout } = useAuthContext();
	return (
		<div className="max-h-screen relative">
			<nav className="flex justify-between h-12 border-b  items-center ">
				{user && <h1 className="text-sm pl-2">{user.username}</h1>}
				<div className="inline-flex items-center ">
					{user && (
						<>
							<ModeToggle />
							<Button size="icon" variant="ghost" onClick={() => logout()}>
								<LogOut />
							</Button>
						</>
					)}
				</div>
			</nav>

			<div className="h-full mt-2">{children}</div>
		</div>
	);
}
