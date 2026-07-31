# Performance

The MVP has no third-party JavaScript, images or fonts in its critical path. The scene adapts particle density and caps DPR. Animations use one requestAnimationFrame loop and are disposed when leaving the hub. Future panorama/GLB versions must preserve staged loading, abort abandoned fetches and release GPU resources on unmount.
