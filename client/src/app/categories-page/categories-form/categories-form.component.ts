import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesServices} from "../../shared/services/categories.services";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {MaterialService} from "../../shared/classes/material.service";
import {Category} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef
  form: FormGroup
  image: File
  imagePreview = ''
  category: Category
  isNew = true

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesServices,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required])
    })

    this.form.disable()

    this.route.params.pipe(
      switchMap((params: Params) => {
        if(params['id']){
          this.isNew = false
          return this.categoriesService.getById(params['id'])
        }

        return of(null)
      })
    ).subscribe((category: Category) => {
      if(category) {
        this.category = category
        this.form.patchValue({
          name: category.name // змінюємо дані в формі, на ті які отриали з севера
        })

        this.imagePreview = category.imageSrc // кидає адресу на локальній адресі
        MaterialService.updateTextInputs()
      }

      this.form.enable()
    },
      (error) => {
      MaterialService.toast(error.error.message)
      }
    )
  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  deleteCategory() {
    const desition = window.confirm(`Ви впевнені, що хочете видалити категорії "${this.category.name}"`)

    if(desition){
      this.categoriesService.delete(this.category._id)
        .subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])
        )
    }
  }

  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result as string
    }

    reader.readAsDataURL(file)
  }

  onSubmit() {
    let obs$
    this.form.disable()

    if(this.isNew){
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    }
    else{
      console.log(this.form.value.name)
      obs$ = this.categoriesService.update(this.category._id ,this.form.value.name, this.image)
    }

    obs$.subscribe((category) => {
        this.category = category
        MaterialService.toast('Зміни збережено')
        this.form.enable()
      },
      (error) => {
      MaterialService.toast(error.error.message)
      this.form.enable()
    })
  }

}
