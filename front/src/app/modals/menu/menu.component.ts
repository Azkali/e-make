import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { ModalComponent } from '~modals/modal.component';
import { LoginComponent } from '~modals/login/login.component';

import { ModalService } from '~services/modal/modal.service';
import { UserService } from '~services/user/user.service';

@Component( {
	selector: 'app-navbar',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
} )
export class MenuComponent extends ModalComponent {

	public constructor( modalService: ModalService, private userService: UserService ) {
		super( modalService );
	}

	public openLoginModal() {
		this.userService.openLogin().pipe( first() ).subscribe();
	}
}
