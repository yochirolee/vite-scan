import { z } from "zod";
import { ParcelsList } from "./components/parcels-list";
import { useGetParcelsByContainerToUngroup } from "./hooks/use-containers";

import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
	FormControl,
	FormLabel,
	FormMessage,
	Form,
	FormField,
	FormItem,
} from "@/components/ui/form";

const ungroupFormSchema = z.object({
	hbl: z.string().min(8, { message: "HBL is required" }),
});

type UnGroupForm = z.infer<typeof ungroupFormSchema>;
const UngroupForm = ({ onSubmit }: { onSubmit: (data: UnGroupForm) => void }) => {
	const form = useForm<UnGroupForm>({
		resolver: zodResolver(ungroupFormSchema),
	});

	const formatHbl = (value: string) => {
		const hblNumber = value.startsWith("CTE") ? value : value.split(",")[1];
		// Format the HBL number to uppercase and remove any whitespace
		const formattedHbl = hblNumber?.trim().toUpperCase() ?? "";
		form.setValue("hbl", formattedHbl);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col my-2 gap-2">
				<FormField
					control={form.control}
					name="hbl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>HBL</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="Scan or type HBL number"
									onChange={(e) => {
										const value = e.target.value.trim().toUpperCase();
										field.onChange(value);
										formatHbl(value);
									}}
									autoComplete="off"
									autoFocus
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};

const Ungroup = () => {
	const { id } = useParams();
	const { data, isLoading, error } = useGetParcelsByContainerToUngroup(Number(id));

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	const onSubmit = (formData: UnGroupForm) => {
		const { hbl } = formData;
		const parcel = data?.find((parcel) => parcel.hbl === hbl);
		if (!parcel) return;
		console.log(parcel);
	};

	return (
		<div>
			<h1>Desagrupe</h1>
			<UngroupForm onSubmit={onSubmit} />
			<ParcelsList parcels={data || []} />
		</div>
	);
};

export default Ungroup;
