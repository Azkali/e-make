import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../modal.component';
import { ModalService } from '~app/services/modal/modal.service';

@Component( {
	selector: 'app-order-form',
	templateUrl: './order-form.component.html',
	styleUrls: ['./order-form.component.scss'],
} )
export class OrderFormComponent extends ModalComponent {
	public constructor( modalService: ModalService ) {
		super( modalService );
	}
}
