import os
import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/finance", tags=["finance"])

ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "")
ALPHA_VANTAGE_BASE = "https://www.alphavantage.co/query"
YAHOO_BASE = "https://query1.finance.yahoo.com/v7/finance/quote"
COINGECKO_BASE = "https://api.coingecko.com/api/v3"


@router.get("/indices")
async def get_indices():
    """US market indices — tries Alpha Vantage, falls back to Yahoo Finance."""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            tasks = [
                client.get(ALPHA_VANTAGE_BASE, params={"function": "GLOBAL_QUOTE", "symbol": s, "apikey": ALPHA_VANTAGE_KEY})
                for s in ["SPY", "QQQ"]
            ]
            import asyncio
            responses = await asyncio.gather(*tasks, return_exceptions=True)
            results = {}
            for i, resp in enumerate(responses):
                symbol = ["SPY", "QQQ"][i]
                if isinstance(resp, Exception) or resp.status_code != 200:
                    continue
                data = resp.json().get("Global Quote", {})
                if data:
                    results[symbol] = data
            if results:
                return results
    except Exception:
        pass

    # Fallback: Yahoo Finance
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(YAHOO_BASE, params={"symbols": "^IXIC,^GSPC"})
            return resp.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Finance data unavailable: {e}")


@router.get("/stocks")
async def get_top_stocks():
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                ALPHA_VANTAGE_BASE,
                params={"function": "TOP_GAINERS_LOSERS", "apikey": ALPHA_VANTAGE_KEY},
            )
            resp.raise_for_status()
            return resp.json()
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
