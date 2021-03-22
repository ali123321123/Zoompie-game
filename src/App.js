import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import GameDetailsPage from "./pages/GameDetailsPage";
import AdminForm from "./components/admin-pages/AdminForm";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/admin">
          <AdminPage />
        </Route>
        <Route path="/adminform">
          <AdminForm />
        </Route>
        <Route path="/profile/:id">
          <ProfilePage />
        </Route>
        <Route path="/game/:id">
          <GameDetailsPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
