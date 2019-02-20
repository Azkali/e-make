import { ProductDetailsComponent } from './pages/shop/product-details/product-details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '~environments/environment';

import { AfterLoginComponent } from '~pages/after-login/after-login.component';
import { BlogComponent } from '~pages/blog/blog.component';
import { ContactComponent } from '~pages/contact/contact.component';
import { IndexComponent } from '~pages/index/index.component';
import { OrderFormComponent } from '~pages/order-form/order-form.component';
import { ShopComponent } from '~pages/shop/shop.component';
import { LoggedInGuard } from '~guards/logged-in/logged-in.guard';

const routes: Routes = [
	{ path: '', redirectTo: '/index', pathMatch: 'full' },
	{ path: 'index', component: IndexComponent },
	{ path: 'blog', component: BlogComponent },
	{ path: 'shop', component: ShopComponent, data: {classes: 'style2', styles: {backgroundColor: '#8d82c4'} } },
	{ path: 'shop/:identifier', component: ProductDetailsComponent, data: {classes: 'style5', styles: {backgroundColor: '#8ea9e8'}}},
	{ path: 'contact', component: ContactComponent },
	{ path: 'order', component: OrderFormComponent, canActivate: [LoggedInGuard] },
	{ path: environment.common.front.afterAuthRoute, component: AfterLoginComponent },
];

@NgModule( {
	imports: [RouterModule.forRoot( routes )],
	exports: [RouterModule],
} )
export class AppRoutingModule { }
