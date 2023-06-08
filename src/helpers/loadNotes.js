import { collection, getDocs } from "firebase/firestore/lite";
import { FirebaseDB } from "../firebase/config";

//Cargar las notas, traer las notas desde la base de datos firestore
export const loadNotes = async (uid = '') => {
    //Si no hay user id ( uid) saldrá error
    if (!uid) throw new Error('El UID del usuario no existe');
    //En una variable pongo la colección, primero pongo la base de datos y luego el query o ruta
    const collectionRef = collection(FirebaseDB, `${uid}/journal/notes`);
    //  Con la fx getDocs le doy la ruta o query que es collectionRef, pero me da mucha info de firebase que no necesito, necesito sólo la data. Así que después uso la fx data () que tiene firebase
    const docs = await getDocs(collectionRef);
//La data de las notas las voy a poner en un array notes
    const notes = [];
// Hago un forEach para recorrer el await de getDocs (docs), en cada iteración agrego a notes el id y todo el doc.data
    docs.forEach(doc => {
        notes.push({ id: doc.id, ...doc.data() });
    })
    return notes;
}
