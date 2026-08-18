/**
 * Tuning for the screen stage: the game is drawn into an offscreen buffer at
 * the usual crispness, then this stage re-photographs it as a 90s cel anime
 * frame played off a VHS tape into a CRT.
 *
 * Nothing here animates. The grain, the ink jitter and the shaded border are
 * all fixed to the screen, so the only thing that moves in the picture is the
 * game — no crawling noise, no tracking bands, no sync roll.
 *
 * Distances are in *virtual* pixels (the 960x480 view), not device pixels, so
 * the look holds at any window size or pixel ratio.
 */

/** Cel look — flat painted bands, muted stock, ink lines. */
export const CEL_BANDS = 6;
export const CEL_MIX = 0.72;
export const CEL_SATURATION = 0.9;
/**
 * The split tone: shadows cool, highlights warm. Widening the gap between
 * these is what makes the picture more colourful without simply turning the
 * saturation up, since it puts colour into the flat areas too.
 */
export const SHADOW_TINT: readonly [number, number, number] = [
  0.76, 0.92, 1.15,
];
export const HIGHLIGHT_TINT: readonly [number, number, number] = [
  1.15, 1.02, 0.81,
];
export const INK_COLOR: readonly [number, number, number] = [0.055, 0.05, 0.09];
/** Light: the art is already drawn with outlines, this only re-inks them. */
export const INK_STRENGTH = 0.16;
export const INK_THRESHOLD = 0.3;
export const INK_SOFTNESS = 0.26;
/** A fixed wobble off the drawn edge, so the ink is not a perfect machine line. */
export const INK_JITTER = 0.3;

/** Tape — chroma lags a little behind luma, and the stock is grainy. */
export const CHROMA_SPLIT = 0.4;
export const CHROMA_BLEED = 1.5;
export const CHROMA_LAG = 0.22;

/**
 * Stock — four static layers of texture rather than one loud one. The tape
 * has a per-pixel speckle with a softer clump drifting over it; the cel under
 * it has a coarse blotch and a fine fibre. Every layer but the blotch is
 * centred on zero, so none of them shifts the grade.
 */
export const TAPE_GRAIN = 0.028;
export const TAPE_CLUMP = 0.02;
/** Virtual pixels per clump of emulsion. */
export const TAPE_CLUMP_PITCH = 2.5;
export const PAPER_GRAIN = 0.028;
export const PAPER_FIBRE = 0.02;
/** Virtual pixels per fibre of the cel. */
export const PAPER_FIBRE_PITCH = 2;
/** The 45-degree print dot the cels were photographed through. */
export const SCREENTONE_DEPTH = 0.01;
/** Virtual pixels per dot, snapped to whole device pixels where it is used. */
export const SCREENTONE_PITCH = 3;
/**
 * Virtual pixels the dot lattice wanders off its grid. A print screen laid on
 * by hand is never perfectly square to the frame, and the drift is what keeps
 * the lattice from reading as a machine pattern.
 */
export const SCREENTONE_DRIFT = 1.5;

/**
 * The border band — the outer ring of the frame the darkening rides on. It is
 * nothing until `EDGE_BAND_START` of the way out to the nearest border and
 * reaches full strength at the border itself.
 *
 * The picture is sharp everywhere. There is no lens softening here and no
 * corner treatment: the band drives the shade and the dark glow only, and
 * both of those follow the nearest border, so they are even the whole way
 * around and want nothing special done to the corners.
 */
export const EDGE_BAND_START = 0.62;
/**
 * How far the band's inner boundary wanders, as a share of the half-frame,
 * and the virtual pixels per undulation of that wander. Without it the shade
 * comes in along a ruled line the eye can trace all the way round; with it the
 * band breathes in and out and reads as glass rather than as a mask laid over
 * the picture.
 *
 * The wander is zero-mean, so it moves where the band falls without moving how
 * much of the frame it covers — which is what lets the exposure below treat it
 * as if it were not there.
 */
export const EDGE_BAND_WANDER = 0.1;
export const EDGE_BAND_WANDER_PITCH = 90;

/** CRT — flat glass, scanlines, shadow mask, a soft bloom. */
export const SCANLINE_DEPTH = 0.07;
/**
 * Virtual pixels per scanline. One line per virtual pixel is finer than the
 * display can resolve and just averages back out to a flat dimming, so the
 * lines sit on every other one. The pitch is snapped to whole device pixels
 * when it is used, so the lines stay put instead of beating against the
 * scrolling scene.
 */
export const SCANLINE_PITCH = 2;
export const MASK_DEPTH = 0.02;
export const BLOOM_AMOUNT = 0.2;
export const BLOOM_RADIUS = 2.5;
export const BLOOM_THRESHOLD = 0.55;
/**
 * Veiling glare — the glass of the tube glowing, as distinct from the bloom
 * off the phosphor: far wider, far weaker, and not thresholded, so it lifts
 * the picture as a whole rather than haloing the bright parts.
 */
export const GLOW_AMOUNT = 0.08;
export const GLOW_RADIUS = 12;
export const VIGNETTE = 0.14;
/**
 * The shade around the border, as distinct from the vignette: the vignette is
 * radial, so nearly all of it lands in the corners, while this follows the
 * nearest border and so reads as a frame drawn around the picture. It rides
 * its own ramp rather than the band's, starting later, so the shade sits
 * tighter to the edge than the dark glow does.
 */
export const EDGE_SHADOW_START = 0.72;
export const EDGE_SHADOW_DEPTH = 0.12;
/**
 * The dark glow: the veiling glare run backwards, so the border drinks light
 * instead of giving it off. It is taken from the same kind of broad ring
 * average as `GLOW_*`, which is what makes it a glow rather than a gradient —
 * the shade pools where the picture near the border is bright and all but
 * disappears over the parts that are already dark.
 *
 * It rides the border band rather than the shade's narrower ramp, so it is the
 * wider of the two darkenings and inherits the same wandering boundary.
 */
export const EDGE_GLOW_AMOUNT = 0.14;
export const EDGE_GLOW_RADIUS = 14;
/**
 * Scanlines, mask, vignette, edge shade and dark glow all take light away;
 * this puts it back. Their mean losses are `1 - depth / 2`, `1 - depth / 3`
 * and `1 - vignette / 3`; for the edge shade `1 - depth * w * (start + 0.7w)`
 * with `w = 1 - start`, that being the mean of its smoothstep over the frame,
 * where the distance to the nearest border has density `2m`; and for the dark
 * glow the same expression with `EDGE_GLOW_AMOUNT` over the border band, since
 * its ring average tracks the picture's own brightness closely enough to stand
 * in for it. This is their product inverted, divided again by
 * `1 + GLOW_AMOUNT` for the light the glare adds. Changing any of those
 * without following it here would move the whole picture and change the grade.
 */
export const EXPOSURE = 0.9973;
