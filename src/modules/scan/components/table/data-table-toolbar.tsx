import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "@/components/common/table/data-table-view-option";

import { locations, statuses } from "@/data/data";
import { DataTableFacetedFilter } from "@/components/common/table/data-table-faceted-filters";
import { X } from "lucide-react";

interface TableData {
	agency?: string;
	location?: string;
}

interface DataTableToolbarProps<TData extends TableData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData extends TableData>({ table }: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;
	

	return (
		<div className="flex  ">
			<div className="flex flex-1 items-center space-x-2">
				{table.getColumn("agency") && (
					<DataTableFacetedFilter
						column={table.getColumn("agency")}
						title="Agencias"
						options={Array.from(new Set(table.getCoreRowModel().rows.map((row) => row?.original?.agency)))
							.map(agency => ({
								label: agency || 'Unknown',
								value: agency || "",
							}))}
					/>
				)}
				{table.getColumn("location") && (
					<DataTableFacetedFilter
						column={table.getColumn("location")}
						title="Location"
						options={locations}
					/>
				)}

				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<X className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>
			<div className="flex items-center space-x-2 justify-end">
				<DataTableViewOptions table={table} />
			</div>
		</div>
	);
}
