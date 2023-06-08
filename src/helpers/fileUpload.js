//Creo la petición para subir un archivo a cloudinary. Esto lo mandaré a llamar por el thunks
export const fileUpload = async (file) => {
    //Si no hay archivo arroja un error
    if (!file) throw new Error('No tenemos ningún archivo a subir')
    //El query de cloudinary que lo hice con postman
    const cloudUrl = 'https://api.cloudinary.com/v1_1/dtagfnge3/image/upload'
    //Debo editar el body - formData, por un lado el tipo de archivo y el archivo en sí que quiero subir y como segundo el upload_preset que sería react-journal en este caso que es el nombre que le puse a mi proyecto en cloudinary
    //Construyo el body
    const formData = new FormData(); //FormData () fx de JS
    formData.append('upload_preset', 'react-journal')
    formData.append('file', file)
    //Si sale bien
    try {

        const resp = await fetch(cloudUrl, {
            method: 'POST',
            body: formData
        })

        if (!resp.ok) throw new Error('No se pudo subir imágen')

        const cloudResp = await resp.json();

        return cloudResp.secure_url;
    }
    catch (error) {
        throw new Error(error.message);
    }
}