import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useAxios } from "../utils/AxiosUtil";

const App = () => {
  const { initialized, keycloak } = useKeycloak();
  const { t } = useTranslation();
  const axios = useAxios();
  const [chuckResponse, setChuckResponse] = useState<any>();

  useEffect(() => {
    if (!axios) return;
    axios.get("/jokes/random").then((resp) => setChuckResponse(resp.data));
  }, [axios]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          {initialized && keycloak && keycloak.authenticated ? (
            <>
              <h2 onClick={() => keycloak.logout()}>{t("test")}</h2>
              {chuckResponse && (
                <>
                  <img src={chuckResponse.icon_url} alt="Chuck Norris" />
                  <p>{chuckResponse.value}</p>
                </>
              )}
            </>
          ) : (
            () => keycloak.login()
          )}
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
