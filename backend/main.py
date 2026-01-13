import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime
import uuid
from dotenv import load_dotenv
load_dotenv()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow Vercel + local
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

dynamodb = boto3.resource(
    "dynamodb",
    region_name=os.environ["REGION_NAME"],
    aws_access_key_id=os.environ["AWS_ACCESS_KEY"],
    aws_secret_access_key=os.environ["AWS_SECRET_KEY"],
)

table = dynamodb.Table(os.environ["TABLE_NAME"])

# =========================
# Models
# =========================
class NoteCreate(BaseModel):
    userId: str
    noteId: str | None = None
    content: str

# =========================
# Routes
# =========================

# Create note
@app.post("/notes")
def add_note(note: NoteCreate):
    note_id = note.noteId or str(uuid.uuid4())

    item = {
        "userId": note.userId,
        "noteId": note_id,
        "content": note.content,
        "createdAt": datetime.utcnow().isoformat(),
    }

    table.put_item(Item=item)
    return item


# Get ALL notes
@app.get("/notes")
def get_all_notes():
    response = table.scan()
    return response.get("Items", [])


# Get notes by userId
@app.get("/notes/{user_id}")
def get_notes_by_user(user_id: str):
    response = table.query(
        KeyConditionExpression=Key("userId").eq(user_id)
    )
    return response.get("Items", [])


# Get specific note
@app.get("/notes/{user_id}/{note_id}")
def get_specific_note(user_id: str, note_id: str):
    response = table.get_item(
        Key={"userId": user_id, "noteId": note_id}
    )
    return response.get("Item", {})


# Delete specific note
@app.delete("/notes/{user_id}/{note_id}")
def delete_note(user_id: str, note_id: str):
    table.delete_item(
        Key={"userId": user_id, "noteId": note_id}
    )
    return {"message": "Note deleted"}
