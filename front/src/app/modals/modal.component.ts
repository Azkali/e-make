import { AnimationTriggerMetadata, style, state, trigger, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';

import { ModalService, EModalAnimation } from '~services/modal/modal.service';

export const ANIM_DURATION = '500';
export const hideShowOpacity: AnimationTriggerMetadata =
trigger( 'changeStateOpacity', [
	state( EModalAnimation.Shown, style( { opacity: 1 } ) ),
	state( EModalAnimation.Hidden, style( { opacity: 0 } ) ),

	transition( '* <=> *', animate( `${ANIM_DURATION}ms ease-in-out` ) ),
] );
export const hideShowDisplay: AnimationTriggerMetadata  =
trigger( 'changeStateDisplay', [
	state( EModalAnimation.Shown,  style( { visibility: 'visible', pointerEvents: 'all' } ) ),
	state( EModalAnimation.Hidden, style( { visibility: 'hidden', pointerEvents: 'none'  } ) ),

	transition( `${EModalAnimation.Shown} => ${EModalAnimation.Hidden}`, animate( `0ms ${ANIM_DURATION}ms ease` ) ),
	transition( `${EModalAnimation.Hidden} => ${EModalAnimation.Shown}`, animate( '0ms ease' ) ),
] );

export abstract class ModalComponent {
	protected subscriptions: Subscription[] = [];

	public constructor( protected modalService: ModalService ) {}

	public close() {
		this.subscriptions.forEach( subscription => subscription.unsubscribe() );
		this.modalService.close();
	}
}
