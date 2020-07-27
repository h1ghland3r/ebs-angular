import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Person } from './../models/person';
import { PersonCreateComponent } from '../../app/persons/create/create.component';
import { PersonsService } from '../services/persons.service';
import { ConfirmationDialogComponent } from './../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {

  error: '';

  displayedColumns: string[] = ['id', 'name', 'age', 'family', 'actions'];
  dataSource  = new MatTableDataSource<Person>();

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild('table', {static: false}) table: MatTable<any>;

  constructor(
    private personsService: PersonsService,
    private readonly matDialog: MatDialog,
    private toastr: ToastrService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.personsService.getPersons()
      .subscribe(
        res => {
          const persons: any = res;
          //this.dataSource = new MatTableDataSource<Person[]>(persons);
          this.dataSource.data = persons;
          this.dataSource.paginator = this.paginator;
          // this.changeDetector.detectChanges();
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
              const newPerson: any = res;
              this.dataSource.data.push(newPerson);
              this.dataSource.data = this.dataSource.data;
            });
        }
      });
  }

  edit(person): void {

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
              this.dataSource.data = this.dataSource.data.filter((p: Person) => p.id !== person.id);
              this.table.renderRows();
            });
        }
      });
  }
}
