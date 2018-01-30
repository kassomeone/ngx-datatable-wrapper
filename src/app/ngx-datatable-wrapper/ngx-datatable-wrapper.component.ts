

import { Component, OnInit, ViewChild, TemplateRef, Input, ElementRef, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'ngx-data-table-wrapper',
  templateUrl: './ngx-datatable-wrapper.component.html',
  styleUrls: ['./ngx-datatable-wrapper.component.css'],
})
export class NgxDataTableWrapperComponent implements OnInit, OnChanges {

  isFilterEnabled = true;
  @ViewChild('select') select: TemplateRef<any>;
  @ViewChild('input') input: TemplateRef<any>;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @Input('rows') temp: any[];
  @Input() isLoading: boolean;
  @Input() columns: any[];
  @Input() total: number;
  @Input() limit = 20;
  @Input() enableFiltering;
  @Input() enableCheckbox;
  @Input() enableRowDetail;
  @Input() lazyLoad;
  @Input() query;
  @ViewChild('detailTemplate') detailTemplate: TemplateRef<any>;
  @ViewChild('checkboxCellTemplate') checkboxCellTemplate: TemplateRef<any>;
  @Output() loadPage = new EventEmitter();
  @Output() rowSelect = new EventEmitter();

  cellTemplate: any;
  rows = [];
  scrollPosition: number;
  // temp = [];
  filtered = [];
  lastFiltered = [];
  filterEventList = [];
  count = 0;
  readonly headerHeight = 50;
  readonly rowHeight = 40;
  previousHeight = 0;

  constructor(private el: ElementRef) {
  }

  onSelect({ selected }) {
    console.log('select event', selected);
    this.rowSelect.emit(selected);
    const nodeList = document.getElementsByTagName('datatable-body');
    for (const key in nodeList) {
      if (nodeList.hasOwnProperty(key)) {
        const originalScrollPosition = nodeList[key].scrollTop;
        const positionToMove = originalScrollPosition > 0 ? originalScrollPosition - 1 : originalScrollPosition + 1;
        setTimeout(() => nodeList[key].scrollTop = positionToMove);
        setTimeout(() => nodeList[key].scrollTop = originalScrollPosition);
      }
    }
  }

  toggleFilter() {
    this.isFilterEnabled = !this.isFilterEnabled;
  }

  onScroll(offsetY: number) {
    this.scrollPosition = offsetY;
    if (!this.lazyLoad) {
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
        if (this.rows.length < this.total) {
          this.loadPage.emit(this.query);
        }

      }
    }
    this.lazyLoad = false;
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
        column.filterValue = '';
        return column.headerTemplate = this.select;
      } else if (column.filter === 'input') {
        column.filterValue = '';
        return column.headerTemplate = this.input;
      } else {
        return column;
      }
    });

    if (this.enableCheckbox) {
      this.columns.unshift({
        width: 20,
        minWidth: 20,
        cellTemplate: this.checkboxCellTemplate,
        cellClass: 'row-checkbox'
      });
      this.columns[0].flexGrow = 1;
    }

    if (this.enableRowDetail) {
      this.columns.unshift({
        width: 20,
        minWidth: 20,
        resizeable: true,
        cellTemplate: this.detailTemplate,
        cellClass: 'row-detail-button'
      });
      this.columns[0].flexGrow = 1;
    }
    this.onScroll(0);
  }

  ngOnChanges() {
    // if (this.rows.length < this.temp.length) {
    this.rows = [...this.temp];
    this.filtered = [...this.temp];
  }

  clearFilter(event, col) {
    if (this.temp.length > this.rows.length) {
      col.filterValue = '';
      this.updateFilter(null);
    }
  }


  updateFilter(event) {

    let filtered = [...this.temp];

    this.columns.forEach((column) => {

      if (column.filterValue) {

        filtered = filtered.filter((d) => {

          if (typeof d[column.prop] === 'number') {
            return d[column.prop].toString() === (column.filterValue) || !column.filterValue;
          } else {
            return d[column.prop].toLowerCase().startsWith(column.filterValue.toLowerCase()) || !column.filterValue;
          }

        });
      }
    });

    this.el.nativeElement.getElementsByTagName('datatable-body')[0].scrollTop = '0';
    this.rows = [...filtered];
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
  enableServerSideFiltering: boolean;
  lazyLoad: boolean;
  query: any;
  enableFiltering: boolean;
  page?: PageOptions;
  width?: number;
  ngxRowsUpdated?();
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
  enableServerSideFiltering: false,
  query: '',
  lazyLoad: false,
  page: {
    total: 1,
    nextPage: 0,
    limit: 40
  },
  ngxRowsUpdated() {

    const nodeList = document.getElementsByTagName('datatable-body');
    for (const key in nodeList) {
      if (nodeList.hasOwnProperty(key)) {
        const originalScrollPosition = nodeList[key].scrollTop;
        setTimeout(() => nodeList[key].scrollTop = originalScrollPosition - 1);
        setTimeout(() => nodeList[key].scrollTop = originalScrollPosition);
      }
    }
  }
};


