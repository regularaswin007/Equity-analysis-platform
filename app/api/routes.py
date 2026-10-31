"""HTTP API routes."""
from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from app.config import PERIODS
from app.services.cache import cached
from app.services.market_data import build
from app.services.sentiment import news_with_sentiment

router = APIRouter()


@router.get("/health")
def health():
    return {"ok": True}


@router.get("/api/analyze")
async def analyze(market: str = "US", ticker: str = "AAPL", period: str = "1y"):
    if period not in PERIODS:
        raise HTTPException(400, "Invalid period")
    try:
        return await run_in_threadpool(lambda: cached(("a", market, ticker.upper(), period), 600,
                                                      lambda: build(market, ticker, period)))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(502, f"Data provider error: {e}")


@router.get("/api/news")
async def news(market: str = "US", ticker: str = "AAPL", name: str = ""):
    key = ("n", market, ticker.upper())
    return await run_in_threadpool(lambda: cached(key, 600, lambda: news_with_sentiment(market, ticker, name)))
