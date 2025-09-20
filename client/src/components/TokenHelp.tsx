/**
 * Component to display regex tokens with tooltips
 */

// --- token help data ---
/**
 * HELP maps regex tokens to brief explanations
 * Used to show tooltips when hovering over tokens
 * Only a subset of common tokens are included
 */
const HELP: Record<string,string> = {
    ".": "Any char (except newline unless /s)",
    "\\d": "Digit [0-9]",
    "\\w": "Word char [A-Za-z0-9_]",
    "\\s": "Whitespace",
    "\\b": "Word boundary",
    "^": "Start of line/string",
    "$": "End of line/string",
    "+": "One or more (greedy)",
    "*": "Zero or more (greedy)",
    "?": "Optional OR makes quantifiers lazy",
    "{n}": "Exactly n times",
    "{n,}": "At least n times",
    "{n,m}": "Between n and m times",
    "(...)": "Capturing group",
    "(?:...)": "Non-capturing group",
    "|": "Alternation",
    "[abc]": "Character class",
    "[^abc]": "Negated class"
  };
  
  /**
   * A simple regex tokenizer that splits a pattern into tokens
   * Used to display tokens with tooltips
   * @param pattern regex pattern string
   * @returns An array of token strings
   */
  function tokenize(pattern:string){
    // very simple tokenizer: try known multi-char tokens first
    const out:string[] = [];
    for (let i=0;i<pattern.length;){
      const two = pattern.slice(i,i+2);
      if (["\\d","\\w","\\s","\\b"].includes(two)) { out.push(two); i+=2; continue; }
      const three = pattern.slice(i,i+3);
      if (/^\{\d+\}$/.test(three)) { out.push(three); i+=3; continue; }
      const five = pattern.slice(i,i+5);
      if (/^\{\d+,\}$/.test(five)) { out.push(five); i+=5; continue; }
      const range = pattern.slice(i).match(/^\{\d+,\d+\}/)?.[0];
      if (range){ out.push(range); i+=range.length; continue; }
      out.push(pattern[i]); i++;
    }
    return out;
  }
  
  /**
   * TokenHelp component displays regex tokens with tooltips
   * @param param0 props with pattern string
   * @returns a JSX element showing tokens
   */
  export default function TokenHelp({ pattern }:{ pattern:string }){
    const toks = tokenize(pattern);
    return (
      <div className="card" style={{marginTop:16}}>
        <h3>Tokens & tips</h3>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {toks.map((t,i)=>(
            <span key={i} title={HELP[t] || "No note"} style={{
              border:"1px solid #ddd", padding:"4px 8px", borderRadius:8, cursor:"help"
            }}>
              <code>{t}</code>
            </span>
          ))}
        </div>
      </div>
    );
  }
  