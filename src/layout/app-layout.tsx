import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/common/mode-toggle";
import { useAuthContext } from "@/context/auth-context";
import { ArrowLeft, CameraIcon, LogOut } from "lucide-react";
import { useAppContext } from "@/context/app-context";
import { statuses } from "@/data/data";
import { Switch } from "@/components/ui/switch";
import { useNavigate, useParams } from "react-router-dom";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const { user, logout } = useAuthContext();
	const { cameraMode, setCameraMode } = useAppContext();
	const { id } = useParams();
	const navigate = useNavigate();
	return (
		<div className="min-h-screen bg-background">
			<nav className="  z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="flex justify-between items-center h-12">
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" onClick={() => navigate("/")}>
							<ArrowLeft />
						</Button>
						<span className="text-xs text-muted-foreground">
							{statuses.find((status) => status.id === parseInt(id || "0"))?.name}
						</span>
					</div>
					<div className="inline-flex items-center ">
						{user && (
							<>
								<div className="flex items-center justify-end  space-x-2">
									<CameraIcon className={cameraMode ? "w-4 h-4" : "w-4 h-4 text-gray-400"} />
									<Switch id="camera-mode" checked={cameraMode} onCheckedChange={setCameraMode} />
								</div>
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
