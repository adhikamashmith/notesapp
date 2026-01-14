import os
import uuid
from datetime import datetime

import boto3
from boto3.dynamodb.conditions import Key
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# =========================
# App Setup
# =========================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# DynamoDB Setup
# =========================
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


class NoteUpdate(BaseModel):
    content: str

# =========================
# Routes
# =========================

# Create Note
@app.post("/notes")
def add_note(note: NoteCreate):
    note_id = note.noteId or str(uuid.uuid4())

    item = {
        "userId": note.userId,
        "noteId": note_id,
        "content": note.content,
        "createdAt": datetime.utcnow().isoformat(),
        "updatedAt": datetime.utcnow().isoformat(),
    }

    table.put_item(Item=item)
    return item


# Get ALL Notes
@app.get("/notes")
def get_all_notes():
    response = table.scan()
    return response.get("Items", [])


# Get Notes by User
@app.get("/notes/{user_id}")
def get_notes_by_user(user_id: str):
    response = table.query(
        KeyConditionExpression=Key("userId").eq(user_id)
    )
    return response.get("Items", [])


# Get Specific Note
@app.get("/notes/{user_id}/{note_id}")
def get_specific_note(user_id: str, note_id: str):
    response = table.get_item(
        Key={"userId": user_id, "noteId": note_id}
    )

    if "Item" not in response:
        raise HTTPException(status_code=404, detail="Note not found")

    return response["Item"]


# Update Note
@app.put("/notes/{user_id}/{note_id}")
def update_note(user_id: str, note_id: str, note: NoteUpdate):
    response = table.update_item(
        Key={"userId": user_id, "noteId": note_id},
        UpdateExpression="SET content = :content, updatedAt = :updatedAt",
        ExpressionAttributeValues={
            ":content": note.content,
            ":updatedAt": datetime.utcnow().isoformat(),
        },
        ConditionExpression="attribute_exists(noteId)",
        ReturnValues="ALL_NEW",
    )

    return response.get("Attributes")


# Delete Specific Note
@app.delete("/notes/{user_id}/{note_id}")
def delete_note(user_id: str, note_id: str):
    table.delete_item(
        Key={"userId": user_id, "noteId": note_id}
    )
    return {"message": "Note deleted"}


# Delete ALL Notes by User
@app.delete("/notes/{user_id}")
def delete_notes_by_user(user_id: str):
    response = table.query(
        KeyConditionExpression=Key("userId").eq(user_id)
    )

    items = response.get("Items", [])
    if not items:
        raise HTTPException(status_code=404, detail="No notes found")

    with table.batch_writer() as batch:
        for item in items:
            batch.delete_item(
                Key={
                    "userId": item["userId"],
                    "noteId": item["noteId"],
                }
            )

    return {"message": "All notes deleted for user"}
@app.get("/ping")
def ping():
    return {"status": "ok"}
