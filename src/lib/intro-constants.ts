export const INTRO_SEEN_KEY = "intro-seen";
export const INTRO_SKIP_CLASS = "intro-skip";

/** Runs before first paint: skip the loader on repeat visits / reduced motion. */
export const introSkipScript = `try{if(sessionStorage.getItem("${INTRO_SEEN_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("${INTRO_SKIP_CLASS}")}catch(e){}`;
