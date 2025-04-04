export default function NoShipments() {
	return (
		<div className="flex flex-1 h-60 p-4 m-4 items-center justify-center rounded-lg border border-dashed shadow-sm">
			<div className="flex flex-col items-center gap-1 text-center">
				<h3 className="text-2xl font-bold tracking-tight">Comienza a escanear</h3>
				<p className="text-sm text-muted-foreground">
					Escanea los HBLs de la factura para comenzar la entregar.
				</p>
			</div>
		</div>
	);
}
