import { useState } from "react";
import { useZxing } from "react-zxing";
import { useMediaDevices } from "react-media-devices";

const constraints: MediaStreamConstraints = {
	audio: false,
	video: {
		facingMode: "environment",
	},
};

export const CameraScan = () => {
	const [scanResult, setScanResult] = useState<string[] | null>(null);
	const { devices } = useMediaDevices({
		constraints,
	});

	const deviceId = devices?.[0]?.deviceId;

	const { ref } = useZxing({
		deviceId,
		onDecodeResult: (result) => {
			setScanResult((prev) => [...(prev || []), result.getText()]);
		},
	});

	const handleScan = () => {
		setScanResult(null);
	};

	return (
		<div>
			<div className="relative flex flex-col gap-4">
				<div className="relative h-[33vh]">
					<video ref={ref} className="w-full h-full object-cover" />
					{/* QR Scanner Overlay */}
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-64 h-64 border-2 border-white rounded-lg relative">
							{/* Corner markers */}
							<div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl"></div>
							<div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr"></div>
							<div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl"></div>
							<div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br"></div>
						</div>
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-64 h-1 bg-green-500 animate-scan" />
						</div>
					</div>
				</div>
				<p>{scanResult}</p>
			</div>
			<button onClick={handleScan}>Scan</button>
		</div>
	);
};
