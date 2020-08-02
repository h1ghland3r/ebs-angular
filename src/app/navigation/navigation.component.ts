import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  currentUser: User;

  @ViewChild('sidenav') private sidenav: MatSidenav;
  @ViewChild('menuButton') private menuButton: MatButton;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService,
    @Inject(DOCUMENT) private document: any,
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
