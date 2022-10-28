# Client Blueprint

Das ist das Blueprint Projekt für die React Clients. Dieser Blueprint hat folgenden Funktionsumfang:

- PWA ready
- SASS support
- React Router
- Axios Support mit konfiguriertem Auth Bearer Header
- Keycloak Anbindung
- i18n support
- DEV/PROD environments
- Google Web Vital support

Um mit diesem client zu entwickeln benötigt es eine laufende Keycloak Instanz mit einem entsprechendem Realm, das dann in der .env hinterlegt werden muss.

# Config

Das Blueprint Projekt bringt folgende Parameter mit, die konfiguriert werden können/müssen:

| Name                      | Beschreibung                                                                                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REACT_APP_SERVICE_URL     | Die URL um die Microservices anzusprechen                                                                                                                               |
| REACT_APP_KEYCLOAK_URL    | Die URL um die Keycloak Instanz zu erreichen                                                                                                                            |
| REACT_APP_KEYCLOAK_REALM  | Der Keycloak realm                                                                                                                                                      |
| REACT_APP_KEYCLOAK_CLIENT | Der Keycloak client                                                                                                                                                     |
| REACT_APP_SHOW_TEST       | Optionaler Parameter ob ein Test-Zeichen im Build sein soll. Um den Bool korrekt auszulesen diese Syntax nutzen: `JSON.parse(process.env.REACT_APP_PROMODX_SHOW_TEST!)` |

# Versionen

Nachfolgend ist eine Auflistung der Blueprint Versionen (gleichzeitig die Tags) und die damit kompatiblen Versions-Abhängigkeiten.

## V 1.1

Folgende Abhängigkeiten sind getestet und funktional:

| Name     | Version |
| -------- | ------- |
| Keycloak | 13.0.1  |

Dem Blueprint liegen folgende Versionen zugrunde:

| Name             | Version |
| ---------------- | ------- |
| React            | 17.0.2  |
| React Router     | 5.3.0   |
| Keycloak-Adapter | 15.0.2  |
| Typescript       | 14.1.3  |
| Typescript       | 4.4.4   |

## V 1.0

Folgende Abhängigkeiten sind getestet und funktional:

| Name     | Version |
| -------- | ------- |
| Keycloak | 11.0.3  |

Dem Blueprint liegen folgende Versionen zugrunde:

| Name             | Version |
| ---------------- | ------- |
| React            | 17.0.1  |
| React Router     | 5.2.0   |
| Keycloak-Adapter | 12.0.2  |
| Typescript       | 4.1.3   |
