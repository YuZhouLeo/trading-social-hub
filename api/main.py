from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import finlab
from finlab.online import get_data
import os

app = FastAPI(title="Stock API", version="1.0.0")

# CORS 設定 - 允許前端訪問
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化 FinLab
FINLAB_API_TOKEN = os.getenv("FINLAB_API_TOKEN")
if FINLAB_API_TOKEN:
    finlab.setup(api_token=FINLAB_API_TOKEN)

class StockRequest(BaseModel):
    symbol: str
    start_date: str = None
    end_date: str = None

@app.get("/")
async def root():
    return {"message": "Stock API is running", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/stock/data")
async def get_stock_data(request: StockRequest):
    """
    獲取股票數據
    """
    try:
        # 使用 FinLab 獲取股票數據
        data = get_data(
            dataset="daily_report",
            query=f"stock_id == '{request.symbol}'",
            start_date=request.start_date,
            end_date=request.end_date
        )
        
        if data is None or len(data) == 0:
            raise HTTPException(status_code=404, detail=f"Stock {request.symbol} not found")
        
        return {
            "symbol": request.symbol,
            "data": data.to_dict(orient="records"),
            "count": len(data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stock/{symbol}")
async def get_stock_info(symbol: str):
    """
    獲取特定股票的基本信息
    """
    try:
        data = get_data(
            dataset="daily_report",
            query=f"stock_id == '{symbol}'",
        )
        
        if data is None or len(data) == 0:
            raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")
        
        latest = data.iloc[-1].to_dict()
        return {
            "symbol": symbol,
            "latest_data": latest,
            "total_records": len(data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
