
import { SelectionType } from './../../../ngx-datatable/src/types/selection.type';
import { Component, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { count } from 'rxjs/operator/count';
import { GridOptions, DefaultGridOptionsType1 } from './ngx-datatable-wrapper/ngx-datatable-wrapper.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  @ViewChild('hyperLinkTemplate') hyperLinkTemplate: TemplateRef<any>;
  constructor(private http: Http) { }

  grid: GridOptions = DefaultGridOptionsType1;
  grid1: GridOptions = JSON.parse(JSON.stringify(DefaultGridOptionsType1));
  selectedRow = [];
  requestObject: RequestObject;

  ngOnInit() {

    this.grid.lazyLoad = false;
    this.grid.query = {
      id: ''
    };
    this.grid.columns = [
      { name: 'userId', filter: 'none', width: 25 },
      { name: 'id', filter: 'select', width: 25 },
      { name: 'title', filter: 'input', cellTemplate: this.hyperLinkTemplate },
      { name: 'body', filter: 'input', cellTemplate: this.hyperLinkTemplate },
    ];
    this.grid.page.limit = 10;

  }

  private loadPage(query) {

    if (this.grid.page.nextPage !== (this.grid.page.total / this.grid.page.limit)) {

      this.grid.isLoading = true;
      this.grid.page.nextPage = (this.grid.rows.length + this.grid.page.limit) / this.grid.page.limit;

      this.http.get('http://jsonplaceholder.typicode.com/posts?&_limit='
        + this.grid.page.limit + '&_page=' + this.grid.page.nextPage
        // + '&userId=' + query.id
      )
        .subscribe((results) => {

          this.grid.isLoading = false;
          this.grid.rows = [...this.grid.rows, ...results.json()];
          this.grid.page.total = Number(results.headers.get('x-total-count'));
          this.grid.ngxRowsUpdated();

        });
    }
  }


  private lazyLoad() {

    this.grid.rows = [];
    this.loadPage(this.grid.query);

  }

  fetchData(row) {
    row.body = 'Hello'
    alert(JSON.stringify(row));
    return false;
  }

  private rowSelect(selection) {
    this.selectedRow = [...selection];
  }

}


export class RequestObject {
  request: any;
}
