# Equity Analysis Platform

Cross-platform equity analysis for **US, NSE and BSE** markets. Interactive charts, technical indicators, fundamentals, a multi-source news pipeline and **FinBERT** headline sentiment, served by a FastAPI backend and a lightweight Plotly.js frontend.

> Educational project. Not investment advice.

## Features
- **Markets:** US, NSE (`.NS`) and BSE (`.BO`) with automatic ticker normalisation
- **Interactive chart:** candlesticks, SMA 20/50/200, EMA 20, Bollinger Bands, volume, RSI, MACD; zoom, pan, toggles, period buttons
- **Signals:** rule-based readout of RSI, MACD, moving averages and Bollinger position
- **Fundamentals:** P/E, P/B, P/S, ROE, ROA, margins, debt/equity, dividend yield and more
- **News + ML:** Yahoo Finance and Google News headlines, deduplicated and scored with FinBERT
- **Indian formatting:** ₹ with lakh/crore grouping for NSE and BSE
- **Search history:** stored per visitor in the browser
- **Configurable model:** use the public FinBERT or your own custom-trained model, on CPU, CUDA or MPS, online or offline

## Project structure
```
equity-analysis-platform/
├── app/
│   ├── main.py              # FastAPI app, static files
│   ├── config.py            # env/.env settings and constants
│   ├── api/routes.py        # HTTP endpoints
│   └── services/
│       ├── market_data.py   # prices + fundamentals (yfinance)
│       ├── indicators.py    # RSI, MACD, SMA, Bollinger, signals
│       ├── news.py          # headline aggregation
│       ├── sentiment.py     # FinBERT inference (lazy-loaded)
│       └── cache.py         # in-memory TTL cache
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   └── js/                  # format, history, render, chart, news, controls, main
├── tests/                   # pytest suite
├── Dockerfile
├── requirements.txt / requirements-dev.txt
└── .env.example
```
Each concern lives in one file, so you can work on indicators, news, the model or the UI independently.

## Quick start
Requires Python 3.10+.
```bash
git clone https://github.com/<regularaswin007>/equity-analysis-platform.git
cd equity-analysis-platform
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000
```
Open http://localhost:8000. The first sentiment request downloads FinBERT (~440 MB).

**Windows without a venv:** the app runs without PyTorch (sentiment is then disabled). To enable it without hitting path-length errors:
```
python -m pip install fastapi uvicorn yfinance pandas feedparser
python -m pip install --target C:\pl torch --index-url https://download.pytorch.org/whl/cpu
python -m pip install --target C:\pl transformers
```
Then double-click `run.bat`.

## Configuration
Set as environment variables or in a `.env` file (see `.env.example`).

| Variable | Default | Description |
|---|---|---|
| `MODEL_PATH` | `ProsusAI/finbert` | Hugging Face model name or local folder of your custom FinBERT |
| `DEVICE` | `cpu` | `cpu`, `cuda` or `mps` |
| `LOCAL_ONLY` | `0` | `1` loads the model from local files only (offline) |
| `PORT` | `8000` | Port used by the Docker image |

## API
| Endpoint | Description |
|---|---|
| `GET /api/analyze?market=US&ticker=AAPL&period=1y` | Prices, indicators, signals, fundamentals |
| `GET /api/news?market=US&ticker=AAPL&name=Apple` | Headlines with sentiment labels and average score |
| `GET /health` | Health check |

Markets: `US`, `NSE`, `BSE`. Periods: `1mo 3mo 6mo 1y 2y 5y 10y max`.

## Docker and deployment
```bash
docker build -t equity-analysis-platform .
docker run -p 8000:8000 equity-analysis-platform
```
The image bakes in FinBERT so the first request is fast. Deploy on Render, Railway, Fly.io or a Hugging Face Docker Space with at least **2 GB RAM**.

## Tests
```bash
pip install -r requirements-dev.txt
pytest
```

## Roadmap
- Stock comparison and watchlists
- Price forecasting module
- Persistent cache (Redis) and rate-limit handling
- Admin-gated model settings in the UI

## Notes
Data comes from Yahoo Finance (unofficial) and Google News RSS and may be delayed, incomplete or rate-limited.

## License
Add a license of your choice (MIT is a common default) before publishing.
