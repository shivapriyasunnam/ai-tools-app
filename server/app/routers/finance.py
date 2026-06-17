import asyncio
import os

import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/finance", tags=["finance"])

ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "")
ALPHA_VANTAGE_BASE = "https://www.alphavantage.co/query"
YAHOO_QUOTE_BASE = "https://query1.finance.yahoo.com/v7/finance/quote"
COINGECKO_BASE = "https://api.coingecko.com/api/v3"

YAHOO_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
}

# Popular US stocks to show as "top performers" (sorted by day's gain at runtime)
WATCHLIST = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA", "AMD", "NFLX", "PLTR"]


async def _yahoo_indices(client: httpx.AsyncClient) -> dict:
    """Fetch S&P 500 (^GSPC) and NASDAQ (^IXIC) from Yahoo Finance."""
    resp = await client.get(YAHOO_QUOTE_BASE, params={"symbols": "^GSPC,^IXIC"}, headers=YAHOO_HEADERS)
    resp.raise_for_status()
    quotes = resp.json().get("quoteResponse", {}).get("result", [])
    results = {}
    for q in quotes:
        sym = q.get("symbol")
        price = q.get("regularMarketPrice", 0)
        change = q.get("regularMarketChangePercent", 0)
        if sym == "^GSPC":
            results["SPY"] = {"price": price, "changesPercentage": change}
        elif sym == "^IXIC":
            results["QQQ"] = {"price": price, "changesPercentage": change}
    return results


@router.get("/indices")
async def get_indices():
    """US market indices — tries Alpha Vantage first, falls back to Yahoo Finance."""
    # Try Alpha Vantage (only if key is set)
    if ALPHA_VANTAGE_KEY:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                tasks = [
                    client.get(ALPHA_VANTAGE_BASE, params={"function": "GLOBAL_QUOTE", "symbol": s, "apikey": ALPHA_VANTAGE_KEY})
                    for s in ["SPY", "QQQ"]
                ]
                responses = await asyncio.gather(*tasks, return_exceptions=True)
                results = {}
                for i, resp in enumerate(responses):
                    symbol = ["SPY", "QQQ"][i]
                    if isinstance(resp, Exception) or resp.status_code != 200:
                        continue
                    gq = resp.json().get("Global Quote", {})
                    if gq.get("05. price"):
                        results[symbol] = {
                            "price": float(gq["05. price"]),
                            "changesPercentage": float(gq.get("10. change percent", "0%").replace("%", "")),
                        }
                # Only use Alpha Vantage results if we got both symbols
                if len(results) == 2:
                    return results
        except Exception:
            pass

    # Fallback: Yahoo Finance
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            results = await _yahoo_indices(client)
            if results:
                return results
    except Exception as e:
        pass

    raise HTTPException(status_code=502, detail="Finance indices unavailable")


@router.get("/stocks")
async def get_top_stocks():
    """Top performing US stocks from Yahoo Finance (free, no API key needed)."""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                YAHOO_QUOTE_BASE,
                params={"symbols": ",".join(WATCHLIST)},
                headers=YAHOO_HEADERS,
            )
            resp.raise_for_status()
            quotes = resp.json().get("quoteResponse", {}).get("result", [])
            if not quotes:
                raise ValueError("Empty response")

            # Sort by today's % change descending, return top 3 gainers
            sorted_quotes = sorted(
                [q for q in quotes if q.get("regularMarketChangePercent") is not None],
                key=lambda q: q.get("regularMarketChangePercent", 0),
                reverse=True,
            )[:3]

            return {
                "top_gainers": [
                    {
                        "ticker": q["symbol"],
                        "price": str(round(q.get("regularMarketPrice", 0), 2)),
                        "change_percentage": f"{q.get('regularMarketChangePercent', 0):.2f}%",
                    }
                    for q in sorted_quotes
                ]
            }
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Stock data unavailable: {e}")


@router.get("/crypto")
async def get_top_crypto():
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{COINGECKO_BASE}/coins/markets",
                params={"vs_currency": "usd", "order": "market_cap_desc", "per_page": 3, "page": 1},
            )
            resp.raise_for_status()
            return resp.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Crypto data unavailable: {e}")

