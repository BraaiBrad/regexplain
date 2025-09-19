import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "regexplain-api" });
});

// Mock explain endpoint for now
app.post("/api/explain", (req, res) => {
  const { regex = "", flags = "", mode = "beginner" } = req.body || {};
  // quick validation
  try { new RegExp(regex, flags); } catch (e:any) {
    return res.status(400).json({ error: `Invalid regex: ${e.message}` });
  }
  return res.json({
    summary: `(${mode}) This pattern matches a simple mocked description of /${regex}/${flags}.`,
    steps: ["Tokenize input", "Apply quantifiers", "Validate anchors"],
    matches: ["ab12", "cd34"],
    nonMatches: ["xx", "12345"],
    edgeCases: ["", "veryyyyy long strings"]
  });
});

const PORT = Number(process.env.PORT || 8787);
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
