import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Family } from './../../models/families';
import { PersonsService } from 'src/app/services/persons.service';
import { FamiliesService } from 'src/app/services/families.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class FamilyCreateComponent implements OnInit {

  isLinear = true;
  error = '';
  counter = 0;

  createForm = this.fb.group({
    name: [null, Validators.required],
    max_persons: [null, Validators.required],
    persons: [null]
  });

  available = [];
  chosen = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FamilyCreateComponent>,
    private toastr: ToastrService,
    private personsService: PersonsService,
    private familiesService: FamiliesService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getPersonsNotInFamilies();
  }

  getPersonsNotInFamilies(): void {
    this.personsService.getPersons()
    .subscribe(res => {
      res.forEach(p => {
        if (!!p) {
          if (p.family === 0 || p.family === null) {
            this.available.push(p);
          }
        }
      });
    });
  }

  save(): void {
    const maxPersons = this.createForm.get('max_persons').value;
    if (this.chosen.length > maxPersons) {
      this.toastr.warning('Number of chosen members above the family limit', '', {
        positionClass: 'toast-top-center'
      });
      return;
    } else {
      this.createForm.get('persons').setValue(this.chosen);

      if (this.createForm.invalid) {
        return;
      }

      const family: Family = {
        id: null,
        name: this.createForm.get('name').value,
        max_persons: this.createForm.get('max_persons').value,
        persons: this.createForm.get('persons').value
      };

      this.familiesService.createFamily(family)
      .subscribe(
        res => {
          this.dialogRef.close(res);
        },
        error => {
          this.error = error;
          this.toastr.error(this.error, '', {
            positionClass: 'toast-top-center'
         });
        });
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  isInvalid(field: string) {
    return (
      (!this.createForm.get(field).valid && this.createForm.get(field).touched) ||
      (this.createForm.get(field).untouched)
    );
  }

  drop(event: CdkDragDrop<string[]>): void {
    const maxPersons = this.createForm.get('max_persons').value;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.previousContainer.data === this.available) {
        if (this.chosen.length >= maxPersons) {
          this.toastr.warning('You have reached the family limit', '', {
            positionClass: 'toast-top-center'
         });
          return;
         }
      }
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
}
