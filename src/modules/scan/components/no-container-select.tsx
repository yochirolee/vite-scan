export function NoContainerSelected() {
	return (
		<div className="flex flex-1 min-h-[500px] my-6 items-center justify-center rounded-lg border border-dashed shadow-sm">
			<div className="flex flex-col items-center gap-1 text-center">
				<h3 className="text-2xl font-bold tracking-tight">No se ha seleccionado contenedor</h3>
				<p className="text-sm text-muted-foreground">
					Seleccione un contenedor para comenzar el desagrupe.
				</p>
			</div>
		</div>
	);
}
