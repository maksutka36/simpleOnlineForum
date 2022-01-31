import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub!: Subscription;

  constructor(
    private authService: AuthorizationService
  ) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    )
  }
  
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe()
}

  onLogin(form: NgForm){
    if(form.invalid){
      return
    } else{
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password)
    }
  }
  

}
