import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/common/mode-toggle";
import { useAuthContext } from "@/context/auth-context";
import { LogOut } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const { user, logout } = useAuthContext();
	return (
		<div className="min-h-screen bg-background">
			<nav className="  z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="flex justify-between items-center h-12">
					<div className="flex items-center gap-2">
						<span className="text-xs text-muted-foreground">Salida Almacen</span>
					</div>
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
				</div>
			</nav>

			<div className="container py-6 relative">{children}</div>
		</div>
	);
}
