import { useState, useEffect } from "react";

import { ContainerSelect } from "./components/container-select";
import { NoContainerSelected } from "./components/no-container-select";
import { useFetchParcelsByContainerId } from "./hooks/use-containers";
import { Skeleton } from "@/components/ui/skeleton";
import { HBLScanner } from "./components/hbl-scanner";
import { ParcelsList } from "./components/parcels-list";
import { Stats } from "./components/stats";

export default function MainPage() {
	const [selectedContainer, setSelectedContainer] = useState<{ id: number } | null>(null);
	const { data, isLoading, isError } = useFetchParcelsByContainerId(selectedContainer?.id ?? null);
	const [parcels, setParcels] = useState(() => {
		// Initialize from localStorage if available
		const saved = localStorage.getItem(`parcels-${selectedContainer?.id}`);
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		if (data) {
			setParcels(data.data.map((item: any) => ({ ...item, scanned: false })));
		}
	}, [data]);

	

	const handleScan = (hbl: string) => {
		setParcels((prevPackages: any) => {
			const index = prevPackages.findIndex((pkg: any) => pkg.hbl === hbl);
			if (index !== -1 && !prevPackages[index].scanned) {
				const newPackages = [...prevPackages];
				newPackages[index] = {
					...newPackages[index],
					scanned: true,
					scannedAt: new Date().toISOString(),
				};
				// Sort packages by scannedAt date in descending order
				return newPackages.sort((a, b) => {
					if (!a.scannedAt) return 1;
					if (!b.scannedAt) return -1;
					return new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime();
				});
			}

			return prevPackages;
		});
		localStorage.setItem(`parcels-${selectedContainer?.id}`, JSON.stringify(parcels));
	};

	return (
		<div className="flex flex-col relative gap-2 mt-2 p-1">
			<ContainerSelect setSelectedContainer={setSelectedContainer} />
			{selectedContainer ? (
				isLoading ? (
					<Skeleton className="min-h-[500px] w-full" />
				) : isError ? (
					<div>Error</div>
				) : (
					<>
						<div className="flex flex-col gap-2">
							<HBLScanner onScan={handleScan} />
						</div>
						{/* <DataTable columns={columns} data={filteredData || []} /> */}
						<ParcelsList parcels={parcels || []} />
					</>
				)
			) : (
				<NoContainerSelected />
			)}
			<Stats parcels={parcels || []} />
		</div>
	);
}
