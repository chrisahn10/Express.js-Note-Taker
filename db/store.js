const fs = require('fs').promises;
const { v1: uuidv1 } = require('uuid');

class Store {
    async read() {
        try {
            const data = await fs.readFile('db/db.json', 'utf8');
            return JSON.parse(data);
        } catch (err) {
            return [];
        }
    }

    async write(notes) {
        await fs.writeFile('db/db.json', JSON.stringify(notes));
    }

    async getNotes() {
        return await this.read();
    }

    async addNote(note) {
        const { title, text } = note;

        if (!title || !text) {
            throw new Error("Note 'title' and 'text' cannot be blank");
        }

        const newNote = { title, text, id: uuidv1() };
        const notes = await this.getNotes();
        notes.push(newNote);
        await this.write(notes);
        return newNote;
    }

    async removeNote(id) {
        const notes = await this.getNotes();
        const filteredNotes = notes.filter((note) => note.id !== id);
        await this.write(filteredNotes);
    }
}

module.exports = new Store();
