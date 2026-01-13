# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import boto3
from boto3.dynamodb.conditions import Key
import uuid
from datetime import datetime
import config  # import AWS keys and table info

app = FastAPI()

# CORS (for React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_methods=["*"],
    allow_headers=["*"],
)

# DynamoDB setup
dynamodb = boto3.resource(
    "dynamodb",
    region_name=config.REGION_NAME,
    aws_access_key_id=config.AWS_ACCESS_KEY,
    aws_secret_access_key=config.AWS_SECRET_KEY
)
table = dynamodb.Table(config.TABLE_NAME)

# =========================
# Models
# =========================
class NoteCreate(BaseModel):
    userId: str
    content: str

# =========================
# Routes
# =========================

# Create note
@app.post("/notes")
def add_note(note: NoteCreate):
    note_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat()

    table.put_item(
        Item={
            "userId": note.userId,
            "noteId": note_id,
            "content": note.content,
            "createdAt": created_at
        }
    )
    return {"noteId": note_id}

# Get notes for a user
@app.get("/notes/{user_id}")
def get_notes(user_id: str):
    response = table.query(
        KeyConditionExpression=Key("userId").eq(user_id)
    )
    return response.get("Items", [])

# Delete note
@app.delete("/notes/{user_id}/{note_id}")
def delete_note(user_id: str, note_id: str):
    table.delete_item(
        Key={
            "userId": user_id,
            "noteId": note_id
        }
    )
    return {"message": "Note deleted"}
