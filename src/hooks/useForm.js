import { useEffect, useMemo, useState } from "react";

export const useForm = (initialForm = {}, formValidations = {}) => {

    const [formState, setFormState] = useState(initialForm);
    const [formValidation, setFormValidation] = useState({});


    useEffect(() => {
        createValidators();
    }, [formState])


    //Si el initial form cambia vuelve a llamar 
    useEffect(() => {
        setFormState(initialForm);
    }, [initialForm])

    //Memorizo cada elemento que contiene formValided que es el estado de la validación de mi formulario, se vuelve a memorizar cada vez que cambia el formValided
    // recorro con un for of cada elemento del formValided y le consulto con un if.
    //el if se leería: si cada formValue (displayName, email, password) que son propiedades de formValided, son distintas a null retornará false y corta la fx isFormValid. Si no es null significa que arrojaría un msj como requiere más de 6 letras, o requiere un @, etc. Según figura en formValidations en RegisterPage.jsx
    const isFormValid = useMemo(() => {

        for (const formValue of Object.keys(formValidation)) {
            if (formValidation[formValue] !== null) return false;
        }

        return true;
    }, [formValidation])

    // Fx que me permite hacer cambio de cualquier input. El evento que recibe onInputChange es de onChange, pero lo desestructuro sólo el target del evento, que es lo que me interesa */}
    const onInputChange = ({ target }) => {
        {/*Desestructuro las dos propiedades que me interesan del event.target el name para saber que elemento cambia y el value para saber que tipeó el usuario, el valor de su teclado*/ }
        const { name, value } = target;
        {/*Seteo el nuevo valor del estado formState*/ }
        setFormState({
            //Traigo todos los valores del objeto formState, en este caso username y email, para que no se cambien o se mantengan//
            ...formState,
            //Indico que la propiedad name del objeto va a tener el valor de value, su nuevo valor será lo que capturó onInputChange con event.target.value//
            [name]: value,
        });
    }
    //Creo una función que cuando se la llama dal setFormState el valor de initialFrom//
    const onResetForm = () => {
        setFormState(initialForm);
    }
    //Creo una fx que creará un objeto que luego se recorrerá con un for of para saber si cada propiedad me da un null, si no da un null saltará el error desde formValidations que está en RegisterPage.jsx. Por último usaré setFormValid de mi useState. 
    const createValidators = () => {

        const formCheckedValues = {};

        for (const formField of Object.keys(formValidations)) {
            const [fn, errorMessage] = formValidations[formField];

            formCheckedValues[`${formField}Valid`] = fn(formState[formField]) ? null : errorMessage;
        }

        setFormValidation(formCheckedValues);
    }
    return {
        ...formState, //Manera de mandar por separado los valores de formState, email, password, username//
        formState,
        onInputChange,
        onResetForm,
        ...formValidation,
        isFormValid
    }
}