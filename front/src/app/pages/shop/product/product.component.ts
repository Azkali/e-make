import { Component, OnInit, Input } from '@angular/core';

import { IProductViewModel } from '~services/shop/shop.service';

@Component( {
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.css'],
} )
export class ProductComponent implements OnInit {
	@Input() public product: IProductViewModel;

	public constructor() { }

	public ngOnInit() {
	}

}
