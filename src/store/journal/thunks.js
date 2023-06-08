//Todas acciones asíncronas

import { async } from "@firebase/util";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore/lite";
import { FirebaseDB } from "../../firebase/config";
import { loadNotes } from "../../helpers/loadNotes";
import { addNewEmptyNote, deleteNoteById, savingNewNote, setActiveNote, setNotes, setSaving, updateNote } from "./journalSlice";


// startNewNote hará dispatch al hacer click en el botón de más en JournalPage.jsx
export const startNewNote = () => {

    return async (dispatch, getState) => {
        //isSaving en true para que desaparezca el botón  
        dispatch(savingNewNote());
        //tomar el uid del usuario
        const { uid } = getState().auth;

        const newNote = {
            title: '',
            body: '',
            date: new Date().getTime(),
        }
        //Documento de la base de firestore.
        //Creo un documento nuevo, collection tiene dos argumentos, la base de datos que ya configuramos en config y el path que puede ser un string o array.
        // user/ journal / notes
        const newDoc = doc(collection(FirebaseDB, `${uid}/journal/notes`));
        // importo setDoc que me pide la referencia de donde va a crear el documento y qué documento va a crear
        await setDoc(newDoc, newNote);
        //Le creo id a newNote
        newNote.id = newDoc.id;
        //dispatch, despachar la acción, desde los journalSlice, o sea reducers actions.
        dispatch(addNewEmptyNote(newNote));
        dispatch(setActiveNote(newNote));
    }
}


//Para traer las notas de la base de datos firestore a mi app de manera asíncrona, obvio porque estoy en thunks
//StartLoadingNotes lo mandamos a llamar en el custom hook useCheckAuth.js
//Gracias a esto la pág busca a la base de datos las notas y no se pierde la información al actualizar la pág, lo hace al iniciar
export const startLoadingNotes = () => {
    return async (dispatch, getState) => {
        //Obtengo el user id
        const { uid } = getState().auth;
        //Si no hay uid saltará un error
        if (!uid) throw new Error('El UID del usuario no existe');
        //Guardo las loadNotes que es para traer las notas de la base de datos
        const notes = await loadNotes(uid)
        //se dispara la acción setNotes de notes, que creamos arriba
        dispatch(setNotes(notes));
    }
}

//Para subir a la base de datos lo guardado. Primero tengo que indicar la ruta o query de firestore
export const startSaveNote = () => {
    return async (dispatch, getState) => {
        dispatch(setSaving());
        //Obtengo el user id
        const { uid } = getState().auth;
        //Obtengo el active, que ya viene con el id, si lo mando así se vuelve a crear un id y no quiero eso, así que eliminaré el id que viene con el active
        const { active } = getState().journal; //el active vendría a ser la nota, o hace referencia a la nota en cuestión
        const noteToFirestore = { ...active }
        delete noteToFirestore.id;
        // Hago la referencia en donde se tiene que guardar
        const docRef = doc(FirebaseDB, `${uid}/journal/notes/${active.id}`);
        //Ahora impacto esta referencia en la base de datos, guardado en sí con el setDoc. Primero marco la referencia (dónde) , luego qué quiero guardar (noteToFirestore, sin el id) y el tercer argumento es un objeto de opciones para el guardado. El merge es para que cree si hay algo que no estaba antes
        await setDoc(docRef, noteToFirestore, { merge: true })
        //Actualizo la nota para que se visualice en la pág sin tener que recargar todas las notas, sino que reescribo esta que se modificó. Mando la nota entera con el id
        dispatch(updateNote(active));
    }
}
//Fx para eliminar la nota activa, o seleccionada
export const startDeletingNote = () => {
    return async (dispatch, getState) => {
        //obtengo el user id
        const { uid } = getState().auth;
        //obtengo la nota activa
        const { active } = getState().journal;
        //Doy la referencia de la nota en la base de datos, con doc() fx de firestore. Tiene dos argumentos, primero la base de datos que lo tengo en config.js de firebase y el path o ruta dentro de la base de datos.
        //Con docRef lo que hago es señalar únicamente.
        const docRef = doc(FirebaseDB, `${uid}/journal/notes/${active.id}`)
        //Uso deleteDoc (), fx de firestore que únicamente pide la referencia del doc a eliminar
        await deleteDoc(docRef);
        //Hasta acá eliminé la nota de la base de datos de firestore, pero sigue estándo en el store de mi pág, por lo que voy a eliminarlo del store para que no se vea
        dispatch(deleteNoteById(active.id));
    }
}
