"""Tiny in-memory TTL cache."""
import time

_store = {}


def cached(key, ttl, fn):
    hit = _store.get(key)
    if hit and time.time() - hit[0] < ttl:
        return hit[1]
    val = fn()
    _store[key] = (time.time(), val)
    return val
