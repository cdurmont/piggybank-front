import { KeycloakService } from "keycloak-angular";

export function initializeKeycloak(
  keycloak: KeycloakService
) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://access.durmont.net' ,
        realm: 'home',
        clientId: 'piggybank-front-dev',
      },
      initOptions: {

        pkceMethod: 'S256',
        checkLoginIframe: false
      }
    });
}
