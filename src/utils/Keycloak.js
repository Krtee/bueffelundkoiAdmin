import Keycloak from "keycloak-js";

// the central keycloak config
const keycloakConfig = {
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  url: process.env.REACT_APP_KEYCLOAK_URL,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT,
};

// central keycloak instance
const keycloakInstance = new Keycloak(keycloakConfig);

export default keycloakInstance;
