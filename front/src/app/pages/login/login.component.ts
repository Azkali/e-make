import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalService } from '../../shared/services/modal/modal.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { environment } from '../../..//environments/environment';
import { makeAbsoluteUrl } from '../../../../../cross/config/utils';
import { HttpClient } from '@angular/common/http';

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
