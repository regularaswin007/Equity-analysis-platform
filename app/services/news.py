"""Headline aggregation (Yahoo Finance + Google News RSS)."""
import feedparser
import yfinance as yf


def headlines(sym, name, market):
    items, seen = [], set()

    def add(title, src, link):
        k = title.strip().lower()
        if title and k not in seen:
            seen.add(k)
            items.append({"title": title.strip(), "source": src, "link": link})

    try:
        for n in yf.Ticker(sym).news or []:
            c = n.get("content", n)
            link = (c.get("canonicalUrl") or {}).get("url") or c.get("link", "")
            add(c.get("title", ""), (c.get("provider") or {}).get("displayName", "Yahoo Finance"), link)
    except Exception:
        pass
    loc = "hl=en-US&gl=US&ceid=US:en" if market == "US" else "hl=en-IN&gl=IN&ceid=IN:en"
    try:
        q = (name or sym).replace(" ", "+")
        for e in feedparser.parse(f"https://news.google.com/rss/search?q={q}+stock&{loc}").entries[:15]:
            add(e.get("title", ""), (e.get("source") or {}).get("title", "Google News"), e.get("link", ""))
    except Exception:
        pass
    return items[:15]
