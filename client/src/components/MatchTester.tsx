import { useMemo, useState } from "react";

export default function MatchTester({ pattern, flags }: { pattern: string; flags: string }) {

    const [text, setText] = useState("Try: ab12 cd34\nxx 12345 ab99"); // default test text

    // compute matches and highlighted version
    /**
     * ok: whether the regex is valid
     * error: error message if not valid
     * matches: array of matched substrings
     * highlighted: HTML string with matches wrapped in <mark> tags
     */
    const { ok, error, matches, highlighted } = useMemo(() => {
        try{
            // create regex
            const re = new RegExp(pattern, flags || ""); // default to no flags
            
            // --- find all matches ---
            const all: { start: number; end: number; str: string }[] = []; // start/end indices and matched string
            if (flags.includes("g")) {
                let m: RegExpExecArray | null; 
                /**
                 * Using exec in a loop to find all matches, as matchAll is not supported in all browsers
                 */
                while ((m = re.exec(text)) !== null) {
                    /**
                     * m.index is the start index of the match
                     * m[0] is the matched string
                     * m[0].length is the length of the matched string
                     * re.lastIndex is updated automatically to the index after the last match
                     * If the match is zero-length, we manually increment lastIndex to avoid infinite loops
                     */
                    all.push({ start: m.index, end: m.index + m[0].length, str: m[0] });
                    if(m[0].length === 0) re.lastIndex++;
                }
            } else {
                /**
                 * If no 'g' flag, just find the first match (if any)
                 */
                const m = re.exec(text);
                /**
                 * if m is not null, we have a match
                 */
                if (m) all.push({ start: m.index, end: m.index + m[0].length, str: m[0] });
            }

            // --- create highlighted version ---
            let html = "";
            let i = 0;
            // go through all matches and wrap them in <mark> tags, escaping HTML as we go. A mark tag is like a <span> but with a yellow background by default
            for (const {start, end} of all) {
                html += escapeHtml(text.slice(i, start));
                html += `<mark>${escapeHtml(text.slice(start, end))}</mark>`;
                i = end;
            }
            html += escapeHtml(text.slice(i));
            return { ok: true, error: "", matches: all.map(a => a.str), highlighted: html };
        } catch(e:any) {
            return { ok: false, error: e.message, matches: [], highlighted: escapeHtml(text) };
        }
    }, [pattern, flags, text]);
        
    return (
        <section className="card" style={{ marginTop: "2rem" }}>
            <h2>Live Match Tester</h2>
            <textarea 
                value={text} 
                onChange={e => setText(e.target.value)} 
                rows={5}
                style={{ width: "100%" }}
                placeholder="Enter regex here" 
            />
            {!ok && <p style={{ color: "red" }}>Regex Error: {error}</p>}
            <div style={{ whiteSpace: "pre-wrap", marginTop: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: 4, minHeight: 100 }}
                dangerouslySetInnerHTML={{ __html: highlighted }}
            />
            <p style={{opacity: 0.7, marginTop: "0.5rem"}}>Matches: {matches.length ? matches.join(", ") : "none"}</p>
        </section>
    );
}

/**
 * A simple function to escape HTML special characters in a string
 * @param s string to escape
 * @returns A string with HTML special characters replaced by their entities. For example, & becomes &amp;, < becomes &lt;, etc.
 */
function escapeHtml(s:string){
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
  }