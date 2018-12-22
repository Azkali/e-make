import { Injectable } from '@angular/core';
import { DomService } from '../dom/dom.service';

@Injectable( {
	providedIn: 'root',
} )
export class ModalService {
	public constructor( private domService: DomService ) {}

	private modalElemId = 'modal';
	public init( component: any, inputs: object, outputs: object ) {
		const componentConfig = {
			inputs: inputs,
			outputs: outputs,
		};

		this.domService.appendComponentTo( this.modalElemId, component, componentConfig );
		document.getElementById( this.modalElemId ).style.display = 'flex';

	}

	public destroy() {
		this.domService.removeComponent();
		document.getElementById( this.modalElemId ).style.display = 'none';

	}
}
