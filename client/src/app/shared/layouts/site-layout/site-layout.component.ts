import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {MaterialService} from "../../classes/material.service";

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements AfterViewInit {

  @ViewChild('floating') floatingRef: ElementRef

  links = [
    {url: '/overview', name: 'Обзор'},
    {url: '/analytics', name: 'Аналітика'},
    {url: '/history', name: 'Історія'},
    {url: '/order', name: 'Додати замовлення'},
    {url: '/categories', name: 'Асортимент'}
  ]

  constructor(
    private router: Router,
    private auth: AuthService
  ) {
  }

  logout(event: Event) {
    event.preventDefault()
    // console.log(event.target)
    this.auth.logout()
    this.router.navigate(['/login'])
  }

  ngAfterViewInit(): void {
    MaterialService.initializeFloatingButton(this.floatingRef)
    // console.log(this.floatingRef)
  }
}
