import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading = false;
  isSubmitted = false;
  navUrl: string;
  error = '';

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.navUrl = this.route.snapshot.queryParams.navUrl || '/';
  }

  isInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.isSubmitted)
    );
  }

  onSubmit() {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const username = this.form.get('username').value;
    const password = this.form.get('password').value;

    this.authService.login(username, password)
      .pipe(first())
      .subscribe(
        res => {
          this.router.navigate([this.navUrl]);
          this.toastr.success('Welcome');
        },
        error => {
          this.error = error;
          this.loading = false;
          this.toastr.error(this.error);
        });
  }
}
