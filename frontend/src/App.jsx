import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

const App = () => {
  const [addUserId, setAddUserId] = useState("");     // user ID for adding note
  const [noteContent, setNoteContent] = useState(""); // note content to add

  const [getUserId, setGetUserId] = useState("");     // user ID for fetching notes
  const [notes, setNotes] = useState([]);            // fetched notes

  // Add a note
  const addNote = async () => {
    if (!addUserId.trim() || !noteContent.trim()) return;

    try {
      await axios.post(`${API_URL}/notes`, { userId: addUserId, content: noteContent });
      setNoteContent(""); // clear content input
      alert("Note added successfully!");
    } catch (err) {
      console.error("Error adding note:", err);
      alert("Failed to add note.");
    }
  };

  // Get notes
  const fetchNotes = async () => {
    if (!getUserId.trim()) return;

    try {
      const res = await axios.get(`${API_URL}/notes/${getUserId}`);
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setNotes([]);
      alert("Failed to fetch notes.");
    }
  };

  // Delete note
  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`${API_URL}/notes/${getUserId}/${noteId}`);
      fetchNotes(); // refresh list
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Failed to delete note.");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "auto" }}>
      <h2>Notes App</h2>

      {/* ===== Add Note Section ===== */}
      <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "6px" }}>
        <h3>Add Note</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="User ID"
            value={addUserId}
            onChange={(e) => setAddUserId(e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          />
          <input
            type="text"
            placeholder="Note Content"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            style={{ flex: 2, padding: "8px" }}
          />
          <button onClick={addNote} style={{ padding: "8px 12px" }}>Add</button>
        </div>
      </div>

      {/* ===== Get Notes Section ===== */}
      <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "6px" }}>
        <h3>Get Notes</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="User ID"
            value={getUserId}
            onChange={(e) => setGetUserId(e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          />
          <button onClick={fetchNotes} style={{ padding: "8px 12px" }}>Get Notes</button>
        </div>

        {/* Notes list */}
        {notes.length === 0 ? (
          <p>No notes found.</p>
        ) : (
          <ul>
            {notes.map((note) => (
              <li
                key={note.noteId}
                style={{
                  marginBottom: "8px",
                  padding: "6px 8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{note.content}</span>
                <button
                  onClick={() => deleteNote(note.noteId)}
                  style={{
                    marginLeft: "10px",
                    color: "white",
                    background: "red",
                    border: "none",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    cursor: "pointer",
                  }}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
