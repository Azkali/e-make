import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowdownModule } from 'ngx-showdown';


import { AppRoutingModule } from '~app/app-routing.module';
import { AppComponent } from '~app/app.component';

import { CookieConsentComponent } from '~components/cookie-consent/cookie-consent.component';
import { FieldComponent } from '~components/forms/field/field.component';
import { FooterComponent } from '~components/footer/footer.component';

import { AdminComponent } from '~pages/admin/admin.component';
import { AfterLoginComponent } from '~pages/after-login/after-login.component';
import { ArticleComponent } from '~pages/blog/article/article.component';
import { BlogComponent } from '~pages/blog/blog.component';
import { ContactComponent } from '~pages/contact/contact.component';
import { IndexComponent } from '~pages/index/index.component';
import { OrderFormComponent } from '~pages/order-form/order-form.component';
import { ProductComponent } from '~pages/shop/product/product.component';
import { ProductDetailsComponent } from '~pages/shop/product-details/product-details.component';
import { ShopComponent } from '~pages/shop/shop.component';

import { CartComponent } from '~modals/cart/cart.component';
import { LoginComponent } from '~modals/login/login.component';
import { MenuComponent } from '~modals/menu/menu.component';

import { WindowRef } from '~services/window-ref/window-ref.service';

@NgModule( {
	declarations: [
		AppComponent,
		AdminComponent,
		BlogComponent,
		ContactComponent,
		ShopComponent,
		ProductComponent,
		CartComponent,
		MenuComponent,
		IndexComponent,
		LoginComponent,
		BlogComponent,
		ArticleComponent,
		ProductDetailsComponent,
		CookieConsentComponent,
		AfterLoginComponent,
		FooterComponent,
		OrderFormComponent,
		FieldComponent,

	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
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
	entryComponents: [CartComponent, LoginComponent, MenuComponent],
	providers: [WindowRef],
	bootstrap: [AppComponent],
} )
export class AppModule { }
