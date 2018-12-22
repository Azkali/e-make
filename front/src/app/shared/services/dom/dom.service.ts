import {
	Injectable, Injector, ComponentFactoryResolver,
	EmbeddedViewRef, ApplicationRef
} from '@angular/core';

@Injectable( {
	providedIn: 'root',
} )
export class DomService {

	private childComponentRef: any;
	public constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private appRef: ApplicationRef,
		private injector: Injector
	) { }

	public appendComponentTo( parentId: string, child: any, childConfig?: IChildConfig ) {
		const childComponentRef = this.componentFactoryResolver
			.resolveComponentFactory( child )
			.create( this.injector );

		this.attachConfig( childConfig, childComponentRef );

		this.childComponentRef = childComponentRef;

		this.appRef.attachView( childComponentRef.hostView );

		const childDomElem = ( childComponentRef.hostView as EmbeddedViewRef<any> )
			.rootNodes[0] as HTMLElement;

		document.getElementById( parentId ).appendChild( childDomElem );
	}

	public removeComponent() {
		this.appRef.detachView( this.childComponentRef.hostView );
		this.childComponentRef.destroy();
	}

	private attachConfig( config, componentRef ) {
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
