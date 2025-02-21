import { useState } from "react";
import { HBLScanner } from "./components/hbl-scanner";
import { ParcelsList } from "./components/parcels-list";
import { Stats } from "./components/stats";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

/* const useReducer = () => {
	const [parcels, setParcels] = useState(
		JSON.parse(localStorage.getItem(`container-${id}`) || "{}").parcels || [],
	);
}; */

export default function UngroupContainer() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [shipments, setShipments] = useState(
		JSON.parse(localStorage.getItem(`container-${id}`) || "{}").shipments || [],
	);

	//load the container data from the local storage and set the parcels
	/* useEffect(() => {
		const { action, containerId, isDone, parcels } = JSON.parse(
			localStorage.getItem(`container-${id}`) || "{}",
		);
		setParcels(parcels);
	}, [id, parcels]); */

	const handleScan = (hbl: string) => {
		setShipments((prevShipments: any) => {
			const index = prevShipments.findIndex((shipment: any) => shipment.hbl === hbl);
			let newShipments = [...prevShipments];

				if (index !== -1 && !prevShipments[index].scanned) {
				newShipments[index] = {
					...newShipments[index],
					scanned: true,
					updatedAt: new Date().toISOString(),
				};
				// Sort packages by scannedAt date in descending order
				newShipments = newShipments.sort((a, b) => {
					if (!a.updatedAt) return 1;
					if (!b.updatedAt) return -1;
					return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
				});
			}

			// Update localStorage with the new packages state
			localStorage.setItem(
				`container-${id}`,
				JSON.stringify({
					shipments: newShipments,
					action: "ungroup",
					containerId: id,
					isDone: false,
				}),
			);

			return newShipments;
		});
	};

	return (
		<div className="flex  flex-col space-y-1 relative gap-2 mt-2 p-1">
			<div className="flex items-center justify-between mx-2 gap-2 ">
				<div className="flex items-center gap-2">
					<Button size="icon" variant="ghost" onClick={() => navigate("/container-select")}>
						<ArrowLeft />
					</Button>
					<h1 className="">Desagrupando contenedor {id}</h1>
				</div>
				<Button variant="ghost" size="icon" onClick={() => navigate("/warehouse")}>
					<Save className="w-4 h-4" />
				</Button>
			</div>
			<HBLScanner handleScan={handleScan} />
			<Stats shipments={shipments || []} />

			<ParcelsList shipments={shipments || []} />
		</div>
	);
}
