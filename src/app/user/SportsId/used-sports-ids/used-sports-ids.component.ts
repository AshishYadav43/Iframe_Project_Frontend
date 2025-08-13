import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { AuthService } from '../../../core/services/auth.service';
import { CamelCaseToWordsPipe } from '../../../core/pipe/camel-case-to-words.pipe';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-used-sports-ids',
  imports: [MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    CamelCaseToWordsPipe,
    TitleCasePipe
  ],
  templateUrl: './used-sports-ids.component.html',
  styleUrl: './used-sports-ids.component.css'
})


export class UsedSportsIdsComponent {
  dataList = new MatTableDataSource<any>();
  displayedColumns: string[] = ['srNo', 'module_name', 'from', 'to'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  public api = inject(AuthService);

  ngAfterViewInit() {
  this.dataList.paginator = this.paginator;
  this.dataList.sort = this.sort;
}

  ngOnInit() {
    
    this.getAllData();
  }

  getAllData() {
    this.api.getAllUsedIds().subscribe({
      next: (res: any) => {
        
        this.dataList = res.data || [];        
      }
    });
  }
}
