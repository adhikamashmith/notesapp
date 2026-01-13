import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
  const [userId, setUserId] = useState("");
  const [noteId, setNoteId] = useState("");
  const [content, setContent] = useState("");

  const [allNotes, setAllNotes] = useState([]);

  const [getUserId, setGetUserId] = useState("");
  const [getNoteId, setGetNoteId] = useState("");
  const [results, setResults] = useState([]);

  const [delUserId, setDelUserId] = useState("");
  const [delNoteId, setDelNoteId] = useState("");

  const fetchAllNotes = async () => {
    const res = await axios.get(`${API_URL}/notes`);
    setAllNotes(res.data);
  };

  const addNote = async () => {
    if (!userId || !noteId || !content) return;

    await axios.post(`${API_URL}/notes`, {
      userId,
      noteId,
      content,
    });

    setUserId("");
    setNoteId("");
    setContent("");
    fetchAllNotes();
  };

  const getByUserId = async () => {
    if (!getUserId) return;
    const res = await axios.get(`${API_URL}/notes/${getUserId}`);
    setResults(res.data);
  };

  const getSpecificNote = async () => {
    if (!getUserId || !getNoteId) return;
    const res = await axios.get(`${API_URL}/notes/${getUserId}/${getNoteId}`);
    setResults([res.data]);
  };

  const deleteByUserId = async () => {
    if (!delUserId) return;
    const res = await axios.get(`${API_URL}/notes/${delUserId}`);
    for (let note of res.data) {
      await axios.delete(`${API_URL}/notes/${delUserId}/${note.noteId}`);
    }
    fetchAllNotes();
    setResults([]);
  };

  const deleteSpecificNote = async () => {
    if (!delUserId || !delNoteId) return;
    await axios.delete(`${API_URL}/notes/${delUserId}/${delNoteId}`);
    fetchAllNotes();
    setResults([]);
  };

  useEffect(() => {
    fetchAllNotes();
  }, []);

  return (
    <div style={{ padding: 30, maxWidth: 800, margin: "auto" }}>
      <h2>Notes App</h2>

      <section>
        <h3>Add Note</h3>
        <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID" />
        <input value={noteId} onChange={e => setNoteId(e.target.value)} placeholder="Note ID" />
        <input value={content} onChange={e => setContent(e.target.value)} placeholder="Content" />
        <button onClick={addNote}>Add</button>
      </section>

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

      <section>
        <h3>Get Notes</h3>
        <input value={getUserId} onChange={e => setGetUserId(e.target.value)} placeholder="User ID" />
        <input value={getNoteId} onChange={e => setGetNoteId(e.target.value)} placeholder="Note ID (optional)" />
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

      <section>
        <h3>Delete Notes</h3>
        <input value={delUserId} onChange={e => setDelUserId(e.target.value)} placeholder="User ID" />
        <input value={delNoteId} onChange={e => setDelNoteId(e.target.value)} placeholder="Note ID (optional)" />
        <button onClick={deleteByUserId}>Delete by User</button>
        <button onClick={deleteSpecificNote}>Delete Specific</button>
      </section>
    </div>
  );
};

export default App;
