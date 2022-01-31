import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss']
})
export class SingupComponent implements OnInit, OnDestroy {

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

  onSignup(form: NgForm){
    if(form.invalid){
      return
    } else{
      this.isLoading = true
      this.authService.createUser(form.value.email, form.value.username, form.value.password)
    }
  }
}
