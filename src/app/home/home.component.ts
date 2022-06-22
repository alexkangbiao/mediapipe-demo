import { Component } from '@angular/core';
import { Router } from '@angular/router';

export interface Demo {
  name: string;
  routerLink: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent  {

  demos: Demo[];

  constructor(router: Router) {
    this.demos = router.config
      .filter((r: any) => r.data && r.data.demo)
      .map((r: any) => ({
        name: r.data.name,
        routerLink: r.path,
      }));
  }
  
}
