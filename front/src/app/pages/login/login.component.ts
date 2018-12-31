import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalService } from '../../shared/services/modal/modal.service';


@Component( {
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	encapsulation: ViewEncapsulation.ShadowDom,
} )
export class LoginComponent implements OnInit {

	public constructor( private modalService: ModalService ) { }

	public ngOnInit() {
	}

	public close() {
		this.modalService.close();
	}
}
