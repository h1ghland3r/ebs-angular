import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Family } from './../models/families';
import { User } from '../models/user';
import { AuthService } from './../services/auth.service';
import { FamiliesService } from './../services/families.service';
import { FamilyCreateComponent } from './create/create.component';
import { ConfirmationDialogComponent } from './../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-families',
  templateUrl: './families.component.html',
  styleUrls: ['./families.component.scss']
})
export class FamiliesComponent implements OnInit {

  error: '';
  isAdmin = false;

  displayedColumns: string[] = ['id', 'name', 'max_persons', 'actions'];
  dataSource  = new MatTableDataSource<Family>();

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild('table', {static: false}) table: MatTable<any>;

  constructor(
    private familiesService: FamiliesService,
    private authService: AuthService,
    private readonly matDialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.list();
  }

  getCurrentUser(): void {
    this.authService.currentUser
      .subscribe((user: User) => {
        if (user.person_role === 'admin') {
          this.isAdmin = true;
        }
      });
  }

  list(): void {
    this.familiesService.getFamilies()
      .subscribe(
        res => {
          console.log(res);
          this.dataSource.data = res;
          this.dataSource.paginator = this.paginator;
        },
        error => {
          this.error = error;
          this.toastr.error(this.error, '', {
            positionClass: 'toast-top-center'
          });
        });
  }

  create(): void {
    this.matDialog
      .open(FamilyCreateComponent, {
        panelClass: 'mat-dialog-fixed-width',
        width: '100vw'
      })
      .afterClosed().subscribe((family: Family) => {
        if (!!family) {
          this.toastr.success('Family created', '', {
            positionClass: 'toast-top-center'
          });
          this.familiesService.getFamily(family.id)
            .subscribe(res => {
              this.dataSource.data.push(res);
              this.dataSource.data = this.dataSource.data;
            });
        }
      });
  }
}
