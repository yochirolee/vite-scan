import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { FileTextIcon, Tag } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

export const columns: ColumnDef<any>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "agency",
		header: "Agencia",
		cell: ({ row }) => (
			<div className="space-y-1">
				<p className="font-medium text-xs md:text-sm text-sky-800">{row.original?.agency}</p>
			</div>
		),
		enableSorting: true,
	},

	{
		accessorKey: "hbl",
		header: "Hbl",
		cell: ({ row }) => (
			<div className="space-y-1">
				<div className="flex flex-col items-left gap-3">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									to={`https://systemcaribetravel.com/ordenes/factura_print.php?id=${row.original.invoiceId}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 "
								>
									<FileTextIcon size={16} className="h-4 w-4 text-sky-700" />
									{row.original.invoiceId}
								</Link>
							</TooltipTrigger>
							<TooltipContent>
								<p>Ver Factura</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									to={`https://systemcaribetravel.com/ordenes/etiqueta_print_transcargo.php?id=${row.original?.invoiceId}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 "
								>
									<Tag size={16} className="h-4 w-4 text-sky-700" />
									{row.original?.hbl}
								</Link>
							</TooltipTrigger>
							<TooltipContent>
								<p>Ver Etiquetas</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				<p className="text-xs text-muted-foreground">{row.original?.description}</p>
			</div>
		),
		enableSorting: true,
	},

	{
		accessorKey: "location",
		header: "Location",
		cell: ({ row }) => {
			return (
				<div className="flex flex-col space-y-2">
					<p className="text-xs text-muted-foreground">{row.original?.location}</p>
				</div>
			);
		},
		enableSorting: true,
	},
];
