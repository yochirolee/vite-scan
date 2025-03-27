import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function toCamelCase(str: string) {
	return str
		.toLowerCase()
		.replace(/[-_\s](.)/g, (_, c) => c.toUpperCase())
		.replace(/^(.)/, (_, c) => c.toUpperCase());
}

export const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes().toString().padStart(2, "0");

	const ampm = hours >= 12 ? "pm" : "am";
	const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

	return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
};
