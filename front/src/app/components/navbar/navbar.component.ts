import { ModalComponent } from '../modal/modal.component';
import { Component } from '@angular/core';
import { ModalService } from '../../shared/services/modal/modal.service';
import { LoginComponent } from '../../pages/login/login.component';

@Component( {
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
} )
export class NavbarComponent extends ModalComponent {

	public constructor( modalService: ModalService ) {
		super( modalService );
	}

	public openLoginModal() {
		this.modalService.open( LoginComponent, { isMobile: false }, {} );
	}
}
