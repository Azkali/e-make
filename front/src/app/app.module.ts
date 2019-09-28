import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowdownModule } from 'ngx-showdown';

import { AppRoutingModule } from '~app/app-routing.module';
import { AppComponent } from '~app/app.component';

import { CookieConsentComponent } from '~components/cookie-consent/cookie-consent.component';
import { FooterComponent } from '~components/footer/footer.component';
import { FieldComponent } from '~components/forms/field/field.component';

import { AdminComponent } from '~pages/admin/admin.component';
import { AfterLoginComponent } from '~pages/after-login/after-login.component';
import { ArticleComponent } from '~pages/blog/article/article.component';
import { BlogComponent } from '~pages/blog/blog.component';
import { ContactComponent } from '~pages/contact/contact.component';
import { IndexComponent } from '~pages/index/index.component';
import { OrderFormComponent } from '~pages/order-form/order-form.component';
import { ProductDetailsComponent } from '~pages/shop/product-details/product-details.component';
import { ProductComponent } from '~pages/shop/product/product.component';
import { ShopComponent } from '~pages/shop/shop.component';

import { CartComponent } from '~modals/cart/cart.component';
import { LoginComponent } from '~modals/login/login.component';
import { RegisterComponent } from './modals/login/register.component';
import { MenuComponent } from '~modals/menu/menu.component';
import { PagerService } from './services/pager/pager';

import { WindowRef } from '~services/window-ref/window-ref.service';
import { CartReviewComponent } from './components/cart-review/cart-review.component';
import { LegalNoticeComponent } from './components/legal-notice/legal-notice.component';

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
		CartReviewComponent,
		LegalNoticeComponent,
		RegisterComponent,

	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		FormsModule,
		AppRoutingModule,
		ShowdownModule,
		HttpClientModule,
		BrowserAnimationsModule,
		ShowdownModule.forRoot( { tables: true, tasklists: true } ),
	],
	entryComponents: [CartComponent, LoginComponent, MenuComponent, OrderFormComponent, RegisterComponent],
	providers: [WindowRef, PagerService],
	bootstrap: [AppComponent],
} )
export class AppModule { }
