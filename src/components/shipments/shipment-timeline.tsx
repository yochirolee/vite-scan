import ShipmentTimelineItem from "./shipment-timeline-item";
import { getIcon } from "../common/getIcon";
import { ShipmentEvent } from "@/data/data";

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
							isLast={index === events.length - 1}
						/>
					);
				})}
			</div>
		</div>
	);
}
