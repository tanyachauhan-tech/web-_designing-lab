const { useState, useEffect } = React;
const STORAGE_KEY = "notes-app:v1";
function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
function NoteForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() && !body.trim()) return;
    onSave({ title: title.trim(), body: body.trim() });
    if (!initial) { setTitle(""); setBody(""); }
  };
  return (
    <form onSubmit={submit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Note title"
      />
      <textarea
        placeholder="Write your note"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        aria-label="Note body"
      />
      <div className="row">
        <button type="submit">{initial ? "Save changes" : "Add note"}</button>
        {onCancel && (
          <button type="button" className="ghost" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}
function Note({ note, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return (
      <NoteForm
        initial={note}
        onCancel={() => setEditing(false)}
        onSave={(data) => { onUpdate(note.id, data); setEditing(false); }}
      />
    );
  }
  return (
    <article className="note">
      <h2>{note.title || "Untitled"}</h2>
      <p>{note.body}</p>
      <div className="row">
        <button className="ghost" onClick={() => setEditing(true)}>Edit</button>
        <button className="danger" onClick={() => onDelete(note.id)}>Delete</button>
      </div>
    </article>
  );
}
function App() {
  const [notes, setNotes] = useState(loadNotes);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch {}
  }, [notes]);
  const addNote = (data) =>
    setNotes([{ id: Date.now(), ...data }, ...notes]);
  const updateNote = (id, data) =>
    setNotes(notes.map((n) => (n.id === id ? { ...n, ...data } : n)));
  const deleteNote = (id) =>
    setNotes(notes.filter((n) => n.id !== id));
  return (
    <main className="app">
      <h1>Notes</h1>
      <NoteForm onSave={addNote} />
      {notes.length === 0 ? (
        <p className="empty">No notes yet. Add your first note above.</p>
      ) : (
        notes.map((n) => (
          <Note key={n.id} note={n} onUpdate={updateNote} onDelete={deleteNote} />
        ))
      )}
    </main>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
