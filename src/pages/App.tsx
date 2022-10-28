import { useKeycloak } from "@react-keycloak/web";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ReservationOverview } from "./ReservationOverviewAlpha";

const App = () => {
  const { initialized, keycloak } = useKeycloak();

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          {initialized && keycloak && keycloak.authenticated ? (
            <ReservationOverview />
          ) : (
            keycloak.login()
          )}
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
