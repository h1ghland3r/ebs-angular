import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonsService } from './../../services/persons.service';
import { Person } from 'src/app/models/person';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-person-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class PersonEditComponent implements OnInit {

  isSubmitted = false;
  selected = 'normal';
  error = '';

  editForm = this.fb.group({
    username: [null, Validators.required],
    password: [null, Validators.required],
    name: [null],
    age: [null, Validators.pattern('^\\d+(\\.\\d+)?$')],
    family: [null, Validators.pattern('^\\d+(\\.\\d+)?$')],
    role: [null],
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PersonEditComponent>,
    private personService: PersonsService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public person: Person
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.editForm.patchValue(this.person);
    this.editForm.get('username').disable();
  }

  edit(): void {
    if (this.editForm.invalid) {
      return;
    }

    const person: Person = {
      id: this.person.id,
      username: this.editForm.get('username').value,
      password: this.editForm.get('password').value,
      name: this.editForm.get('name').value,
      age: this.editForm.get('age').value,
      family: this.editForm.get('family').value,
      role: this.editForm.get('role').value
    };

    this.personService.updatePerson(person)
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

  cancel(): void {
    this.dialogRef.close(false);
  }


  isInvalid(field: string) {
    return (
      (!this.editForm.get(field).valid && this.editForm.get(field).touched) ||
      (this.editForm.get(field).untouched && this.isSubmitted)
    );
  }

}
