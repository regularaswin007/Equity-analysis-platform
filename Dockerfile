FROM python:3.11-slim
ENV PYTHONUNBUFFERED=1 HF_HOME=/app/.cache PORT=8000
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu \
 && pip install --no-cache-dir -r requirements.txt
RUN python -c "from transformers import AutoTokenizer, AutoModelForSequenceClassification as M; AutoTokenizer.from_pretrained('ProsusAI/finbert'); M.from_pretrained('ProsusAI/finbert')"
COPY . .
EXPOSE 8000
HEALTHCHECK --interval=30s CMD python -c "import os,urllib.request as u;u.urlopen('http://localhost:'+os.environ['PORT']+'/health')"
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
