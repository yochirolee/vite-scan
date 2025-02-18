import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import { statuses } from "@/data/data";
/* const actions = [
	{
		name: "Desagrupar",
		icon: <Package />,
		link: "/select",
		action: {
			name: "ungroup",
			status: "pending",
			locationId: 3,
		},
	},
	{
		name: "Recibir en Almacen",
		icon: <Warehouse />,
		link: "/warehouse",
	},
	{
		name: "Dar Salida",
		icon: <Truck />,
		link: "/ship",
	},
]; */

export default function MainPage() {
	return (
		<div className="grid ">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 mt-4">
				{statuses.map((status) => (
					<Link key={status.id} to={status.link}>
						<Button variant="outline" className="text-white w-full">
							{status.name}
						</Button>
					</Link>
				))}
			</div>
		</div>
	);
}
