import {
	CheckCircle,
	Truck,
	Clock,
	Shield,
	Forklift,
	Ship,
	Warehouse,
	PackageCheck,
	Package,
	BaggageClaim,
} from "lucide-react";

import { Anchor } from "lucide-react";

export const getIcon = (code: string) => {
	switch (code) {
		case "CREATED":
			return <Package className="text-emerald-500 h-4 w-4" />;
		case "IN_WAREHOUSE":
			return <Warehouse className="text-blue-500 h-4 w-4" />;
		case "IN_CONTAINER":
			return <Ship className="text-orange-500 h-4 w-4" />;
		case "IN_PORT":
			return <Anchor className="text-violet-500 h-4 w-4" />;
		case "CUSTOMS_PENDING":
			return <Shield className="text-yellow-500 h-4 w-4" />;
		case "READY_FOR_PICKUP":
			return <Forklift className="text-gray-500 h-4 w-4" />;
		case "MESSENGER_RECEIVED":
			return <PackageCheck className="text-lime-500 h-4 w-4" />;
		case "IN_TRANSIT":
			return <Truck className="text-sky-500 h-4 w-4" />;
		case "OUT_FOR_DELIVERY":
			return <BaggageClaim className="text-sky-500 h-4 w-4" />;
		case "DELIVERED":
			return <CheckCircle className="text-green-500 h-4 w-4" />;
		default:
			return <Clock className="text-gray-500 h-4 w-4" />;
	}
};
