import { useEffect, useState } from "react";
import { ContainerSelect } from "./components/container-select";
import { useGetParcelsByContainerToUngroup } from "./hooks/use-containers";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, ShipWheel, Weight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ContainerSelectPage() {
	const [selectedContainer, setSelectedContainer] = useState<any | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (selectedContainer?.id) {
			const containerData = localStorage.getItem(`container-${selectedContainer.id}`);
			if (containerData) {
				const { isDone } = JSON.parse(containerData);
				if (!isDone) {
					navigate(`/ungroup/${selectedContainer.id}`);
				}
			}
		}
	}, [selectedContainer, navigate]);

	const { data, isLoading, isError } = useGetParcelsByContainerToUngroup(selectedContainer?.id);

	const handleStartUngroup = () => {
		//save the container id and data in the local storage
		localStorage.setItem(
			`container-${selectedContainer?.id}`,
			JSON.stringify({
				action: "ungroup",
				containerId: selectedContainer?.id,
				parcels: data,
				isDone: false,
			}),
		);
		navigate(`/ungroup/${selectedContainer?.id}`);
	};

	return (
		<div className="grid grid-cols-1 gap-4  items-center justify-center h-full">
			<div className="flex gap-2 justify-between">
				<Button size="icon" variant="ghost" onClick={() => navigate("/main")}>
					<ArrowLeft />
				</Button>
				<div className="flex-1  gap-2">
					<ContainerSelect setSelectedContainer={setSelectedContainer} />
				</div>
			</div>

			{isError && <div>Error</div>}

			{isLoading ? (
				<Card>
					<CardContent className="flex flex-col p-4 space-y-2 gap-2">
						<CardTitle className="inline-flex items-center space-x-2 text-sm border-b pb-2">
							<Skeleton className="w-full h-4" />
						</CardTitle>
						<CardDescription className="text-sm grid grid-cols-2 gap-2 items-center ap-2">
							<Skeleton className="w-full h-full" />
							<div>
								<Skeleton className="w-full h-10" />
							</div>
						</CardDescription>
					</CardContent>
				</Card>
			) : (
				selectedContainer && (
					<Card>
						<CardContent className="flex flex-col p-4 space-y-2 gap-2">
							<CardTitle className="inline-flex items-center space-x-2 text-sm border-b pb-2">
								<h3 className="text-sm font-bold">{selectedContainer?.name}</h3>{" "}
								<p className="text-xs text-muted-foreground">{selectedContainer?.id}</p>
							</CardTitle>
							<CardDescription className="text-sm grid grid-cols-2 g items-center ap-2">
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2 ">
										<ShipWheel className="w-4 h-4" />
										{selectedContainer?.master}
									</div>

									<div className="flex items-center gap-2">
										<Weight className="w-4 h-4" />
										{selectedContainer?.weight}
									</div>
									<div className="flex items-center gap-2">
										<Package className="w-4 h-4" />
										{selectedContainer?.total_parcels}
									</div>
								</div>
								<div>
									<Button onClick={handleStartUngroup}>Comenzar Desagrupe</Button>
								</div>
							</CardDescription>
						</CardContent>
					</Card>
				)
			)}
		</div>
	);
}
