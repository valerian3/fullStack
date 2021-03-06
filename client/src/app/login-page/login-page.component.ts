import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {User} from "../shared/interfaces";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  aSub: Subscription

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    })

    this.route.queryParams.subscribe((params: Params) => {
      if(params.registered){
        MaterialService.toast('Тепер ви можете увійти в систему, використовуючи свої дані')
      } else if(params.accessDenied){
        MaterialService.toast('Спочатку потрібно авторизуватись')
      }
      else if(params.sessionFailed){
        MaterialService.toast('Увійдіть в систему знову')
      }
    })
  }

  onSubmit() {
    this.form.disable()
    this.aSub = this.auth.login(this.form.value).subscribe(
      (token) => {
            this.router.navigate(['/overview'])
      },
        (error) => {
          MaterialService.toast(error.error.message)
          // console.warn(error) // виводить помилку, як попередження
          this.form.enable()
        }
    )
  }

  ngOnDestroy(): void {
    if(this.aSub){
      this.aSub.unsubscribe()
    }
  }
}
