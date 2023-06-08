import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveNote } from "../../store/journal";
import {
  Grid,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { TurnedInNot } from "@mui/icons-material";

export const SideBarItem = ({ title, body, id, imageUrls = [], date }) => {
  //Creo una variable memorizada con el Hook Memo, que si el título tiene más de 17 caracteres lo cortará en 17 y concatenará ..., sino retorna el título completo
  const newTitle = useMemo(() => {
    return title.length > 17 ? title.substring(0, 17) + "..." : title;
  }, [title]);

  //Traigo active de JournalSlice, creo el dispatch y en la fx onActiveNote disparo la acción del setActiveNote pasándole todas sus props ya que hice el spread
  const { active } = useSelector((state) => state.journal);
  const dispatch = useDispatch();
  const onActiveNote = () => {
    dispatch(setActiveNote({ title, body, id, date, imageUrls }));
  };

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onActiveNote}>
        <ListItemIcon>
          <TurnedInNot />
        </ListItemIcon>
        <Grid container>
          <ListItemText primary={newTitle} />
          <ListItemText secondary={body} />
        </Grid>
      </ListItemButton>
    </ListItem>
  );
};
