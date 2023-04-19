# Use Python3.10 as the base image
FROM python:3.10

# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONUNBUFFERED True

# Copy requirements.txt to the docker image and install packages
COPY requirements.txt /
RUN pip install -r requirements.txt

COPY wellytics/ /app
COPY bert-uncased-keyword-extractor /app
COPY distilbert-base-uncased-go-emotions-student /app

# Set the WORKDIR to be the folder
WORKDIR /app

# Expose port 5000
EXPOSE 5000
ENV PORT 5000

# Use gunicorn as the entrypoint
# CMD exec gunicorn --bind :$PORT main:app --workers 1 --threads 1 --timeout 0
CMD ["python", "-m", "wellytics"]
