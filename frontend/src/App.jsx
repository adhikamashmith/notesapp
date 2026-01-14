import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


const App = () => {
  // -------------------------
  // GLOBAL STATE
  // -------------------------
  const [allNotes, setAllNotes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -------------------------
  // CREATE
  // -------------------------
  const [userId, setUserId] = useState("");
  const [noteId, setNoteId] = useState("");
  const [content, setContent] = useState("");

  // -------------------------
  // READ
  // -------------------------
  const [getUserId, setGetUserId] = useState("");
  const [getNoteId, setGetNoteId] = useState("");

  // -------------------------
  // UPDATE
  // -------------------------
  const [updateUserId, setUpdateUserId] = useState("");
  const [updateNoteId, setUpdateNoteId] = useState("");
  const [updateContent, setUpdateContent] = useState("");

  // -------------------------
  // DELETE
  // -------------------------
  const [delUserId, setDelUserId] = useState("");
  const [delNoteId, setDelNoteId] = useState("");

  // -------------------------
  // FETCH ALL NOTES
  // -------------------------
  const fetchAllNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_URL}/notes`);
      setAllNotes(res.data);
    } catch {
      setError("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllNotes();
  }, [fetchAllNotes]);

  // -------------------------
  // CREATE NOTE
  // -------------------------
  const addNote = async () => {
    if (!userId || !noteId || !content) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(`${API_URL}/notes`, {
        userId,
        noteId,
        content,
      });

      setUserId("");
      setNoteId("");
      setContent("");
      setResults([]);
      fetchAllNotes();
    } catch {
      setError("Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // GET NOTES BY USER
  // -------------------------
  const getByUserId = async () => {
    if (!getUserId) return;

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_URL}/notes/${getUserId}`);
      setResults(res.data);
    } catch {
      setError("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // GET SPECIFIC NOTE
  // -------------------------
  const getSpecificNote = async () => {
    if (!getUserId || !getNoteId) return;

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${API_URL}/notes/${getUserId}/${getNoteId}`
      );
      setResults([res.data]);
    } catch {
      setError("Note not found");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // UPDATE NOTE
  // -------------------------
  const updateNote = async () => {
    if (!updateUserId || !updateNoteId || !updateContent) {
      setError("All update fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.put(
        `${API_URL}/notes/${updateUserId}/${updateNoteId}`,
        { content: updateContent }
      );

      setUpdateUserId("");
      setUpdateNoteId("");
      setUpdateContent("");
      setResults([]);
      fetchAllNotes();
    } catch {
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // DELETE BY USER
  // -------------------------
  const deleteByUserId = async () => {
    if (!delUserId) return;

    try {
      setLoading(true);
      setError("");

      await axios.delete(`${API_URL}/notes/${delUserId}`);
      setDelUserId("");
      setResults([]);
      fetchAllNotes();
    } catch {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // DELETE SPECIFIC NOTE
  // -------------------------
  const deleteSpecificNote = async () => {
    if (!delUserId || !delNoteId) return;

    try {
      setLoading(true);
      setError("");

      await axios.delete(
        `${API_URL}/notes/${delUserId}/${delNoteId}`
      );

      setDelNoteId("");
      setResults([]);
      fetchAllNotes();
    } catch {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div style={{ padding: 30, maxWidth: 900, margin: "auto" }}>
      <h2>📝 Notes App</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

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
              <b>{n.userId}</b> | {n.noteId} → {n.content}
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
              <b>{n.userId}</b> | {n.noteId} → {n.content}
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
