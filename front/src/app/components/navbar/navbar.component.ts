import { ModalComponent } from '../modal/modal.component';
import { Component } from '@angular/core';
import { ModalService } from '../../shared/services/modal/modal.service';

@Component( {
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css'],
} )
export class NavbarComponent extends ModalComponent {

	public constructor( modalService: ModalService ) {
		super( modalService );
	}
}
