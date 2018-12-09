import { Observable } from 'rxjs/Observable';
import { ShoppingCart } from '../models/shopping-cart';
import { IProduct } from '../models/product';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { DataManagerService } from './data-manager.service';

@Injectable()
export class ShoppingCartService {

    constructor(private db: DataManagerService) { console.log(this.db.findItems()) }

/*    async addToCart(product: IProduct) {
        this.updateItemQty(product, 1);
    }

    async removeFromCart(product: IProduct) {
        this.updateItemQty(product, -1);
    }

    async getCart(): Promise<Observable><ShoppingCart>> {
        let cartId = await this.getOrCreateId();
        // return this.db.object('/shopping-cart' + cartId)
        //    .map(cart => new ShoppingCart(cart.items));
    }

    async clearAllCart() {
        let cartId = await this getOrCreateCartId();
        // return this.db.object('/shopping-cart/' + cartId).remove();
    }
*/
    
}