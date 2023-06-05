import { Component, OnInit } from '@angular/core';
import { FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { LoginRequest } from 'src/app/utils/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';
  loginForm = this.formBuilder.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
  });

  constructor(private readonly formBuilder: NonNullableFormBuilder, private readonly loginService: LoginService, private readonly router: Router) { }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(data => {
      console.log("data", data);

      console.log("this.loginForm", this.loginForm.value);


    })
  }

  submitLoginForm() {
    const loginRequest: LoginRequest = {
      name: this.loginForm.controls['name'].value,
      email: this.loginForm.controls['email'].value,
    }
    this.loginService.login(loginRequest).pipe(catchError(() => {
      this.loginService.setIsAuthorized(false);
      return this.router.navigate(['login']);
    })).subscribe(() => {
      this.loginService.setIsAuthorized(true);
      this.router.navigate(['dogs-list']);
    })

  }

}
