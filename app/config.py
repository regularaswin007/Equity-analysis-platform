"""Central configuration. Values come from environment variables or an optional .env file."""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = ROOT / "frontend"

_env = ROOT / ".env"
if _env.exists():
    for line in _env.read_text().splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

MODEL = os.environ.get("MODEL_PATH", "ProsusAI/finbert")
DEVICE = os.environ.get("DEVICE", "cpu")
LOCAL = os.environ.get("LOCAL_ONLY", "0") == "1"
SUF = {"US": "", "NSE": ".NS", "BSE": ".BO"}
PERIODS = {"1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "max"}
INFO_KEYS = ["longName", "shortName", "sector", "industry", "marketCap", "trailingPE", "forwardPE",
             "priceToBook", "priceToSalesTrailing12Months", "trailingEps", "returnOnEquity", "returnOnAssets",
             "profitMargins", "operatingMargins", "debtToEquity", "currentRatio", "dividendYield", "beta",
             "totalRevenue", "fiftyTwoWeekHigh", "fiftyTwoWeekLow"]
