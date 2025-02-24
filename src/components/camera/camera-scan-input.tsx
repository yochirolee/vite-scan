import { useZxing } from "react-zxing";
import { useMediaDevices } from "react-media-devices";
import { useSound } from "use-sound";
import scanSound from "../../success-beep.mp3";
import { useEffect, useState } from "react";

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

interface CameraScanProps {
	onScan: (hbl: string) => void;
	isLoading: boolean;
}

export const CameraScan = ({ onScan, isLoading }: CameraScanProps): JSX.Element => {
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const [hasPermission, setHasPermission] = useState(false);

	useEffect(() => {
		const handleOnlineStatus = () => setIsOnline(navigator.onLine);
		window.addEventListener("online", handleOnlineStatus);
		window.addEventListener("offline", handleOnlineStatus);

		// Check camera permission
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then(() => setHasPermission(true))
			.catch(() => setHasPermission(false));

		return () => {
			window.removeEventListener("online", handleOnlineStatus);
			window.removeEventListener("offline", handleOnlineStatus);
		};
	}, []);

	const { devices } = useMediaDevices({
		constraints,
	});
	const [play] = useSound(scanSound);

	const deviceId = devices?.[0]?.deviceId;

	const { ref } = useZxing({
		deviceId: deviceId,
		onDecodeResult: (result) => {
			if (!isLoading) {
				onScan(result.getText());
				play();
			}
		},
		constraints,
		timeBetweenDecodingAttempts: 100,
	});

	if (!isOnline) {
		return (
			<div className="flex flex-col items-center justify-center p-4">
				<p className="text-red-500">You are currently offline</p>
				<p>Some features may be limited</p>
			</div>
		);
	}

	if (!hasPermission) {
		return (
			<div className="flex flex-col items-center justify-center p-4">
				<p className="text-red-500">Camera permission is required</p>
				<button
					className="mt-2 px-4 py-2 bg-primary text-white rounded"
					onClick={() => {
						navigator.mediaDevices.getUserMedia({ video: true }).then(() => setHasPermission(true));
					}}
				>
					Grant Permission
				</button>
			</div>
		);
	}

	return (
		<div>
			<div className=" h-[33vh] ">
				<video ref={ref} className="w-full h-full  object-cover" autoPlay playsInline />
			</div>
		</div>
	);
};
