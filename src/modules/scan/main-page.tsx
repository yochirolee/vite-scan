import { Input } from "@/components/ui/input";

import { ContainerSelect } from "./components/container-select";
import { useEffect, useState } from "react";
import { NoContainerSelected } from "./components/no-container-select";
import { useFetchParcelsByContainerId } from "./hooks/use-containers";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "./components/table/data-table";
import { columns } from "./components/table/columns";

export default function MainPage() {
	const [selectedContainer, setSelectedContainer] = useState<{ id: number } | null>(null);
	const { data, isLoading, isError } = useFetchParcelsByContainerId(selectedContainer?.id ?? null);

	return (
		<div className="flex flex-col gap-2">
			<ContainerSelect setSelectedContainer={setSelectedContainer} />
			{selectedContainer ? (
				isLoading ? (
					<Skeleton className="min-h-[500px] w-full" />
				) : isError ? (
					<div>Error</div>
				) : (
					<>
						<Input />
						<DataTable columns={columns} data={data || []} />
					</>
				)
			) : (
				<NoContainerSelected />
			)}
		</div>
	);
}
