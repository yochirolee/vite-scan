interface Status {
	id: number;
	name: string;
	link: string;
	allowedRoles: Role[];
	icon: string;
}

// Using const assertion instead of enum as per guidelines
export const Role = {
	ROOT: "ROOT",
	ADMINISTRATOR: "ADMINISTRATOR",
	AGENCY_ADMIN: "AGENCY_ADMIN",
	MESSENGER: "MESSENGER",
	WAREHOUSE_OPERATOR: "WAREHOUSE_OPERATOR",
	DELIVERY_DRIVER: "DELIVERY_DRIVER",
	CUSTOMS_OFFICER: "CUSTOMS_OFFICER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const statuses: Status[] = [
	/* {
		id: 5,
		name: "Desagrupar",
		link: "/ungroup",
		allowedRoles: [Role.ROOT, Role.ADMINISTRATOR, Role.WAREHOUSE_OPERATOR],
		icon: "UNGROUP",
	},
	{
		id: 6,
		name: "Aforado",
		link: "/aforado",
		allowedRoles: [Role.ROOT, Role.ADMINISTRATOR, Role.CUSTOMS_OFFICER],
		icon: "READY_FOR_PICKUP",
	},
	{
		id: 7,
		name: "Recibir Almacen Mypimes",
		link: "/scan/7",
		allowedRoles: [Role.ROOT, Role.ADMINISTRATOR, Role.AGENCY_ADMIN, Role.WAREHOUSE_OPERATOR],
		icon: "IN_TRANSIT",
	},
	{
		id: 8,
		name: "Recibir en Provincia",
		link: "/scan/8",
		allowedRoles: [Role.ROOT, Role.ADMINISTRATOR, Role.AGENCY_ADMIN, Role.MESSENGER],
		icon: "MESSENGER_RECEIVED",
	},
	{
		id: 9,
		name: "Mensajero o Repartidor",
		link: "/scan/9",
		allowedRoles: [
			Role.ROOT,
			Role.ADMINISTRATOR,
			Role.AGENCY_ADMIN,
			Role.MESSENGER,
			Role.DELIVERY_DRIVER,
		],
		icon: "OUT_FOR_DELIVERY",
	}, */
	{
		id: 10,
		name: "Entregar",
		link: "/delivery",
		allowedRoles: [
			Role.ROOT,
			Role.ADMINISTRATOR,
			Role.AGENCY_ADMIN,
			Role.MESSENGER,
			Role.DELIVERY_DRIVER,
		],
		icon: "DELIVERED",
	},
	{
		id: 11,
		name: "Historial",
		link: "/history",
		allowedRoles: [
			Role.ROOT,
			Role.ADMINISTRATOR,
			Role.AGENCY_ADMIN,
			Role.MESSENGER,
			Role.DELIVERY_DRIVER,
		],
		icon: "HISTORY",
	},
];

// Utility function to get statuses by role
export const getStatusesByRole = (userRole: Role): Status[] => {
	return statuses.filter((status) => status.allowedRoles.includes(userRole));
};
