import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../authorization/authorization.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public authService: AuthorizationService
  ) { }

  ngOnInit(): void {
  }

  onLogout(){
    this.authService.logout()
  }
}
