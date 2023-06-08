import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { FirebaseAuth } from './config';

//acá irán los proveedores de autenticación , como google y por maail, que creamos en la página de firebase
const googleProvider = new GoogleAuthProvider();

export const singInWithGoogle = async () => {

    try {

        const result = await signInWithPopup(FirebaseAuth, googleProvider);
        // const credentials = GoogleAuthProvider.credentialFromResult( result );
        const { displayName, email, photoURL, uid } = result.user;

        return {
            ok: true,
            // User info
            displayName, email, photoURL, uid
        }


    } catch (error) {

        const errorCode = error.code;
        const errorMessage = error.message;

        return {
            ok: false,
            errorMessage,
        }
    }

}


export const registerUserWithEmailPassword = async ({ email, password, displayName }) => {

    try {
        // Necesita el auth que creamos en config.js y el provedor que está arriba
        const resp = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
        // usa el result creado arriba como resultado de las credenciales de googleAuthProvider
        // const credentials = GoogleAuthProvider.credentialFromResult(result);
        const { uid, photoURL } = resp.user;

        await updateProfile(FirebaseAuth.currentUser, { displayName });

        return {
            ok: true,
            //user info
            uid, photoURL, email, displayName
        }

    } catch (error) {
        console.log(error);
        return { ok: false, errorMessage: error.message }
    }

}


export const loginWithEmailPassword = async ({ email, password }) => {

    try {
        const resp = await signInWithEmailAndPassword(FirebaseAuth, email, password);
        const { uid, photoURL, displayName } = resp.user;

        return {
            ok: true,
            uid, photoURL, displayName
        }

    } catch (error) {
        return { ok: false, errorMessage: error.message }
        //errorMessage será lo que aparece al salir error, puedo poner un string que yo quiera
    }
}

export const logoutFirebase = async () => {
    return await FirebaseAuth.signOut();
    //esto cierra firebase, google, apple, twitter, facebook, cierra todo
}


