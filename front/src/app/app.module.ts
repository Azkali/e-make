import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AdminComponent } from './pages/admin/admin.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ShopComponent } from './pages/shop/shop.component';
import { CartComponent } from './pages/shop/cart/cart.component';
import { ProductComponent } from './pages/shop/products/product.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/login/login.component';

@NgModule( {
	declarations: [
		AppComponent,
		AdminComponent,
		BlogComponent,
		ContactComponent,
		ShopComponent,
		CartComponent,
		ProductComponent,
		NavbarComponent,
		IndexComponent,
		LoginComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		
	],
	providers: [],
	bootstrap: [AppComponent],
} )
export class AppModule { }
