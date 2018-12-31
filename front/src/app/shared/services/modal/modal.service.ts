import { Injectable, Inject } from '@angular/core';
import { DomService } from '../dom/dom.service';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

const BLUR_BACK_CLASS = 'blurred';

@Injectable( {
	providedIn: 'root',
} )
export class ModalService {
	private modalVisibleStateSource = new BehaviorSubject<boolean>( false );
	public modalVisibleState = this.modalVisibleStateSource.asObservable();

	public constructor( private domService: DomService ) {}

	public backgroundBlurred = new BehaviorSubject( false );

	private modalElemId = 'modal';
	public open( component: any, inputs: object, outputs: object ) {
		const componentConfig = {
			inputs: inputs,
			outputs: outputs,
		};

		this.domService.appendComponentTo( this.modalElemId, component, componentConfig );
		this.backgroundBlurred.next( true );
		this.modalVisibleStateSource.next( true );
	}

	public close() {
		this.backgroundBlurred.next( false );
		this.modalVisibleStateSource.next( false );
	}

	public removeModalElement() {
		this.domService.removeComponent();
	}
}
