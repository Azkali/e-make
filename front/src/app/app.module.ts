import { ModalService } from './shared/services/modal/modal.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { ShowdownModule } from 'ngx-showdown';

import { AppComponent } from './app.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ShopComponent } from './pages/shop/shop.component';
import { CartComponent } from './pages/shop/cart/cart.component';
import { ProductComponent } from './pages/shop/product/product.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/login/login.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ArticleComponent } from './pages/blog/article/article.component';
import { ProductDetailsComponent } from './pages/shop/product-details/product-details.component';
import { ShopService } from './shared/services/shop/shop.service';
import { WindowRef } from './shared/window-ref/window-ref.service';
import { AfterLoginComponent } from './pages/after-login/after-login.component';

@NgModule( {
	declarations: [
		AppComponent,
		AdminComponent,
		BlogComponent,
		ContactComponent,
		ShopComponent,
		ProductComponent,
		CartComponent,
		NavbarComponent,
		IndexComponent,
		LoginComponent,
		BlogComponent,
		ArticleComponent,
		ProductDetailsComponent,
		CookieConsentComponent,
		AfterLoginComponent,

	],
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		ShowdownModule,
		HttpClientModule,
		MatSidenavModule,
		BrowserAnimationsModule,
		MatDialogModule,
		NgbModule.forRoot(),
		ShowdownModule.forRoot( { tables: true, tasklists: true } ),
	],
	entryComponents: [CartComponent, LoginComponent, NavbarComponent],
	providers: [WindowRef],
	bootstrap: [AppComponent],
} )
export class AppModule { }
