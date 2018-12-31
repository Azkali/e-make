import {
	Injectable, Injector, ComponentFactoryResolver,
	EmbeddedViewRef, ApplicationRef, Type, ComponentRef, Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable( {
	providedIn: 'root',
} )
export class DomService {
	private managedComponentRefs: Array<ComponentRef<any>> = [];

	public constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private appRef: ApplicationRef,
		private injector: Injector,
		@Inject( DOCUMENT ) private document: Document
	) { }

	public appendComponentTo<T>( parentId: string, child: Type<T>, childConfig?: IChildConfig ) {
		const childComponentRef = this.componentFactoryResolver
			.resolveComponentFactory( child )
			.create( this.injector );

		this.attachConfig<T>( childConfig, childComponentRef );

		this.managedComponentRefs.push( childComponentRef );

		this.appRef.attachView( childComponentRef.hostView );

		const childDomElem = ( childComponentRef.hostView as EmbeddedViewRef<any> )
			.rootNodes[0] as HTMLElement;

		this.document.getElementById( parentId ).appendChild( childDomElem );
		return childComponentRef;
	}

	public removeComponent<T>( componentRef: ComponentRef<T> ) {
		if ( this.managedComponentRefs.indexOf( componentRef ) === -1 ) {
			throw new Error( 'Unable to remove unmanaged component' );
		}
		this.appRef.detachView( componentRef.hostView );
		componentRef.destroy();
		this.managedComponentRefs = this.managedComponentRefs.filter( item => item !== componentRef );
	}

	private attachConfig<T>( config: IChildConfig, componentRef: ComponentRef<T> ) {
		const inputs = config.inputs;
		const outputs = config.outputs;
		for ( const key in inputs ) {
			if ( inputs.hasOwnProperty( key ) ) {

				componentRef.instance[key] = inputs[key];
			}
		}

		for ( const key in outputs ) {
			if ( inputs.hasOwnProperty( key ) ) {
				componentRef.instance[key] = outputs[key];
			}
		}
	}
}

interface IChildConfig {
	inputs: object;
	outputs: object;
}
