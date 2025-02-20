import React, { useState, useCallback, useEffect } from "react";
import { Geolocation, Position } from "@capacitor/geolocation";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function GeolocationPage() {
	const [loc, setLoc] = useState<Position | null>(null);
	const [location, setLocation] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);

	const getCurrentPosition = useCallback(async () => {
		const coordinates = await Geolocation.getCurrentPosition();
		setLoc(coordinates);
		if (coordinates) {
			await fetchLocation();
		}
	}, []);

	useEffect(() => {
		fetchLocation();
	}, [loc?.coords.latitude, loc?.coords.longitude]);

	const fetchLocation = async () => {
		try {
			if (loc) {
				const response = await axios.get(
					`https://nominatim.openstreetmap.org/reverse?lat=${loc?.coords.latitude}&lon=${loc?.coords.longitude}&format=json`,
				);
				console.log(response.data);
				setLocation(response.data);
				setError(null);
			}
		} catch (err) {
			setError("No se pudo obtener la ubicación.");
			setLocation(null);
		}
	};

	return (
		<div>
			{error && <p>{error}</p>}
			<div className="flex gap-2">
				<Badge>{location?.display_name}</Badge>
				<Badge>{location?.address?.city}</Badge>
				<Badge>{location?.address?.state}</Badge>
			</div>
			<h1>Geolocation</h1>
			<p>Your location is:</p>
			<p>Latitude: {loc?.coords.latitude}</p>
			<p>Longitude: {loc?.coords.longitude}</p>

			<Button onClick={getCurrentPosition}>Get Current Location</Button>
		</div>
	);
}
