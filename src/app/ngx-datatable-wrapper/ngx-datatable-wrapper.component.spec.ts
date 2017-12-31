import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxDataTableWrapperComponent } from './ngx-datatable-wrapper.component';



describe('NgxDataTableWrapperComponent', () => {
  let component: NgxDataTableWrapperComponent;
  let fixture: ComponentFixture<NgxDataTableWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxDataTableWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDataTableWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
