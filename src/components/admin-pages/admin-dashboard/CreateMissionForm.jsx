import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Checkbox,
  CssBaseline,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MuiThemeProvider,
  TextField,
  IconButton,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
} from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import CloseIcon from "@material-ui/icons/Close";
import { themeCreateGameForm } from "../../shared/themeGameCards";
import Endpoints from "../../../services/endpoints";
import { getTokenInStorage } from "../../../utils/tokenHelper";
import { useParams } from "react-router";

const CreateMissionForm = ({ openMission, setOpenMission }) => {
  const { id: gameId } = useParams();
  const { handleSubmit } = useForm();
  const [setData] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isHumanVisible, setIsHumanVisible] = useState(false);
  const [isZombieVisible, setIsZombieVisible] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [imageUrl, setImageUrl] = useState("");

  const updateGame = () => {
    let data = {
      name,
      isHumanVisible,
      isZombieVisible,
      description,
      startTime,
      endTime,
      //   lat,
      //   lang,
      gameId: gameId,
    };

    fetch(`${Endpoints.MISSION_API}${gameId}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getTokenInStorage(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json().then((res) => console.warn("result", res)));

    setOpenMission(false);
  };

  console.log("gameID", gameId);

  const handleMissionTitle = (e) => {
    setName(e.target.value);
  };

  const handleMissionDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleForHumans = () => {
    setIsHumanVisible(true);
  };
  const handleForZombies = () => {
    setIsZombieVisible(true);
  };

  const handleClose = () => {
    setOpenMission(false);
  };

  const handleStartDateChange = (date) => {
    console.log(date);
    setStartTime(date);
  };

  const handleEndDateChange = (date) => {
    console.log(date);
    setEndTime(date);
  };

  return (
    <div>
      <MuiThemeProvider theme={themeCreateGameForm}>
        <CssBaseline />
        <Dialog
          open={openMission}
          fullWidth
          onClose={handleClose}
          maxWidth="sm"
          aria-labelledby="responsive-dialog-title"
        >
          <DialogActions>
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogActions>

          <DialogTitle id="form-dialog-title">
            <Typography variant="h4">Create new Mission</Typography>
          </DialogTitle>

          <DialogContent dividers>
            {/* FORM START*/}

            <form onSubmit={handleSubmit((data) => setData(data))}>
              {/* GAME TITLE & IMAGE */}
              <DialogContent>
                <TextField
                  autofocus
                  name="name"
                  label="Mission Title"
                  style={{ padding: "10px" }}
                  onChange={handleMissionTitle}
                />
              </DialogContent>

              <DialogContent>
                <TextField
                  autofocus
                  name="description"
                  label="Mission Description"
                  style={{ padding: "10px" }}
                  onChange={handleMissionDescription}
                />
              </DialogContent>

              {/* START | END DATE */}
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  id="time-picker"
                  label="Start Date/Time (UTC)"
                  format="MM/dd/yyyy"
                  value={startTime}
                  onChange={handleStartDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <KeyboardDateTimePicker
                  id="time-picker"
                  label="End Date/Time (UTC)"
                  format="MM/dd/yyyy"
                  value={endTime}
                  onChange={handleEndDateChange}
                  minDate={startTime}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </MuiPickersUtilsProvider>

              {/* Human   */}
              <FormControl component="fieldset">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox onClick={handleForHumans} name="Humans" />
                    }
                    label="For Humans"
                  />
                </FormGroup>
              </FormControl>

              {/* Zombie   */}
              <FormControl component="fieldset">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox onClick={handleForZombies} name="Zomnbies" />
                    }
                    label="For Zombies"
                  />
                </FormGroup>
              </FormControl>

              {/* Interactive Map | UPLOAD IMAGE*/}
              <DialogContent>
                <Typography gutterBottom>Interactive Map</Typography>
              </DialogContent>

              {/* BUTTON CREATE MISSION */}
              <section>
                <DialogActions>
                  <Button
                    className="buttonPink"
                    color="primary"
                    type="button"
                    onClick={updateGame}
                  >
                    Create Mission
                  </Button>
                </DialogActions>
              </section>
            </form>
          </DialogContent>
        </Dialog>
      </MuiThemeProvider>
    </div>
  );
};

export default CreateMissionForm;