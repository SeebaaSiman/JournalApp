import { useRef, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "../../hooks/useForm";
import {
  setActiveNote,
  startDeletingNote,
  startSaveNote,
} from "../../store/journal";
import { ImageGallery } from "../components";
import {
  DeleteOutline,
  SaveOutlined,
  UploadOutlined,
} from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { startUploadingFiles } from "../../store/auth";

export const NoteView = () => {
  // Traigo de journalSlice (state.journal) active. Luego la usaré como el estado inicial del useForm que es mi custom Hook. Desestructuro del useForm title, body, formState(que es el estado) y la fx onInputChange para poder escribir.
  const { active, messageSaved, isSaving, imageUrls } = useSelector(
    (state) => state.journal
  );
  //Al form le doy el valor inicial de active (que serían las notas activas en pantalla)
  const { formState, title, body, onInputChange, date } = useForm(active);
  const dispatch = useDispatch();
  //Actualiza el día de la nota que está guardado en memoria
  const dateString = useMemo(() => {
    const newDate = new Date(date);
    return newDate.toUTCString();
  }, [date]);

  //Al cambiar el estado del formulario se dispara setActiveNote
  useEffect(() => {
    dispatch(setActiveNote(formState));
  }, [formState]);

  //Usaré thunks porque es asíncrono. Al hacer click se dispara esta fx que guarda en la base de datos
  const onSaveNote = () => {
    dispatch(startSaveNote());
  };
  //Para usar el sweetAlert2. El messageSaved cambiará de string vacío a 'se actualizó correctamente', así que uso el if para ser más preciso.
  useEffect(() => {
    if (messageSaved.length > 0) {
      Swal.fire("Nota actualizada", messageSaved, "success"); // va sin return sino se rompería el useEffect, ya que hasta que no se use el segundo argumento, que aquí lo borré porque no lo usamos, no limpiaría el effect y no se volvería a reenderizar
    }
  }, [messageSaved]);

  //Fx que se dispara al hacer click en el input, si se seleccionaron 0 archivos no retorna nada y termina la fx.
  const onFileInputChange = ({ target }) => {
    if (target.files === 0) return;
    dispatch(startUploadingFiles(target.files));
  };

  //Lo uso para linkear el input en el icoButton, así cuando hago click en el icoButton es como si hiciera click en el input que está escondido por none
  const fileInputRef = useRef();
  //Fx para eliminar la nota
  const onDelete = () => {
    dispatch(startDeletingNote());
    Swal.fire("Nota eliminada", "", "success");
  };
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 1 }}
    >
      <Grid item>
        <Typography fontSize={39} fontWeight="light">
          {dateString}
        </Typography>
      </Grid>
      <Grid item>
        {/* Creo el input para subir archivos, pongo multiple para poder seleccionar más de un archivo. Lo bueno es que puedo controlar y ver que archivos selecciona para subir, pero como se ve feo abajo creo un icoButton y escondo con none el input. Luego usaré un useRef para 'linkear' el input al botón, así cuando hago click en el icoButton hace referencia al input escondido */}
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={onFileInputChange}
          style={{ display: "none" }}
        />

        <IconButton
          color="primary"
          disabled={isSaving}
          onClick={() => fileInputRef.current.click()}
        >
          <UploadOutlined />
        </IconButton>

        {/* Al hacer click le digo que se ejecuta una fx linkeada al fileInputRef que simula un click en ese elemento de referencia */}
        <Button
          color="primary"
          sx={{ padding: 2 }}
          onClick={onSaveNote}
          disabled={isSaving}
        >
          <SaveOutlined sx={{ fontSize: 30, mr: 1 }} />
          Guardar
        </Button>
        <Button onClick={onDelete} color="error" >
          <DeleteOutline />
          Borrar
        </Button>
      </Grid>

      <Grid container>
        <TextField
          type="text"
          variant="filled"
          fullWidth
          placeholder="Ingrese un título"
          label="Título"
          sx={{ border: "none", mb: 1 }}
          name="title"
          value={title}
          onChange={onInputChange}
        />

        <TextField
          type="text"
          variant="filled"
          fullWidth
          multiline
          placeholder="¿Qué sucedió en el día de hoy?"
          minRows={5}
          name="body"
          value={body}
          onChange={onInputChange}
        />
      </Grid>
      <ImageGallery images={active.imageUrls} />
    </Grid>
  );
};
