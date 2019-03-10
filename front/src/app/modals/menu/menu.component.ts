import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { ModalComponent } from '~modals/modal.component';

import { ModalService } from '~services/modal/modal.service';
import { UserService } from '~services/user/user.service';

@Component( {
	selector: 'app-navbar',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
} )
export class MenuComponent extends ModalComponent {
	public isLoggedIn = this.userService.isAuthenticated;

	public constructor( modalService: ModalService, private readonly userService: UserService ) {
		super( modalService );
		this.userService.checkLogin().pipe( first() ).subscribe();
	}

	public openLoginModal() {
		this.userService.openLogin().pipe( first() ).subscribe();
	}

	public logout() {
		this.userService.logout();
	}
}
