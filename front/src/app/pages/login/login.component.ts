import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalService } from '../../shared/services/modal/modal.service';
import { ModalComponent } from '../../components/modal/modal.component';


@Component( {
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
} )
export class LoginComponent extends ModalComponent {
	public constructor( modalService: ModalService ) {
		super( modalService );
	}
}
