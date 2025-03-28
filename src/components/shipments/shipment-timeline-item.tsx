import ShipmentDeliveryImagesViewer from "./shipment-delivery-images-viewer";

interface TimelineItemProps {
	icon: React.ReactNode;
	status: {
		code: string;
		description: string;
		name: string;
		id: number;
	};
	user: {
		id: number;
		name: string;
	};
	timestamp: string;
	isCompleted: boolean;
	location: {
		id: number;
		state: string;
		country_code: string;
		city: string;
	};

	isLast: boolean;
	images: { imageUrl: string }[];
}

export default function ShipmentTimelineItem({
	icon: Icon,
	status,
	timestamp,
	user,
	location,
	isCompleted,
	isLast,
	images,
}: TimelineItemProps) {
	return (
		<div className="flex h-16  items-center mb-8 w-full">
			<div className="flex items-center relative">
				<div
					className={`w-6 h-6 rounded-full  flex items-center justify-center z-10
            ${isCompleted ? "bg-green-500 border-green-500" : "bg-gray-800/50 "}`}
				>
					{Icon}
				</div>
				{!isLast && (
					<div
						className={`h-[60px] flex-1 w-[0.6px]  absolute top-[30px] left-3 -translate-x-1/2
              ${isCompleted ? "bg-green-500" : "bg-gray-300/20"}`}
					></div>
				)}
			</div>
			<div className="flex flex-row justify-between w-full items-center ml-4">
				<div className="flex flex-col w-full items-start">
					<div className="flex flex-row justify-between w-full">
						<div className="flex flex-row gap-2">
							<h3
								className={`font-semibold text-xs ${
									isCompleted ? "text-green-500" : "text-gray-300"
								}`}
							>
								{status?.name}
							</h3>
							<div className="flex flex-row gap-2">
								{images && images.length > 0 && <ShipmentDeliveryImagesViewer images={images} />}
							</div>
						</div>
						<span className="text-[10px]  text-gray-600">{user?.name}</span>
					</div>

					<p className="text-sm text-gray-600">{status?.description}</p>

					<span className="text-xs mt-1 text-gray-400">
						{new Date(timestamp).toLocaleDateString("en-US", {
							day: "numeric",
							month: "short",
							year: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
					<p className="text-xs mt-1  text-gray-500">
						{location?.state} {location?.city}
					</p>
				</div>
			</div>
		</div>
	);
}
