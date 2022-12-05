import { KeycloakService } from "keycloak-angular";
import {ConfigInitService} from "./config-init.service";
import {switchMap} from "rxjs/operators";
import {fromPromise} from "rxjs/internal-compatibility";

export function initializeKeycloak(
  keycloak: KeycloakService,
  configService: ConfigInitService
) {
  return () =>
    configService.getConfig()
      .pipe(
        switchMap<any, any>((config) => {

          return fromPromise(keycloak.init({
            config: {
              url: config['KEYCLOAK_URL'],
              realm: config['KEYCLOAK_REALM'],
              clientId: config['KEYCLOAK_CLIENT_ID'],
            },
            initOptions: {
              pkceMethod: 'S256',
              checkLoginIframe: false
            }
          }))

        })
      ).toPromise();
}
