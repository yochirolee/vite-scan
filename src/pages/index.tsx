import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/context/auth-context";
import { getStatusesByRole, Role } from "@/data/data";
import { getIcon } from "@/components/common/getIcon";

export default function MainPage() {
	const { user } = useAuthContext();
	
	const statuses = getStatusesByRole(user?.role as Role);
	return (
		<div className="grid ">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 mt-4">
				{statuses.map((status) => (
					<Link key={status.id} to={status.link}>
						<Button variant="outline" className="w-full">
							{getIcon(status.icon)}
							{status.name}
						</Button>
					</Link>
				))}
			</div>
		</div>
	);
}
