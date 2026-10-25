/**
 * Where the hero switches from the 16:9 film to its 9:16 cut (see <HeroBackground/>).
 * Shared by the poster's <picture>, its preloads and the film's <source>s, which
 * have to agree on the same screen or a phone would show one cut's poster under
 * the other cut's film. The two never both match: 801/1000 is just past 4/5.
 */
export const HERO_PORTRAIT = "(max-aspect-ratio: 4/5)";
export const HERO_LANDSCAPE = "(min-aspect-ratio: 801/1000)";
