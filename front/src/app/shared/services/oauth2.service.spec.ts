import { TestBed, inject } from '@angular/core/testing';

import { OAuth2Service } from './oauth2.service';

describe('OAuth2Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OAuth2Service]
    });
  });

  it('should be created', inject([OAuth2Service], (service: OAuth2Service) => {
    expect(service).toBeTruthy();
  }));
});
