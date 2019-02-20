import { StackSubject } from 'stack-subject';
import { Injectable, ComponentRef, Type, ChangeDetectorRef } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { DomService } from '../dom/dom.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, filter, switchMap } from 'rxjs/operators';
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
	public constructor( private domService: DomService ) {}
	private modalVisibleStateSource = new BehaviorSubject<IVisibleState>( {visibilityState: EModalAnimation.Hidden, done: true} );
	public modalVisibleState = this.modalVisibleStateSource.asObservable();

	private modalsSubject = new StackSubject<ComponentRef<any>>();

	public backgroundBlurred = new BehaviorSubject( false );

	private readonly modalElemId = 'modal';

	private changeVisibilityState( newState: EModalAnimation, immediate = false ) {
		this.modalVisibleStateSource.next( {visibilityState: newState, done: immediate} );
	}

	public modalAnimDone( event: AnimationEvent ) {
		if ( event.fromState === EModalAnimation.Shown && event.toState === EModalAnimation.Hidden && this.modalsSubject.value ) {
			this.domService.removeComponent( this.modalsSubject.value );
			this.modalsSubject.pop();
		}
		if ( values( EModalAnimation ).indexOf( event.toState ) === -1 ) {
			throw new Error( `Invalid end state ${event.toState}` );
		}
		this.modalVisibleStateSource.next( {visibilityState: ( event.toState as EModalAnimation ), done: true} );
	}

	public open( component: Type<any> , inputs: object = {}, outputs: object = {}, closePrevious = 0, immediate = false ): Observable<void> {
		if ( this.modalVisibleStateSource.value.visibilityState === EModalAnimation.Shown ) {
			this.changeVisibilityState( EModalAnimation.Hidden );
		}
		if ( !this.modalVisibleStateSource.value.done ) {
			return this.modalVisibleState
				.pipe(
					filter( val => val.done ),
					first(),
					switchMap( () => this.open( component, inputs, outputs, closePrevious ) ) );
		}

		const componentConfig = {
			inputs: inputs,
			outputs: outputs,
		};

		const modalElementRef = this.domService.appendComponentTo( this.modalElemId, component, componentConfig );
		this.modalsSubject.push( modalElementRef );
		this.backgroundBlurred.next( true );
		this.changeVisibilityState( EModalAnimation.Shown, immediate );
		return this.modalVisibleState
			.pipe(
				filter( visibleState => visibleState.done ),
				switchMap( () => of() )
			);
	}

	public close() {
		this.backgroundBlurred.next( false );
		this.changeVisibilityState( EModalAnimation.Hidden );
		this.modalVisibleStateSource
			.pipe( filter( vs => vs.visibilityState === EModalAnimation.Hidden && vs.done ), first() )
			.subscribe( () => this.modalsSubject.pop( this.modalsSubject.length ) );
	}
}
