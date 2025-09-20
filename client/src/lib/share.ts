/**
 * A shared utility module for the client
 * Contains functions to read and write URL parameters for permalinks
 * and a function to copy text to clipboard
 */


/**
 * Set URL query parameters without reloading the page
 * @param params key-value pairs to set as URL query parameters
 */
export function setPermalink(params: Record<string,string>) {
    const q = new URLSearchParams(params);
    window.history.replaceState({}, "", `?${q.toString()}`);
}

/**
 * A read URL query parameters from the current window location 
 * @returns An object with regex, flags, and mode from URL query parameters
 */
export function readParams(){
    const u = new URLSearchParams(window.location.search);
    return {
        regex: u.get("regex") || "",
        flags: u.get("flags") || "",
        mode: u.get("mode") || ""
    };
}

/**
 * Copy text to clipboard using the Clipboard API
 * @param text text to copy to clipboard
 * @returns true if successful, false otherwise
 */
export async function copy(text:string){
    try { await navigator.clipboard.writeText(text); return true; }
    catch(e){ return false; }
}