import { Injectable, ElementRef } from '@angular/core';

// Grid per 'grid-layout-component', not a global service
@Injectable()
export class GridLayoutService {
  _el: ElementRef;
  // CCS Properties to set
  // --grid-columns: 2;
  _columns = 2;
  // --grid-rows: 2;
  _rows = 2;
  // --grid-row-height: 20em;
  _rowHeight = 20;
  // --grid-row-gap: 10px;
  _rowGap = 10;
  // --grid-column-gap: 10px;
  _columnGap = 10;

  _minColumns = 0;
  _minRows = 0;

  get columns() {
    return this._columns;
  }

  get rows() {
    return this._rows;
  }

  setElementRef(el: ElementRef) {
    this._el = el;
  }

  addColumn() {
    const col = this._columns + 1;
    this.setColumns(col);
  }

  removeColumn() {
    const col = this._columns - 1;
    this.setColumns(col);
  }

  addRow() {
    const row = this._rows + 1;
    this.setRows(row);
  }

  removeRow() {
    const row = this._rows - 1;
    this.setRows(row);
  }

  setMinColumns(min: number) {
    this._minColumns = min;
    this.setColumns(min);
  }

  setMinRows(min: number) {
    this._minRows = min;
    this.setRows(min);
  }

  setColumns(columns: number) {
    if (columns !== this._columns && columns >= this._minColumns) {
      this._columns = columns;
      this.setProperty('--grid-columns', columns.toString());
    }
  }

  setRows(rows: number) {
    if (rows !== this._rows && rows >= this._minRows) {
      this._rows = rows;
      this.setProperty('--grid-rows', rows.toString());
    }
  }

  setRowHeight(height: number) {
    this._rowHeight = height;
    this.setProperty('--grid-row-height', height + 'em');
  }

  setRowGap(gap: number) {
    this._rowGap = gap;
    this.setProperty('--grid-row-gap', gap + 'px');
  }

  setColumnGap(gap: number) {
    this._columnGap = gap;
    this.setProperty('--grid-column-gap', gap + 'px');
  }

  setProperty(property: string, value: string) {
    if (this._el) {
      this._el.nativeElement.style.setProperty(property, value);
    }
  }
}
