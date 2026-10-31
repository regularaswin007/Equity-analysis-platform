"""Price history and fundamentals from Yahoo Finance."""
import pandas as pd
import yfinance as yf
from fastapi import HTTPException

from app.config import INFO_KEYS, SUF
from app.services.indicators import indicators, lst, signals


def symbol(market, ticker):
    if market not in SUF:
        raise HTTPException(400, "Unknown market")
    t = ticker.strip().upper()
    for s in (".NS", ".BO"):
        t = t.removesuffix(s)
    if not t or len(t) > 15:
        raise HTTPException(400, "Invalid ticker")
    return t + SUF[market]


def build(market, ticker, period):
    sym = symbol(market, ticker)
    tk = yf.Ticker(sym)
    df = tk.history(period=period, interval="1wk" if period in ("5y", "10y", "max") else "1d", auto_adjust=True)
    if df.empty or len(df) < 2:
        raise HTTPException(404, f"No data found for {sym}")
    df.index = pd.to_datetime(df.index).tz_localize(None)
    df = indicators(df)
    try:
        info = {k: v for k, v in (tk.info or {}).items() if k in INFO_KEYS}
    except Exception:
        info = {}
    d = {k.lower(): lst(df[k], 2) for k in ("Open", "High", "Low", "Close")}
    d.update(volume=[int(v) for v in df["Volume"].fillna(0)], dates=[x.strftime("%Y-%m-%d") for x in df.index])
    for k in ("sma20", "sma50", "sma200", "ema20", "rsi", "macd", "signal", "hist", "bb_up", "bb_lo"):
        d[k] = lst(df[k])
    return {"symbol": sym, "market": market, "currency": "USD" if market == "US" else "INR",
            "name": info.get("longName") or info.get("shortName") or sym, "info": info,
            "signals": signals(df), **d}
