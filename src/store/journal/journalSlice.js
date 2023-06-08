import { stepContentClasses } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit';

export const journalSlice = createSlice({
    name: 'journal',
    initialState: {
        isSaving: false,
        messageSaved: '',
        notes: [],
        imageUrls: [],
        active: null,
    },

    //LOS REDUCERS SIEMPRE SON FUNCIONES PURAS, SÍNCRONAS. Si hay algo asíncrono, va a thunks. Esto se refleja en el store, donde el resto de la pág irá a buscar estas fx
    reducers: {
        savingNewNote: (state) => {
            state.isSaving = true;
        },
        addNewEmptyNote: (state, action) => {
            state.notes.push(action.payload);
            state.isSaving = false;
        },
        setActiveNote: (state, action) => {
            state.active = action.payload;
        },
        setNotes: (state, action) => {
            state.notes = action.payload;
            state.messageSaved = '';
        },
        setSaving: (state) => {
            state.isSaving = true;
            state.messageSaved = '';
        },
        updateNote: (state, action) => { //payload:note
            //Ya deja de grabar, por eso false
            state.isSaving = false;
            //mapeo el arreglo de notas
            state.notes = state.notes.map(note => {
                //Si el id de la nota es igual al id de la acción (donde mandaré el updateNote), retornará el action.payload para actualizar la nota. 
                if (note.id === action.payload.id) {
                    return action.payload;
                }
                return note;
            })
            state.messageSaved = `${action.payload.title}, actualizada correctamente`
        },
        //Muestra las fotos que se van subiendo, al hacer spread de las imagesUrls y concatenar con el spread de las nuevas imágenes. IsSaving en false porque ya terminó la carga
        setPhotoToActiveNote: (state, action) => {
            state.active.imageUrls = [...state.active.imageUrls, ...action.payload];
            state.isSaving = false;

        },
        //Cuando se cierre sesión que se limpie el Store así no se ven las notas ni nada. (Al volver a iniciar sesión se vuelven a cargar)
        clearNotesLogout: (state) => {
            state.isSaving = false;
            state.messageSaved = '';
            state.notes = [];
            state.active = null;
        },
        //Borro la nota según su id, o con su id mejor dicho
        deleteNoteById: (state, action) => {
            //el estado pasa a ser nulo, se desactiva
            state.active = null;
            //Filtro las notas diferentes a ese id, eliminando la nota que tiene este id nada más
            state.notes = state.notes.filter(note => note.id !== action.payload);
        }
    },
})

export const { addNewEmptyNote, setActiveNote, setNotes, setSaving, updateNote, deleteNoteById, savingNewNote, setPhotoToActiveNote, clearNotesLogout } = journalSlice.actions;