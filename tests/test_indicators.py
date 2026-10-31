import numpy as np
import pandas as pd

from app.services.indicators import indicators, signals


def _df(n=300):
    c = np.cumsum(np.random.default_rng(1).normal(size=n)) + 100
    return pd.DataFrame({"Open": c, "High": c + 1, "Low": c - 1, "Close": c, "Volume": 1000})


def test_rsi_bounds():
    assert indicators(_df()).rsi.dropna().between(0, 100).all()


def test_signals_have_valid_tone():
    s = signals(indicators(_df()))
    assert s and all(x["tone"] in {"bull", "bear", "flat"} for x in s)
