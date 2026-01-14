import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
  // CREATE
  const [userId, setUserId] = useState("");
  const [noteId, setNoteId] = useState("");
  const [content, setContent] = useState("");

  // READ
  const [allNotes, setAllNotes] = useState([]);
  const [getUserId, setGetUserId] = useState("");
  const [getNoteId, setGetNoteId] = useState("");
  const [results, setResults] = useState([]);

  // DELETE
  const [delUserId, setDelUserId] = useState("");
  const [delNoteId, setDelNoteId] = useState("");

  // UPDATE
  const [updateUserId, setUpdateUserId] = useState("");
  const [updateNoteId, setUpdateNoteId] = useState("");
  const [updateContent, setUpdateContent] = useState("");

  // -------------------------
  // FETCH ALL
  // -------------------------
  const fetchAllNotes = async () => {
    try {
      const res = await axios.get(`${API_URL}/notes`);
      setAllNotes(res.data);
    } catch {
      alert("Failed to fetch notes");
    }
  };

  // -------------------------
  // CREATE
  // -------------------------
  const addNote = async () => {
    if (!userId || !noteId || !content) {
      alert("Fill all fields");
      return;
    }

    try {
      await axios.post(`${API_URL}/notes`, {
        userId,
        noteId,
        content,
      });

      setUserId("");
      setNoteId("");
      setContent("");
      fetchAllNotes();
    } catch {
      alert("Failed to add note");
    }
  };

  // -------------------------
  // GET BY USER
  // -------------------------
  const getByUserId = async () => {
    if (!getUserId) return;

    try {
      const res = await axios.get(`${API_URL}/notes/${getUserId}`);
      setResults(res.data);
    } catch {
      alert("Failed to fetch notes");
    }
  };

  // -------------------------
  // GET SPECIFIC
  // -------------------------
  const getSpecificNote = async () => {
    if (!getUserId || !getNoteId) return;

    try {
      const res = await axios.get(
        `${API_URL}/notes/${getUserId}/${getNoteId}`
      );
      setResults([res.data]);
    } catch {
      alert("Note not found");
    }
  };

  // -------------------------
  // UPDATE
  // -------------------------
  const updateNote = async () => {
    if (!updateUserId || !updateNoteId || !updateContent) {
      alert("Fill all update fields");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/notes/${updateUserId}/${updateNoteId}`,
        { content: updateContent }
      );

      alert("Note updated successfully");

      setUpdateUserId("");
      setUpdateNoteId("");
      setUpdateContent("");
      fetchAllNotes();
    } catch {
      alert("Note not found or update failed");
    }
  };

  // -------------------------
  // DELETE BY USER
  // -------------------------
  const deleteByUserId = async () => {
    if (!delUserId) return;

    try {
      const res = await axios.get(`${API_URL}/notes/${delUserId}`);
      for (let note of res.data) {
        await axios.delete(
          `${API_URL}/notes/${delUserId}/${note.noteId}`
        );
      }
      fetchAllNotes();
      setResults([]);
    } catch {
      alert("Delete failed");
    }
  };

  // -------------------------
  // DELETE SPECIFIC
  // -------------------------
  const deleteSpecificNote = async () => {
    if (!delUserId || !delNoteId) return;

    try {
      await axios.delete(
        `${API_URL}/notes/${delUserId}/${delNoteId}`
      );
      fetchAllNotes();
      setResults([]);
    } catch {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchAllNotes();
  }, []);

  return (
    <div style={{ padding: 30, maxWidth: 800, margin: "auto" }}>
      <h2>Notes App</h2>

      {/* ADD */}
      <section>
        <h3>Add Note</h3>
        <input placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
        <input placeholder="Note ID" value={noteId} onChange={e => setNoteId(e.target.value)} />
        <textarea
          placeholder="Content"
          rows={4}
          style={{ width: "100%" }}
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button onClick={addNote}>Add</button>
      </section>

      {/* ALL */}
      <section>
        <h3>All Notes</h3>
        <ul>
          {allNotes.map(n => (
            <li key={`${n.userId}-${n.noteId}`}>
              {n.userId} | {n.noteId} → {n.content}
            </li>
          ))}
        </ul>
      </section>

      {/* GET */}
      <section>
        <h3>Get Notes</h3>
        <input placeholder="User ID" value={getUserId} onChange={e => setGetUserId(e.target.value)} />
        <input placeholder="Note ID (optional)" value={getNoteId} onChange={e => setGetNoteId(e.target.value)} />
        <button onClick={getByUserId}>Get by User</button>
        <button onClick={getSpecificNote}>Get Specific</button>

        <ul>
          {results.map(n => (
            <li key={`${n.userId}-${n.noteId}`}>
              {n.userId} | {n.noteId} → {n.content}
            </li>
          ))}
        </ul>
      </section>

      {/* UPDATE */}
      <section>
        <h3>Update Note</h3>
        <input placeholder="User ID" value={updateUserId} onChange={e => setUpdateUserId(e.target.value)} />
        <input placeholder="Note ID" value={updateNoteId} onChange={e => setUpdateNoteId(e.target.value)} />
        <textarea
          placeholder="Updated Content"
          rows={4}
          style={{ width: "100%" }}
          value={updateContent}
          onChange={e => setUpdateContent(e.target.value)}
        />
        <button onClick={updateNote}>Update</button>
      </section>

      {/* DELETE */}
      <section>
        <h3>Delete Notes</h3>
        <input placeholder="User ID" value={delUserId} onChange={e => setDelUserId(e.target.value)} />
        <input placeholder="Note ID (optional)" value={delNoteId} onChange={e => setDelNoteId(e.target.value)} />
        <button onClick={deleteByUserId}>Delete by User</button>
        <button onClick={deleteSpecificNote}>Delete Specific</button>
      </section>
    </div>
  );
};

export default App;
