import { ProductDetailsComponent } from './pages/shop/product-details/product-details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './pages/index/index.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CartComponent } from './pages/shop/cart/cart.component';
import { ShopComponent } from './pages/shop/shop.component';
import { BlogComponent } from './pages/blog/blog.component';

const routes: Routes = [
	{ path: '', redirectTo: '/index', pathMatch: 'full' },
	{ path: 'index', component: IndexComponent },
	{ path: 'blog', component: BlogComponent },
	{ path: 'shop', component: ShopComponent, data: {classes: 'style2', styles: {backgroundColor: '#8d82c4'} } },
	{ path: 'shop/:identifier', component: ProductDetailsComponent, data: {classes: 'style5', styles: {backgroundColor: '#8ea9e8'}}},
	{ path: 'contact', component: ContactComponent },
	{ path: 'cart', component: CartComponent },
];

@NgModule( {
	imports: [RouterModule.forRoot( routes )],
	exports: [RouterModule],
} )
export class AppRoutingModule { }
