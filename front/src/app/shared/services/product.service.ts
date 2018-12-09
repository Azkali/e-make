import { Injectable } from '@angular/core';
import { DataManagerService } from './data-manager.service';

@Injectable()
export class ProductService {

  constructor(private db: DataManagerService) { }

}