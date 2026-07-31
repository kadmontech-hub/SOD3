# Asset pipeline

## Required final assets

- Official SØD logo in SVG plus monochrome versions.
- Display font license or approved alternative.
- Hub equirectangular panoramas: desktop 8K WebP/AVIF, mobile 4K, fallback 2K.
- Optional GLB orb and artifacts, compressed with Meshopt or Draco.
- KTX2/Basis textures; 2K default, 4K only for hero devices.
- Separate ambient, voice and effect audio stems.
- Elementos images, transparent assets and optional GLB models mapped by piece ID.

## Stable identifiers

Universes use their slug. Element pieces use `<element>-<number>`, for example `eter-33`. Replacing assets must not alter routes or IDs.

## Budgets

- Critical shell under 4 MB.
- Initial scene under 12 MB.
- Mobile panorama under 4 MB.
- Desktop panorama under 8 MB.
- Preferred single GLB under 6 MB.
