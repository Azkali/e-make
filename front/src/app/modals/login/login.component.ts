import { Component } from '@angular/core';

import { makeAbsoluteUrl } from '~cross/config/utils';

import { environment } from '~environments/environment';

import { ModalComponent } from '~modals/modal.component';

import { ModalService } from '~services/modal/modal.service';
import { WindowRef } from '~app/services/window-ref/window-ref.service';
import { UserService } from '~app/services/user/user.service';
import { BehaviorSubject } from 'rxjs';

enum EAuthProvider {
	Google = 'google',
}

@Component( {
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
} )
export class LoginComponent extends ModalComponent {
	public static closeLoginModal = new BehaviorSubject<void>( undefined );

	public getLoginUrl( method: EAuthProvider ) {
		if ( environment.common.back.auth.availableMethods.indexOf( method ) === -1 ) {
			throw new Error( 'Unconfigured method ' + method );
		}
		return `${makeAbsoluteUrl( environment.common.back )}${environment.common.back.auth.baseAuthRoute}/${method}`;
	}

	public constructor( modalService: ModalService, private windowRef: WindowRef ) {
		super( modalService );
		this.subscriptions.push( LoginComponent.closeLoginModal.subscribe( () => this.close() ) );
	}

	public openLoginPopup( method: EAuthProvider ) {
		const url = this.getLoginUrl( method );
		this.windowRef.nativeWindow.open( url, 'popup','width=600,height=600,scrollbars=no,resizable=no' );
		return false;
	}
}
