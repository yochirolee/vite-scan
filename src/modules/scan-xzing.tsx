import { useState } from "react";
import { CameraScan } from "./components/camera-scan-input";

export const ScanXzing = () => {
	const [hbls, setHbls] = useState<string[]>([]);
	const handleScan = (hbl: string) => {
		setHbls((prev) => [...prev, hbl]);
	};
	return (
		<div>
			<div>
				<CameraScan onScan={handleScan} />
			</div>
			<div>
				<p>{hbls.join(", ")}</p>
			</div>
		</div>
	);
};
