import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PersonsService } from './../../services/persons.service';
import { Person } from 'src/app/models/person';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-person-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class PersonCreateComponent implements OnInit {

  isSubmitted = false;
  selected = 'normal';
  error = '';

  createForm = this.fb.group({
    username: [null, Validators.required],
    password: [null, Validators.required],
    name: [null],
    age: [null, Validators.pattern('^\\d+(\\.\\d+)?$')],
    family: [null, Validators.pattern('^\\d+(\\.\\d+)?$')],
    role: [null],
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PersonCreateComponent>,
    private personService: PersonsService,
    private toastr: ToastrService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.createForm.get('role').setValue(this.selected);
  }

  create(): void {
    if (this.createForm.invalid) {
      return;
    }

    const person: Person = {
      id: null,
      username: this.createForm.get('username').value,
      password: this.createForm.get('password').value,
      name: this.createForm.get('name').value,
      age: this.createForm.get('age').value,
      family: this.createForm.get('family').value,
      role: this.createForm.get('role').value
    };

    this.personService.createPerson(person)
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
      (!this.createForm.get(field).valid && this.createForm.get(field).touched) ||
      (this.createForm.get(field).untouched && this.isSubmitted)
    );
  }

}
