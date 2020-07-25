import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, AfterViewInit, OnDestroy {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  sidenavSub: Subscription;
  routerSub: Subscription;

  username: string;

  @ViewChild('sidenav') private sidenav: MatSidenav;
  @ViewChild('menuButton') private menuButton: MatButton;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    @Inject(DOCUMENT) private document: any,
  ) {
    this.routerSub = this.router.events
    .pipe(
      filter(ev => ev instanceof NavigationEnd)
    )
    .subscribe((ev: NavigationEnd) => {
      if (this.sidenav && this.sidenav.mode !== 'side') {
        this.sidenav.close();
      }

      const sidenavContentElement = this.document.querySelector(
        '.mat-sidenav-content',
      );

      if (sidenavContentElement) {
        sidenavContentElement.scrollTop = 0;
      }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.sidenavSub = this.sidenav.openedChange.subscribe(() => {
      if (this.menuButton) {
        this.menuButton._elementRef.nativeElement.classList.remove('cdk-program-focused');
        this.menuButton._elementRef.nativeElement.classList.add('cdk-mouse-focused');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sidenavSub) {
      this.sidenavSub.unsubscribe();
    }

    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  logout(): void {

  }
}
