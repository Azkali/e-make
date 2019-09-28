import { ChangeDetectorRef, Component } from '@angular/core';

import { makeAbsoluteUrl } from '~cross/config/utils';

import { environment } from '~environments/environment';

import { RegisterComponent } from '~modals/login/register.component';
import { ModalComponent } from '~modals/modal.component';

import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { assign, mapValues } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { EControlType, IFieldBase } from '~app/components/forms';
import { IFieldInput } from '~app/components/forms/field-input';
import { FormService } from '~app/services/form/form.service';
import { WindowRef } from '~app/services/window-ref/window-ref.service';
import { ModalService } from '~services/modal/modal.service';

enum EAuthProvider {
	Google = 'google',
	Github = 'github',
	emailPass = 'emailPass',
}

interface ILoginFields {
	email: IFieldInput<string>;
	password: IFieldInput<string>;
}

@Component( {
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
} )
export class LoginComponent extends ModalComponent {
	public static closeLoginModal = new BehaviorSubject<void>( undefined );
	public EAuthProvider = EAuthProvider;

	public fieldLogin: ILoginFields;
	public formLogin: FormGroup;

	public isSync = true;

	private readonly formSendStateSubject = new BehaviorSubject<boolean | undefined>( undefined );
	public formSendState = this.formSendStateSubject.asObservable();

	public readonly maxLength = 255;

	public getLoginUrl( method: EAuthProvider ) {
		if ( environment.common.back.auth.availableMethods.indexOf( method ) === -1 ) {
			console.log( environment );
			throw new Error( 'Unconfigured method ' + method );
		}
		return `${makeAbsoluteUrl( environment.common.back )}${environment.common.back.auth.baseAuthRoute}/${method}`;
	}

	public constructor(
		modalService: ModalService,
		private readonly windowRef: WindowRef,
		private readonly formService: FormService, private readonly httpClient: HttpClient,
		private readonly ref: ChangeDetectorRef ) {
		super( modalService );
		this.subscriptions.push( LoginComponent.closeLoginModal.subscribe( () => this.close() ) );

		this.fieldLogin = {
			email: {
				value: '',
				label: 'E-mail adress',
				required: true,
				order: 1,
				controlType: EControlType.Input,
				type: 'email',
			},
			password: {
				value: '',
				label: 'Password',
				required: true,
				order: 1,
				controlType: EControlType.Input,
				type: 'password',
			},
		};

		this.formLogin = this.formService.toFormGroup( this.fieldLogin );
		this.formSendState.subscribe( s => console.log( 'formSendState', s ) );
	}

	public openLoginPopup( method: EAuthProvider ) {
		const url = this.getLoginUrl( method );
		this.windowRef.nativeWindow.open( url, 'popup', 'width=600,height=600,scrollbars=no,resizable=no' );
		return false;
	}

	public send() {
	this.httpClient.post( this.getLoginUrl( EAuthProvider.emailPass ), this.formLogin.value ).subscribe();
	this.formSendStateSubject.next( undefined );
	this.ref.detectChanges();
	}

	public openRegisterModal( immediate = false ) {
		this.subscriptions.push( LoginComponent.closeLoginModal.subscribe( () => this.close() ) );
		return this.modalService.open( RegisterComponent, undefined, undefined, undefined, immediate ).pipe( first() ).subscribe();
	}
}
