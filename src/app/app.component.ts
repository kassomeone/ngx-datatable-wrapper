
import { SelectionType } from './../../../ngx-datatable/src/types/selection.type';
import { Component, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { count } from 'rxjs/operator/count';
import { GridOptions, DefaultGridOptionsType1 } from './ngx-datatable-wrapper/ngx-datatable-wrapper.component';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  @ViewChild('hyperLinkTemplate') hyperLinkTemplate: TemplateRef<any>;
  @ViewChild('voteTemplate') voteTemplate: TemplateRef<any>;
  constructor(private http: HttpClient) { }

  grid: GridOptions = DefaultGridOptionsType1;
  grid1: GridOptions = JSON.parse(JSON.stringify(DefaultGridOptionsType1));
  selectedRow = [];
  requestObject: RequestObject;
  showLoader = false;
  load = 0;
  ngOnInit() {

    this.grid.lazyLoad = false;

    this.grid.query = {
      id: ''
    };
    this.grid.columns = [
      { name: 'User Id', prop: 'userId', filter: 'none', width: 25, flexGrow: 5 },
      { name: 'ID', prop: 'id', filter: 'select', width: 25, cellTemplate: this.voteTemplate, flexGrow: 8 },
      { name: 'Title', prop: 'title', filter: 'select', cellTemplate: this.hyperLinkTemplate, flexGrow: 8 },
      { name: 'Body', prop: 'body', filter: 'input', cellTemplate: this.hyperLinkTemplate, flexGrow: 8 },
    ];
    this.grid.page.limit = 10;
    this.grid.page.total = 10;
    // this.grid.rows = [...[
    //   { userId: 'sadasd', id: 1, id2: 'second', title: 'REPAIR_STATUS', body: 'thanks' },
    //   { userId: 'sadasd', id: 1, id2: 'second', title: 'kashif1', body: 'thanks1' },
    //   { userId: 'sadasd', id: 3, id2: 'second', title: 'siddique', body: 'thanks2' },
    //   { userId: 'sadasd', id: 4, id2: 'second', title: 'kashif2', body: 'thanks1' },
    //   { userId: 'sadasd', id: 5, id2: 'second', title: 'kashif3', body: 'thanks2' }

    // ]];

  }

  private loadPage(query) {

    if (this.grid.page.nextPage !== (this.grid.page.total / this.grid.page.limit)) {

      this.grid.isLoading = true;
      this.grid.page.nextPage = (this.grid.rows.length + this.grid.page.limit) / this.grid.page.limit;

      this.http.get<any>('http://jsonplaceholder.typicode.com/posts?&_limit='
        + this.grid.page.limit + '&_page=' + this.grid.page.nextPage
        // + '&userId=' + query.id
      ).subscribe((results) => {

        this.grid.isLoading = false;
        this.grid.rows = [...this.grid.rows, ...results];
        this.grid.page.total = 100;
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
