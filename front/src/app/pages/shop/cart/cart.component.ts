import { Component, Input } from '@angular/core';
import { ModalService } from '../../../shared/services/modal.service';
@Component( {
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss'],
} )
export class CartComponent {

	public constructor( private modalService: ModalService ) { }

	public close() {
		this.modalService.destroy();
	  }
}
