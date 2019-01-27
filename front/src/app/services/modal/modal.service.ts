import { Injectable, Inject, EventEmitter, ComponentRef } from '@angular/core';
import { DomService } from '../dom/dom.service';
import { BehaviorSubject } from 'rxjs';
import { skip, first, filter } from 'rxjs/operators';
import { isUndefined } from 'lodash';
import { Router, RouterEvent, GuardsCheckStart } from '@angular/router';

const BLUR_BACK_CLASS = 'blurred';

@Injectable( {
	providedIn: 'root',
} )
export class ModalService {
	private modalVisibleStateSource = new BehaviorSubject<boolean>( false );
	public modalVisibleState = this.modalVisibleStateSource.asObservable();
	private currentModal = new BehaviorSubject<undefined | ComponentRef<any>>( undefined );

	public constructor( private router: Router , private domService: DomService ) {}

	public backgroundBlurred = new BehaviorSubject( false );

	private modalElemId = 'modal';
	public open( component: any, inputs: object, outputs: object ) {
		if ( this.modalVisibleStateSource.value === true ) {
			console.log( 'delay' );
			this.currentModal.pipe( filter( val => isUndefined( val ) ), first() ).subscribe( () => this.open( component, inputs, outputs ) );
			this.close();
			return;
		}
		console.log( 'do' );
		const componentConfig = {
			inputs: inputs,
			outputs: outputs,
		};

		this.currentModal.next( this.domService.appendComponentTo( this.modalElemId, component, componentConfig ) );
		this.backgroundBlurred.next( true );
		this.modalVisibleStateSource.next( true );
	}

	public close() {
		this.backgroundBlurred.next( false );
		this.modalVisibleStateSource.next( false );
		//this.router.events.subscribe( RouterEvent => { onchange() } );
	}

	public removeModalElement() {
		this.domService.removeComponent( this.currentModal.value );
		this.currentModal.next( undefined );
	}
}
