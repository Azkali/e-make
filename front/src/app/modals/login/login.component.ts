import { Component } from '@angular/core';

import { makeAbsoluteUrl } from '~cross/config/utils';

import { environment } from '~environments/environment';

import { ModalComponent } from '~modals/modal.component';

import { ModalService } from '~services/modal/modal.service';

enum EAuthProvider {
	Google = 'google',
}

@Component( {
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
} )
export class LoginComponent extends ModalComponent {
	public getLoginUrl( method: EAuthProvider ) {
		if ( environment.common.back.auth.availableMethods.indexOf( method ) === -1 ) {
			throw new Error( 'Unconfigured method ' + method );
		}
		return `${makeAbsoluteUrl( environment.common.back )}${environment.common.back.auth.baseAuthRoute}/${method}`;
	}

	public constructor( modalService: ModalService ) {
		super( modalService );
	}
}
