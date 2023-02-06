
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './authentication/auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public router: Router, public authService: AuthService) { }

  ngOnInit() {
  }

  list = [
    {
      "link": "/tabs/Home",
      "icon": "compass",
      "name": "Home"
    }, {
      "link": "/tabs/Content",
      "icon": "reader",
      "name": "Content"
    }, {
      "link": "/tabs/ActionTracker",
      "icon": "leaf",
      "name": "Action Tracker"
    }
  ]
  menuClick() {
  }

}

