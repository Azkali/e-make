import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowdownModule } from 'ngx-showdown';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AdminComponent } from './pages/admin/admin.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ShopComponent } from './pages/shop/shop.component';
import { CartComponent } from './pages/shop/cart/cart.component';
import { ProductComponent } from './pages/shop/product/product.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/login/login.component';
import { MarkdownScrapperComponent } from './pages/markdown-scrapper/markdown-scrapper.component';
import { ArticleComponent } from './pages/markdown-scrapper/article/article.component';
import { ProductDetailsComponent } from './pages/shop/product-details/product-details.component';

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
		MarkdownScrapperComponent,
		ArticleComponent,
		ProductDetailsComponent,
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
	entryComponents: [CartComponent],
	providers: [],
	bootstrap: [AppComponent],
} )
export class AppModule { }
