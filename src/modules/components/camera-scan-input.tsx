import { useState } from "react";
import { useZxing } from "react-zxing";
import { useMediaDevices } from "react-media-devices";

const constraints: MediaStreamConstraints = {
	audio: false,
	video: {
		facingMode: "environment",
		width: { ideal: 1280 },
		height: { ideal: 720 },
		aspectRatio: { ideal: 1.777777778 },
		frameRate: { ideal: 30 },
	},
};

export const CameraScan = ({ onScan }: { onScan: (hbl: string) => void }) => {
	const { devices } = useMediaDevices({
		constraints,
	});

	const deviceId = devices?.[0]?.deviceId;

	const { ref } = useZxing({
		deviceId: deviceId,
		onDecodeResult: (result) => {
			onScan(result.getText());
		},
		constraints,
		timeBetweenDecodingAttempts: 300,
	});

	return (
		<div>
			<div className="flex h-[33vh] flex-col gap-4">
				<video ref={ref} className="w-full h-full object-cover" autoPlay playsInline />
			</div>
		</div>
	);
};
