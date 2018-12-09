import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class OAuth2Service {

constructor() { }
}
 
export const authConfig: AuthConfig = {
   
  // Url of the Identity Provider
  issuer: 'http://api.emake.io:8000',

  requireHttps: false,
 
  // URL of the SPA to redirect the user to after login
  redirectUri: 'http://www.emake.io:4200/',
 
  // The SPA's id. The SPA is registerd with this id at the auth-server
  clientId: '2_14ca329zrl1cwwwkkgc4o4gkco4wcoskoo440wg8kwskskw$tokenokg',
 
  oidc: false,

  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  //scope: 'openid profile email voucher',
  }
