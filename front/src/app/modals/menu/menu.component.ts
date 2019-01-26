import { Component } from '@angular/core';

import { ModalComponent } from '~modals/modal.component';
import { LoginComponent } from '~modals/login/login.component';

import { ModalService } from '~services/modal/modal.service';

@Component( {
	selector: 'app-navbar',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
} )
export class MenuComponent extends ModalComponent {

	public constructor( modalService: ModalService ) {
		super( modalService );
	}

	public openLoginModal() {
		this.modalService.open( LoginComponent, { isMobile: false }, {} );
	}
}
