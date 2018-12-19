import { Component, OnInit, ElementRef } from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';
import { LoginComponent } from '../../pages/login/login.component';
import { NavbarService } from '../../shared/services/navbar.service';

@Component( {
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css'],
} )
export class NavbarComponent implements OnInit {


	public constructor( private el: ElementRef, public nav: NavbarService, private modalService: ModalService ) { }

	public navbar = this.el.nativeElement.querySelector( 'body' );

	public ngOnInit() {
		this.nav.show();
	}

	public initLoginModal() {
		const inputs = {
		  isMobile: false,
		};
		this.modalService.init( LoginComponent, inputs, {} );
	}

	public removeModal() {
		this.modalService.destroy();
	}

	public hideNav() {
		this.nav.hide();
		this.navbar.classList.remove( 'is-menu-visible' );
	}

}
