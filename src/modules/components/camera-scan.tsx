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
			<video ref={ref} />
			<p>{scanResult}</p>
			<button onClick={handleScan}>Scan</button>
		</div>
	);
};
