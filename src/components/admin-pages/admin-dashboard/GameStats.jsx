import { React, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import useSWR from "swr";
import { fetcherToken } from "../../../services/FetcherFunction";
import Endpoints from "../../../services/endpoints";
import { getTokenInStorage } from "../../../utils/tokenHelper";
import { useSelector } from "react-redux";
import Title from "./Title";

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function GameStats({ game }) {
  const classes = useStyles();

  const user = useSelector((state) => state.loggedInUser);

  const [player, setPlayer] = useState({});
  const [humanPlayers, setHumanPlayers] = useState([]);
  const [playerBiteCode, setPlayerBiteCode] = useState();
  const { hoursPlayed, setHoursPlayed } = useState();

  //Fech players
  const {
    data: players,
    error: playersError,
  } = useSWR(`${Endpoints.GAME_API}/${game.id}/players`, (url) =>
    fetcherToken(url, getTokenInStorage())
  );

  console.log(game);
  console.log("players", players);
  //Fech Squad
  const {
    data: squads,
    error: squadsError,
  } = useSWR(`${Endpoints.GAME_API}/${game.id}/squads`, (url) =>
    fetcherToken(url, getTokenInStorage())
  );

  console.log("squads", squads);
  const [idFromPlayer, setIdFromPlayer] = useState();

  // for (const element of Object.entries(squads)) {
  //   const key = element[0],
  //     value = element[1];
  //   console.log(value.squadMembers);
  //   const member = value.squadMembers;
  //   console.log("memeber", member);

  //   console.log(value.name);
  // }
  //From player player.id
  //from squads squadMembers.playerId
  // console.log(players.filter((g) => players.map((g) => g.name)));
  // console.log(squads.filter((g) => squads.map((g) => g.name)));

  return (
    <>
      <Title>Game info </Title>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Player Name</TableCell>
            <TableCell>Player Type</TableCell>
            <TableCell>Bite Code</TableCell>
            <TableCell>Squad Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players?.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.isHuman ? `Human` : `Zombie`}</TableCell>
              <TableCell>{p.biteCode}</TableCell>
              <TableCell>{p.squad}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

// const startDate = game.startTime;
// const currentDate = new Date();
// const endDate = game.endTime;

// const startTime = new Date(startDate);
// startTime.getTime();
// console.log(startTime.getHours());

// const date = new Date("Thur Mar 25 2021 10:00:00");
// console.log(date.getHours());
// console.log(date.setHours(date.getHours() - 5));
// console.log(date.setMinutes(date.getMinutes() - 30));

// const timeDiff = Math.abs(currentDate.getTime() - startTime.getTime());
// var minutes = Math.floor(timeDiff / 60000);
// var seconds = ((timeDiff % 60000) / 1000).toFixed(0);

// if (currentDate > endDate) {
//   setHoursPlayed(currentDate - startDate);
// }
// console.log("time diff", timeDiff);
// console.log(seconds, "seconds");
// console.log(minutes, "min");
// console.log(startTime);
// console.log(game.startTime);
// console.log(currentDate);
