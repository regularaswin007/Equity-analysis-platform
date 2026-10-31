"""Technical indicators and rule-based signals."""
import pandas as pd


def lst(s, nd=4):
    return [None if pd.isna(v) else round(float(v), nd) for v in s]


def indicators(df):
    c = df["Close"]
    for n in (20, 50, 200):
        df[f"sma{n}"] = c.rolling(n).mean()
    df["ema20"] = c.ewm(span=20, adjust=False).mean()
    d = c.diff()
    up = d.clip(lower=0).ewm(alpha=1 / 14, adjust=False).mean()
    dn = (-d.clip(upper=0)).ewm(alpha=1 / 14, adjust=False).mean()
    df["rsi"] = 100 - 100 / (1 + up / dn.replace(0, float("nan")))
    df["macd"] = c.ewm(span=12, adjust=False).mean() - c.ewm(span=26, adjust=False).mean()
    df["signal"] = df["macd"].ewm(span=9, adjust=False).mean()
    df["hist"] = df["macd"] - df["signal"]
    mid, sd = c.rolling(20).mean(), c.rolling(20).std()
    df["bb_up"], df["bb_lo"] = mid + 2 * sd, mid - 2 * sd
    return df


def signals(df):
    r, out = df.iloc[-1], []

    def add(text, tone):
        out.append({"text": text, "tone": tone})

    if pd.notna(r.rsi):
        add(f"RSI {r.rsi:.0f} · " + ("overbought" if r.rsi > 70 else "oversold" if r.rsi < 30 else "neutral"),
            "bear" if r.rsi > 70 else "bull" if r.rsi < 30 else "flat")
    if pd.notna(r.signal):
        add("MACD " + ("above" if r.macd > r.signal else "below") + " signal line", "bull" if r.macd > r.signal else "bear")
    for n in (50, 200):
        v = r[f"sma{n}"]
        if pd.notna(v):
            add(f"Price {'above' if r.Close > v else 'below'} SMA{n}", "bull" if r.Close > v else "bear")
    if pd.notna(r.bb_up):
        pos = "above upper band" if r.Close > r.bb_up else "below lower band" if r.Close < r.bb_lo else "inside bands"
        add(f"Bollinger: {pos}", "bear" if r.Close > r.bb_up else "bull" if r.Close < r.bb_lo else "flat")
    return out
