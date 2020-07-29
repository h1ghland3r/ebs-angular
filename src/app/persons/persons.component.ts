import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Person } from './../models/person';
import { User } from '../models/user';
import { PersonsService } from '../services/persons.service';
import { AuthService } from './../services/auth.service';
import { PersonCreateComponent } from '../../app/persons/create/create.component';
import { PersonEditComponent } from '../../app/persons/edit/edit.component';
import { ConfirmationDialogComponent } from './../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {

  error: '';
  isAdmin = false;

  displayedColumns: string[] = ['id', 'name', 'age', 'family', 'actions'];
  dataSource  = new MatTableDataSource<Person>();

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild('table', {static: false}) table: MatTable<any>;

  constructor(
    private personsService: PersonsService,
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
    this.personsService.getPersons()
      .subscribe(
        res => {
          const persons: any = res;
          this.dataSource.data = persons;
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
      .open(PersonCreateComponent, {
        panelClass: 'mat-dialog-fixed-width'
      })
      .afterClosed().subscribe((person: Person) => {
        if (!!person) {
          this.toastr.success('Person created', '', {
            positionClass: 'toast-top-center'
          });
          this.personsService.getPerson(person.id)
            .subscribe(res => {
              this.dataSource.data.push(res);
              this.dataSource.data = this.dataSource.data;
            });
        }
      });
  }

  edit(person): void {
    this.matDialog
      .open(PersonEditComponent, {
        panelClass: 'mat-dialog-fixed-width',
        data: person
      })
      .afterClosed().subscribe((p: Person) => {
        if (!!p) {
          this.toastr.success('Person updated', '', {
            positionClass: 'toast-top-center'
          });
          this.personsService.getPerson(p.id)
            .subscribe(res => {
              const index = this.dataSource.data.findIndex(res => res.id === person.id);
              if (index > -1) {
                this.dataSource.data[index] = res;
                this.dataSource.data = this.dataSource.data;
                this.table.renderRows();
              }
            });
        }
      });
  }

  delete(person): void {
    const dialogRef = this.matDialog
      .open(ConfirmationDialogComponent, {
        width: '350px',
        data: person,
      })
      .afterClosed().subscribe(result => {
        if (result === 'Confirm') {
          this.personsService.deletePerson(person.id)
            .subscribe(res => {
              this.toastr.success('Person deleted', '', {
                positionClass: 'toast-top-center'
              });
              this.dataSource.data = this.dataSource.data.filter(res => res.id !== person.id);
              this.table.renderRows();
            });
        }
      });
  }
}
