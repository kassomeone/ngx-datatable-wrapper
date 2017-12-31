import { TestBed, inject } from '@angular/core/testing';
import { NgxDataTableWrapperService } from './ngx-datatable-wrapper.service';



describe('NgxDataTableWrapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxDataTableWrapperService]
    });
  });

  it('should be created', inject([NgxDataTableWrapperService], (service: NgxDataTableWrapperService) => {
    expect(service).toBeTruthy();
  }));
});
