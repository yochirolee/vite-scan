import { useState, useEffect } from "react";
import { HBLScanner } from "./components/hbl-scanner";
import { ParcelsList } from "./components/parcels-list";
import { Stats } from "./components/stats";
import { useParams } from "react-router-dom";

/* const useReducer = () => {
	const [parcels, setParcels] = useState(
		JSON.parse(localStorage.getItem(`container-${id}`) || "{}").parcels || [],
	);
}; */

export default function UngroupContainer() {
	const { id } = useParams();
	const [parcels, setParcels] = useState(
		JSON.parse(localStorage.getItem(`container-${id}`) || "{}").parcels || [],
	);

	//load the container data from the local storage and set the parcels
	/* useEffect(() => {
		const { action, containerId, isDone, parcels } = JSON.parse(
			localStorage.getItem(`container-${id}`) || "{}",
		);
		setParcels(parcels);
	}, [id, parcels]); */

	const handleScan = (hbl: string) => {
		setParcels((prevPackages: any) => {
			const index = prevPackages.findIndex((pkg: any) => pkg.hbl === hbl);
			let newPackages = [...prevPackages];

			if (index !== -1 && !prevPackages[index].scanned) {
				newPackages[index] = {
					...newPackages[index],
					scanned: true,
					updatedAt: new Date().toISOString(),
				};
				// Sort packages by scannedAt date in descending order
				newPackages = newPackages.sort((a, b) => {
					if (!a.updatedAt) return 1;
					if (!b.updatedAt) return -1;
					return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
				});
			}

			// Update localStorage with the new packages state
			localStorage.setItem(
				`container-${id}`,
				JSON.stringify({
					parcels: newPackages,
					action: "ungroup",
					containerId: id,
					isDone: false,
				}),
			);

			return newPackages;
		});
	};

	return (
		<div className="flex flex-col relative gap-2 mt-2 p-1">
			<div className="flex my-2 flex-col gap-2">
				<HBLScanner handleScan={handleScan} />
			</div>
			{/* <DataTable columns={columns} data={filteredData || []} /> */}
			<ParcelsList parcels={parcels || []} />

			<Stats parcels={parcels || []} />
		</div>
	);
}
