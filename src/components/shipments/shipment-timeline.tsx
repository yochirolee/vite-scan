import ShipmentTimelineItem from "./shipment-timeline-item";
import { getIcon } from "@/components/common/getIcon";

export type ShipmentEvent = {
	id: string;
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
	location: {
		id: number;
		state: string;
		country_code: string;
		city: string;
	};
	timestamp: string;
	isCompleted: boolean;
};
export default function ShipmentTimeline({ events }: { events: ShipmentEvent[] }) {
	return (
		<div className="max-w-2xl mx-auto p-6">
			<h2 className=" font-bold mb-4">Tracking Timeline</h2>

			<div className="relative">
				{events.map((event: ShipmentEvent, index: number) => {
					return (
						<ShipmentTimelineItem
							key={index}
							icon={getIcon(event?.status?.code)}
							status={event.status}
							timestamp={event.timestamp}
							user={event.user}
							isCompleted={event.isCompleted}
							location={event.location}
							isLast={index === events.length - 1}
						/>
					);
				})}
			</div>
		</div>
	);
}
