import { useState } from "react";
import { CameraScan } from "./components/camera-scan-input";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const ScanXzing = () => {
	const [cameraMode, setCameraMode] = useState(false);
	const [hbls, setHbls] = useState<string[]>([]);

	const formatHbl = (value: string) => {
		const hblNumber = value.startsWith("CTE") ? value : value.split(",")[1];
		// Format the HBL number to uppercase and remove any whitespace
		const formattedHbl = hblNumber?.trim().toUpperCase() ?? "";
		// Only add if the HBL is not already in the array
		setHbls((prev) => (prev.includes(formattedHbl) ? prev : [...prev, formattedHbl]));
	};
	const handleScan = (hbl: string) => {
		formatHbl(hbl);
	};
	return (
		<div>
			<div className="space-y-2">
				<div className="flex items-center justify-end mx-2 space-x-2">
					<Switch id="camera-mode" checked={cameraMode} onCheckedChange={setCameraMode} />
					<Label htmlFor="camera-mode">{cameraMode ? "Camera" : "Input"}</Label>
				</div>
				{cameraMode ? <CameraScan onScan={handleScan} /> : <HblScanner handleScan={handleScan} />}
			</div>
			<div className="flex flex-col gap-2">
				{hbls.map((hbl) => (
					<p className="text-sm" key={hbl}>
						{hbl}
					</p>
				))}
			</div>
		</div>
	);
};

const HblScanner = ({ handleScan }: { handleScan: (hbl: string) => void }) => {
	const [scanValue, setScanValue] = useState("");
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleScan(scanValue);
		setScanValue("");
	};
	return (
		<form onSubmit={handleSubmit} className="flex gap-2 px-2">
			<Input
				placeholder="Escanear HBL..."
				value={scanValue}
				onChange={(e) => setScanValue(e.target.value)}
				className="flex-1"
				autoFocus
			/>
		</form>
	);
};
