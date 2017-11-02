import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
  
  it('contain a function called isAuthenticated',inject([AuthService], (service: AuthService) => {
    expect(service.isAuthenticated).toBeDefined();
  }));
  
  it('isAuthenticated function should always return true',inject([AuthService], (service: AuthService) => {
    expect(service.isAuthenticated()).toBeTruthy();
  }));
});
