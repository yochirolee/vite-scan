import { Button } from "@/components/ui/button";
import { Package, Truck, Warehouse } from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
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
];

export default function MainPage() {
	const navigate = useNavigate();
	return (
		<div className="grid ">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 mt-4">
				{actions.map((action) => (
					<Button key={action.name} className="" onClick={() => navigate(action.link)}>
						{action.icon}
						{action.name}
					</Button>
				))}
			</div>
		</div>
	);
}
