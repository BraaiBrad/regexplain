# Regexplain 🎯

Explain any regular expression in plain English.

## 📦 Project Structure
- `server/` → Express + TypeScript API (port 8787)
- `client/` → React + Vite frontend (port 5173)

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ (LTS) or 22.12+
- npm 9+

### 1. Clone & setup
```bash
git clone git@github.com:BraaiBrad/regexplain.git
cd regexplain 
```
#### 2. Install Dependencies
```bash 
# install root tools (concurrently)
npm install
# install client and server separately
cd client && npm install
cd ../server && npm install
```
### 3. Run both client & server together 
```bash
npm run dev
```
### 4. Environment variables
Create a .env inside server/
OPENAI_API_KEY=your-key-here
OPENAI_MODEL=gpt-5
PORT=8787
