import { ChangeDetectorRef, Component } from '@angular/core';

import { ModalService } from '~services/modal/modal.service';

import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { EControlType } from '~app/components/forms';
import { IFieldInput } from '~app/components/forms/field-input';
import { FormService } from '~app/services/form/form.service';
import { WindowRef } from '~app/services/window-ref/window-ref.service';
import { ModalComponent } from '~modals/modal.component';

interface IRegisterFields {
	email: IFieldInput<string>;
	password: IFieldInput<string>;
	password2: IFieldInput<string>;
}

@Component( {
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
} )

export class RegisterComponent extends ModalComponent {

	public static closeRegisterModal = new BehaviorSubject<void>( undefined );

	public fieldRegister: IRegisterFields;
	public formRegister: FormGroup;

	private readonly formSendStateSubject = new BehaviorSubject<boolean | undefined>( undefined );
	public formSendState = this.formSendStateSubject.asObservable();

	public constructor(
		modalService: ModalService,
		private readonly windowRef: WindowRef,
		private readonly formService: FormService, private readonly httpClient: HttpClient,
		private readonly ref: ChangeDetectorRef ) {
		super( modalService );
		this.subscriptions.push( RegisterComponent.closeRegisterModal.subscribe( () => this.close() ) );

		this.fieldRegister = {
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
			password2: {
				value: '',
				label: 'Confirm Password',
				required: true,
				order: 1,
				controlType: EControlType.Input,
				type: 'password',
			},
		};

		this.formRegister = this.formService.toFormGroup( this.fieldRegister );
		this.formSendState.subscribe( s => console.log( 'formSendState', s ) );
	}

	public send() {
		this.httpClient.post( '/register', this.formRegister.value ).subscribe();
		this.formSendStateSubject.next( undefined );
		this.ref.detectChanges();
	}
}
