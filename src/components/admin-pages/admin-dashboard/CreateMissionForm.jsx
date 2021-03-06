import React, { useState, useEffect } from "react";
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
  TableCell,
  RadioGroup,
  Radio,
} from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import CloseIcon from "@material-ui/icons/Close";
import { light } from "../../shared/themeGameCards";
import Endpoints from "../../../services/endpoints";
import { getTokenInStorage } from "../../../utils/tokenHelper";
import { useHistory, useLocation, useParams } from "react-router";
import Map from "../../map/Map";
import MapAddMarker from "../../map/MapAddMarker";
import Icons from "../../../utils/icons";

const CreateMissionForm = ({ openMission, setOpenMission, game }) => {
  const location = useLocation();
  const { id: gameId } = useParams();
  const { handleSubmit } = useForm();
  const [setData] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isHumanVisible, setIsHumanVisible] = useState(false);
  const [isZombieVisible, setIsZombieVisible] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [visibleForWhom, setVisibleForWhom] = useState(false); // If the mission is for humans = true, for zombies = false

  const updateGame = () => {
      if(visibleForWhom) {
          setIsHumanVisible(true)
          setIsZombieVisible(false)
      }
      else{
        setIsHumanVisible(false)
        setIsZombieVisible(true)
      }
    let data = {
      name,
      isHumanVisible,
      isZombieVisible,
      isComplete: false,
      description,
      startTime,
      endTime,
      lat: markerPosition.lat,
      lng: markerPosition.lng,
      gameId: gameId,
    };

    fetch(`${Endpoints.MISSION_API}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getTokenInStorage(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json().then((res) => console.warn("result", res)));

    setOpenMission(false);
    window.location.reload();
  };

  const [markerPosition, setMarkerPosition] = useState([]);

  const handleMissionTitle = (e) => {
    setName(e.target.value);
  };

  const handleMissionDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleForHumans = () => {
    setIsZombieVisible(false);
    setIsHumanVisible(true);
  };
  const handleForZombies = () => {
    setIsHumanVisible(false);
    setIsZombieVisible(true);
  };

  const handleClose = () => {
    setOpenMission(false);
  };

  const handleStartDateChange = (date) => {
    setStartTime(date);
  };

  const handleEndDateChange = (date) => {
    setEndTime(date);
  };

  const handleHumanPlayerRadioButton = (e) => {
    setVisibleForWhom((s) => !s);
    
  };

  return (
    <div>
      <MuiThemeProvider theme={light}>
        <CssBaseline />
        <Dialog
          open={openMission}
          fullWidth
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogActions>
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogActions>

          <DialogTitle variant="h4" id="form-dialog-title">
            <Typography variant="h3">Create new Mission</Typography>
          </DialogTitle>

          <DialogContent dividers>
            {/* FORM START*/}

            <form onSubmit={handleSubmit((data) => setData(data))}>
              {/* GAME TITLE & IMAGE */}

              <DialogContent>
                <TextField
                  required
                  autoFocus
                  name="name"
                  label="Mission Title"
                  style={{ padding: "10px" }}
                  onChange={handleMissionTitle}
                />
              </DialogContent>

              <DialogContent>
                <TextField
                  required
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
              {/* <FormControl component="fieldset">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox onClick={handleForHumans} name="Humans" />
                    }
                    label="For Humans"
                  />
                </FormGroup>
              </FormControl> */}

              {/* Zombie   */}
              {/* <FormControl component="fieldset">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox onClick={handleForZombies} name="Zomnbies" />
                    }
                    label="For Zombies"
                  />
                </FormGroup>
              </FormControl> */}

              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="missionType"
                  name="missionTypeSelect"
                  value={visibleForWhom}
                  onChange={handleHumanPlayerRadioButton}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="For Humans"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="For Zombies"
                  />
                </RadioGroup>
              </FormControl>

              {/* Interactive Map | UPLOAD IMAGE*/}
              {game && (
                <DialogContent style={{ height: "20em" }}>
                  <Map
                    center={[
                      (game.nW_lat + game.sE_lat) / 2,
                      (game.nW_lng + game.sE_lng) / 2,
                    ]}
                    scrollWheelZoom={true}
                  >
                    {visibleForWhom ? (
                      <MapAddMarker
                        markerImage={Icons.humanMarker}
                        setMarkerPosition={setMarkerPosition}
                      />
                    ) : (
                      <MapAddMarker
                        markerImage={Icons.zombieMarker}
                        setMarkerPosition={setMarkerPosition}
                      />
                    )}
                  </Map>
                </DialogContent>
              )}

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
