import { BehaviorSubject } from 'rxjs';
import { Component } from '@angular/core';
import { ShopService } from './shared/services/shop.service';
import { ICart } from '../../../cross/models/cart';
import { skip } from 'rxjs/operators';

@Component( {
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
} )
export class AppComponent {
	public title = 'app';

	public cartFlash = false;
	public cartInfos: BehaviorSubject<ICart>;

	public constructor( private shopService: ShopService ) {
		this.cartInfos = this.shopService.currentCart;
		this.cartInfos.pipe( skip( 1 ) ).subscribe( newCart => {
			this.cartFlash = true;
			setTimeout( () => this.cartFlash = false, 500 );
		} );
	}
}
