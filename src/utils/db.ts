import { openDB } from "idb";
import type { Shipment } from "@/types";

const dbName = "package-tracker-db";
const dbVersion = 1;

export const initDB = async () => {
	const db = await openDB(dbName, dbVersion, {
		upgrade(db) {
			if (!db.objectStoreNames.contains("scannedShipments")) {
				db.createObjectStore("scannedShipments", { keyPath: "hbl" });
			}
		},
	});
	return db;
};

export const saveScannedShipment = async (shipment: Shipment) => {
	const db = await initDB();
	await db.put("scannedShipments", shipment);
};

export const getScannedShipments = async () => {
	const db = await initDB();
	return db.getAll("scannedShipments");
};
