import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FirebaseAuth } from "../firebase/config";
import { login, logout } from "../store/auth";
import { startLoadingNotes } from "../store/journal";

export const useCheckAuth = () => {
    const { status } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        //onAuthStateChanged es una fx de firebase para saber todos los estados que cambian
        // onAuthStateChanged observará cambios en FirebaseAuth y expresará un callback de user que es asíncrono
        onAuthStateChanged(FirebaseAuth, async (user) => {
            // si no hay usuario, no estoy autenticado así que hace dispatch del logout que está en AuthSlice.js
            if (!user) return dispatch(logout());
            // si hay usuario, desestrecuturo el uid, email, displayName y photoURL para luego despacharlo
            const { uid, email, displayName, photoURL } = user;
            dispatch(login({ uid, email, displayName, photoURL }));
            dispatch(startLoadingNotes());
        });
    }, []);

    return status
}
