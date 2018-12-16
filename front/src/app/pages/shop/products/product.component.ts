import { Component, OnInit, Input } from '@angular/core';
import { IProduct } from '../../../../../../cross/models/product';

@Component( {
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.css'],
} )
export class ProductComponent implements OnInit, IProduct {
	@Input() public name: string;
	@Input() public images: string[];

	public constructor() { }
	
	public ngOnInit() {
	}
	
}
