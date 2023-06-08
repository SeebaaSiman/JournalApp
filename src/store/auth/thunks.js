import { loginWithEmailPassword, registerUserWithEmailPassword, singInWithGoogle, logoutFirebase } from '../../firebase/providers';
import { fileUpload } from '../../helpers/fileUpload';
import { clearNotesLogout, setPhotoToActiveNote, setSaving } from '../journal';
import { checkingCredentials, logout, login } from './';

export const checkingAuthentication = () => {
    return async (dispatch) => {

        dispatch(checkingCredentials());

    }
}


export const startGoogleSignIn = () => {
    return async (dispatch) => {

        dispatch(checkingCredentials());

        const result = await singInWithGoogle();
        if (!result.ok) return dispatch(logout(result.errorMessage));

        dispatch(login(result))

    }
}


export const startCreatingUserWithEmailPassword = ({ email, password, displayName }) => {
    return async (dispatch) => {

        dispatch(checkingCredentials());//esto sirve para que cambie el estado de checking a authentiqued o no

        const result = await registerUserWithEmailPassword({ email, password, displayName });
        if (!result.ok) return dispatch(logout(result.errorMessage));

        dispatch(login(result));// con el login pasa a authentiqueded

    }

}
//
export const startLoginWithEmailPassword = ({ email, password }) => {
    return async (dispatch) => {

        dispatch(checkingCredentials());

        const result = await loginWithEmailPassword({ email, password });
        console.log(result);

        if (!result.ok) return dispatch(logout(result));
        dispatch(login(result));

    }
}
//Al cerrar sesión o deslogearse, se cierra sesión en firebase, se despacha logout para que aparezca como no autenticado y con clearNotesLogout limpia el store para que no figuren en consola o desde redux pluign
export const startLogout = () => {
    return async (dispatch) => {
        await logoutFirebase();
        dispatch(clearNotesLogout());
        dispatch(logout());
    }
}

export const startUploadingFiles = (files = []) => {
    return async (dispatch) => {
        dispatch(setSaving());

        //Para subir múltiples imágenes en simultáneo, agrupo las promesas en una variable de array. 
        const fileUploadPromises = [];
        //Hago un for of para que se agreguen al arreglo de promesas de arriba (con el push) las promesas que genera la fx fileUpload
        for (const file of files) {
            fileUploadPromises.push(fileUpload(file));
        }
        //Para disparar las promesas guardadas en el arreglo fileUploadPromises, uso Promise.all() que es una fx de js que sirve para arreglos de promesas y callbacks.
        //photoUrls contendrá la respuesta de las imágenes subidas. Así puedo usar ese query de las imágenes que se encuentran en cloudinary para mostrarlas en mi pág desde ese backend (endpoint) y no almacenarlas en mi pág 
        const photosUrls = await Promise.all(fileUploadPromises);
        dispatch(setPhotoToActiveNote(photosUrls));
    }
}