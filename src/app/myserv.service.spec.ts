import { TestBed } from '@angular/core/testing';

import { MyservService } from './myserv.service';

describe('MyservService', () => {
  let service: MyservService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyservService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
