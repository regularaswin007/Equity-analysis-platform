"""FinBERT sentiment scoring. Model loads lazily on first use."""
from functools import lru_cache

from app.config import DEVICE, LOCAL, MODEL
from app.services.market_data import symbol
from app.services.news import headlines


@lru_cache(maxsize=1)
def sentiment_model():
    # Load tokenizer and model explicitly, then hand them to the pipeline.
    # This avoids passing loader kwargs through pipeline(), which differ between transformers versions.
    from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline
    tokenizer = AutoTokenizer.from_pretrained(MODEL)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL)
    return pipeline("text-classification", model=model, tokenizer=tokenizer, top_k=None,
                    truncation=True, max_length=128, device=DEVICE)


def news_with_sentiment(market, ticker, name):
    sym = symbol(market, ticker)
    items = headlines(sym, name, market)
    if not items:
        return {"items": [], "avg": None}
    try:
        res = sentiment_model()([i["title"] for i in items], batch_size=16)
        for i, r in zip(items, res):
            p = {x["label"].lower(): x["score"] for x in r}
            i["label"], i["score"] = max(p, key=p.get), round(p.get("positive", 0) - p.get("negative", 0), 3)
        return {"items": items, "avg": round(sum(i["score"] for i in items) / len(items), 3), "model": MODEL}
    except Exception as e:
        return {"items": items, "avg": None, "error": f"Sentiment model unavailable: {e}"}
