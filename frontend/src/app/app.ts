import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false  // Make sure this is false or remove the standalone property
})
export class App {
  
  constructor(private router: Router) {
    // Fix for router navigation issues
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Reset navigation to force component reload
      this.router.navigated = false;
    });
  }

  navigateHome(event: Event) {
    event.preventDefault();
    // Force reload when clicking home
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/students']);
    });
  }
}