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
