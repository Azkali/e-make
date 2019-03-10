import { AnimationEvent } from '@angular/animations';
import { ComponentRef, Injectable, Type } from '@angular/core';
import { values } from 'lodash';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { StackSubject } from 'stack-subject';
import { DomService } from '../dom/dom.service';

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
	public constructor( private readonly domService: DomService ) {}
	private readonly modalVisibleStateSource = new BehaviorSubject<IVisibleState>( { visibilityState: EModalAnimation.Hidden, done: true } );
	public modalVisibleState = this.modalVisibleStateSource.asObservable();

	private readonly modalsSubject = new StackSubject<ComponentRef<any>>();

	public backgroundBlurred = new BehaviorSubject( false );

	private readonly modalElemId = 'modal';

	private changeVisibilityState( newState: EModalAnimation, immediate = false ) {
		this.modalVisibleStateSource.next( { visibilityState: newState, done: immediate } );
	}

	public modalAnimDone( event: AnimationEvent ) {
		if ( event.fromState === EModalAnimation.Shown && event.toState === EModalAnimation.Hidden && this.modalsSubject.value ) {
			this.domService.removeComponent( this.modalsSubject.value );
			this.modalsSubject.pop();
		}
		if ( values( EModalAnimation ).indexOf( event.toState ) === -1 ) {
			throw new Error( `Invalid end state ${event.toState}` );
		}
		this.modalVisibleStateSource.next( { visibilityState: ( event.toState as EModalAnimation ), done: true } );
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
			inputs,
			outputs,
		};

		const modalElementRef = this.domService.appendComponentTo( this.modalElemId, component, componentConfig );
		this.modalsSubject.push( modalElementRef );
		this.backgroundBlurred.next( true );
		this.changeVisibilityState( EModalAnimation.Shown, immediate );
		return this.modalVisibleState
			.pipe(
				filter( visibleState => visibleState.done ),
				switchMap( () => of<void>() ) );
	}

	public close() {
		this.backgroundBlurred.next( false );
		this.changeVisibilityState( EModalAnimation.Hidden );
		this.modalVisibleStateSource
			.pipe( filter( vs => vs.visibilityState === EModalAnimation.Hidden && vs.done ), first() )
			.subscribe( () => this.modalsSubject.pop( this.modalsSubject.length ) );
	}
}
