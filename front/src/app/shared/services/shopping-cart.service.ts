import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { ShopService } from './shop.service';

@Injectable()
export class ShoppingCartService {

	public constructor( private db: ShopService ) {}
}
