"use client";

import { useState } from "react";

import { LightboxGaleria } from "@/components/LightboxGaleria";
import { Foto } from "@/components/ui";
import type { FotoCultura } from "@/lib/cultura";

/*
 * Galería de Cultura: rejilla de miniaturas que abre el lightbox.
 *
 * La rejilla es un `grid` de 2 columnas en móvil y 3 en PC, con fotos
 * cuadradas (object-cover). Cada miniatura es un <button> con nombre
 * accesible ("Ampliar: ..."), así se llega al lightbox con teclado o
 * lector de pantalla, no solo con el dedo.
 */
export function GaleriaCultura({ fotos }: { fotos: FotoCultura[] }) {
	const [abierta, setAbierta] = useState<number | null>(null);

	if (fotos.length === 0) return null;

	return (
		<>
			<ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
				{fotos.map((foto, i) => (
					<li key={`${foto.src}-${i}`}>
						<button
							type="button"
							onClick={() => setAbierta(i)}
							aria-label={`Ampliar: ${foto.alt}`}
							className="block w-full overflow-hidden rounded-2xl border border-black/10 transition hover:opacity-90 active:scale-[.99]"
						>
							<Foto
								src={foto.src}
								alt={foto.alt}
								className="aspect-square w-full"
							/>
						</button>
					</li>
				))}
			</ul>

			{abierta != null && (
				<LightboxGaleria
					fotos={fotos}
					indice={abierta}
					onIndice={setAbierta}
					onCerrar={() => setAbierta(null)}
				/>
			)}
		</>
	);
}
