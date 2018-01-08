import { NgxDataTableWrapperComponent } from './ngx-datatable-wrapper/ngx-datatable-wrapper.component';
import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppComponent } from './app.component';
import { UniquePipe } from './unique.pipe';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';

enableProdMode();
@NgModule({
  declarations: [AppComponent, UniquePipe, NgxDataTableWrapperComponent],
  imports: [
    BrowserModule,
    NgxDatatableModule,
    FormsModule,
    HttpModule,
    TabsModule.forRoot(), AccordionModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

