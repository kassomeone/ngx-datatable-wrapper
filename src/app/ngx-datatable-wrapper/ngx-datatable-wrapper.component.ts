

import { Component, OnInit, ViewChild, TemplateRef, Input, ElementRef, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-ngx-data-table',
  templateUrl: './ngx-datatable-wrapper.component.html',
  styleUrls: ['./ngx-datatable-wrapper.component.css'],
})
export class NgxDataTableWrapperComponent implements OnInit, OnChanges {
  isFilterEnabled = true;

  @ViewChild('select') select: TemplateRef<any>;
  @ViewChild('input') input: TemplateRef<any>;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  cellTemplate: any;
  @Input('rows') temp: any[];
  @Input() isLoading: boolean;
  @Input() columns: any[];
  @Input() total: number;
  @Input() limit = 20;
  @Input() enableFiltering;
  @Input() enableCheckbox;
  @Input() enableRowDetail;
  @ViewChild('detailTemplate') detailTemplate: TemplateRef<any>;
  @ViewChild('checkboxCellTemplate') checkboxCellTemplate: TemplateRef<any>;
  @Output() loadPage = new EventEmitter();
  @Output() rowSelect = new EventEmitter();
  rows = [];
  // temp = [];
  filtered = [];
  lastFiltered = [];
  filterEventList = [];
  count = 0;
  readonly headerHeight = 50;
  readonly rowHeight = 50;
  previousHeight = 0;

  constructor(private el: ElementRef) {
  }

  onSelect({ selected }) {
    console.log('select event', selected);
    this.rowSelect.emit(selected);
  }

  toggleFilter() {
    this.isFilterEnabled = !this.isFilterEnabled;
  }
  onScroll(offsetY: number) {

    // total height of all rows in the viewport
    const viewHeight = this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;
    // console.log(viewHeight);
    // check if we scrolled to the end of the viewport
    if (!this.isLoading && (offsetY + viewHeight) + 250 >= this.rows.length * this.rowHeight) {

      // total number of results to load
      let limit = this.limit;

      // check if we haven't fetched any results yet
      if (this.rows.length === 0) {

        // calculate the number of rows that fit within viewport
        const pageSize = Math.ceil(viewHeight / this.rowHeight);

        // change the limit to pageSize such that we fill the first page entirely
        // (otherwise, we won't be able to scroll past it)
        limit = Math.max(pageSize, this.limit);
      }
      this.loadPage.emit(offsetY);

    }
  }

  ngOnInit() {

    setTimeout(() => {
      this.toggleFilter();
    }, 0);
    this.rows = [...this.temp];
    this.filtered = [...this.temp];

    // this.filtered = [...this.temp];

    this.columns.map((column) => {
      column.sortable = true;
      if (column.filter === 'select') {
        return column.headerTemplate = this.select;
      } else if (column.filter === 'input') {
        return column.headerTemplate = this.input;
      } else {
        return column;
      }

    });

    if (this.enableCheckbox) {

      this.columns.unshift({
        width: 20,
        minWidth: 20,
        cellTemplate: this.checkboxCellTemplate
      });
    }

    if (this.enableRowDetail) {
      this.columns.unshift({
        width: 20,
        minWidth: 20,
        resizeable: true,
        cellTemplate: this.detailTemplate
      });
    }



    console.log(this.columns);
    this.onScroll(0);
  }

  ngOnChanges() {
    // if (this.rows.length < this.temp.length) {
    this.rows = [...this.temp];
    this.filtered = [...this.temp];
    // this.el.nativeElement.getElementsByTagName('datatable-body')[0].style.height = '149px';
    // setTimeout(() => {
    //   this.el.nativeElement.getElementsByTagName('datatable-body')[0].style.height = '150px';
    // }, 500);
    console.log(this.rows.length);
    // }
  }

  clearFilter(event, column) {

    this.filtered = [...this.temp];
    this.rows = [...this.filtered];

    this.columns.map((_column) => {
      if (_column.target && _column.name !== column.name && _column.target.value.length > 0) {
        this.updateFilter(null, _column);
      }
      if (_column.target && _column.name === column.name) {
        _column.target.value = '';
      }
    });

  }

  updateFilter(event, column) {

    let val;
    if (event) {

      val = event.target.value.toLowerCase();

      this.columns.map((value) => {
        if (value.name === column.name) {
          value.target = event.target;
        }
      });

    } else {
      val = column.target.value.toLowerCase();
    }


    if (val.length === 0) {
      this.clearFilter(event, column);
      return true;
    }

    this.filtered = this.filtered.filter(function (d) {

      if (typeof d[column.name] === 'number') {
        return d[column.name].toString() === (val) || !val;
      } else {
        return d[column.name].toLowerCase().startsWith(val) || !val;
      }
    });
    this.el.nativeElement.getElementsByTagName('datatable-body')[0].scrollTop = '0';
    this.rows = this.filtered;
    this.table.offset = 0;
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    console.log(this.columns);
    this.table.rowDetail.toggleExpandRow(row);
  }

}


export interface GridOptions {
  rows: any;
  columns: any;
  isLoading: boolean;
  enableFiltering: boolean;
  page?: PageOptions;
  width?: number;
}

export interface PageOptions {
  total: number;
  nextPage: number;
  limit: number;
}

export const DefaultGridOptionsType1: GridOptions = {

  rows: [],
  columns: [],
  isLoading: false,
  enableFiltering: true,
  page: {
    total: 1,
    nextPage: 0,
    limit: 40
  }

};


