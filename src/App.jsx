import { useState, useEffect } from 'react'
import showdown from 'showdown';
import './App.css'

const NoteApp = () => {
  const [notes, setNotes] = useState([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  
  // Charger les notes depuis le localStorage lors du chargement initial
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(savedNotes);
  }, []);

  // Sauvegarder les notes dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Fonction pour ajouter une nouvelle note
  const addNote = () => {
    const newNote = {
      title: 'New Note',
      content: ''
    };
    setNotes([...notes, newNote]);
    setCurrentNoteIndex(notes.length);
  };

  // Fonction pour sauvegarder une note modifiée
  const saveNote = () => {
    if (currentNoteIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[currentNoteIndex] = {
        title: noteTitle,
        content: noteContent
      };
      setNotes(updatedNotes);
    }
  };

  // Fonction pour sélectionner une note
  const selectNote = (index) => {
    setCurrentNoteIndex(index);
    setNoteTitle(notes[index].title);
    setNoteContent(notes[index].content);
  };

  // Convertir le contenu de la note en HTML
  const convertToHTML = (markdown) => {
    const converter = new showdown.Converter();
    return converter.makeHtml(markdown);
  };

  return (
    <div className="container">
      <div className="sidebar">
        <button onClick={addNote}>Nouvelle Note</button>
        <ul>
          {notes.map((note, index) => (
            <li key={index} onClick={() => selectNote(index)}>
              <strong>{note.title}</strong>
              <p>{note.content.substring(0, 15)}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="main">
        {currentNoteIndex !== null && (
          <div>
            <h2>{noteTitle}</h2>
            <div dangerouslySetInnerHTML={{ __html: convertToHTML(noteContent) }} />
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            <button onClick={saveNote}>Save</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteApp;
