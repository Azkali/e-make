import { StackSubject } from 'stack-subject';
import { Injectable, ComponentRef, Type } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { DomService } from '../dom/dom.service';
import { BehaviorSubject } from 'rxjs';
import { first, filter } from 'rxjs/operators';
import { values } from 'lodash';

const BLUR_BACK_CLASS = 'blurred';

export enum EModalAnimation {
	Shown = 'shown',
	Hidden = 'hidden',
}
export interface IVisibleState {
	visibilityState: EModalAnimation;
	done: boolean;
}

@Injectable( {
	providedIn: 'root',
} )
export class ModalService {

	public constructor( private domService: DomService ) {
		// this.modalsSubject.subscribe( console.info.bind( console, 'ModalService => New modalsSubject value' ) );
		// this.modalVisibleState.subscribe( console.info.bind( console, 'ModalService => New modalVisibleState value' ) );
	}
	private modalVisibleStateSource = new BehaviorSubject<IVisibleState>( {visibilityState: EModalAnimation.Hidden, done: true} );
	public modalVisibleState = this.modalVisibleStateSource.asObservable();

	private modalsSubject = new StackSubject<ComponentRef<any>>();

	public backgroundBlurred = new BehaviorSubject( false );

	private readonly modalElemId = 'modal';

	private changeVisibilityState( newState: EModalAnimation ) {
		this.modalVisibleStateSource.next( {visibilityState: newState, done: false} );
	}

	public modalAnimDone( event: AnimationEvent ): any {
		if ( event.fromState === EModalAnimation.Shown && event.toState === EModalAnimation.Hidden ) {
			this.domService.removeComponent( this.modalsSubject.value );
			this.modalsSubject.pop();
		}
		if ( values( EModalAnimation ).indexOf( event.toState ) === -1 ) {
			throw new Error( `Invalid end state ${event.toState}` );
		}
		this.modalVisibleStateSource.next( {visibilityState: ( event.toState as EModalAnimation ), done: true} );
	}

	public open( component: Type<any> , inputs: object, outputs: object, closePrevious = 0 ) {
		if ( this.modalVisibleStateSource.value.visibilityState === EModalAnimation.Shown && this.modalVisibleStateSource.value.done ) {
			this.changeVisibilityState( EModalAnimation.Hidden );
		}
		if ( !this.modalVisibleStateSource.value.done ) {
			this.modalVisibleState
				.pipe( filter( val => val.done ), first() )
				.subscribe( () => this.open( component, inputs, outputs, closePrevious ) );
			return;
		}

		const componentConfig = {
			inputs: inputs,
			outputs: outputs,
		};

		const modalElementRef = this.domService.appendComponentTo( this.modalElemId, component, componentConfig );
		this.modalsSubject.push( modalElementRef );
		this.backgroundBlurred.next( true );
		this.changeVisibilityState( EModalAnimation.Shown );
	}

	public close() {
		this.backgroundBlurred.next( false );
		this.changeVisibilityState( EModalAnimation.Hidden );
		this.modalVisibleStateSource
			.pipe( filter( vs => vs.visibilityState === EModalAnimation.Hidden && vs.done ), first() )
			.subscribe( () => this.modalsSubject.pop( this.modalsSubject.length ) );
	}
}
