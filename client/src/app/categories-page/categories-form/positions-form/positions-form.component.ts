import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {Position} from "../../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../../shared/classes/material.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string
  @ViewChild('modal') modalRef: ElementRef
  form: FormGroup
  positionId = null
  positions: Position[] = []
  loading = false
  modal: MaterialInstance

  constructor(
    private positionsService: PositionsService
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    })


    this.loading = true
    // debugger
    this.positionsService.fetch(this.categoryId).subscribe((positions: Position[]) => {
      this.positions = positions
      this.loading = false
    })
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnDestroy(): void {
    this.modal.close()
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    MaterialService.updateTextInputs()
    this.modal.open()
  }

  onAddPosition() {
    this.positionId = null
    this.form.reset({
      name: null,
      cost: 1
    })
    MaterialService.updateTextInputs()
    this.modal.open()
  }

  onCancel() {
    this.modal.close()
  }

  onSubmit() {
    this.form.disable()

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const completed = () => {
      this.modal.close()
      this.form.reset({name: '', cost: 1})
      this.form.enable()
    }

    if(this.positionId){
      newPosition._id = this.positionId
      this.positionsService.update(newPosition).subscribe((position: Position) => {
        const idx = this.positions.findIndex(p => p._id === this.positionId)
        this.positions[idx] = position
        MaterialService.toast('Зміни збережено')
      }, error => {
        this.form.enable()
        MaterialService.toast(error.error.message)
      }, completed
      )
    }
    else {
      this.positionsService.create(newPosition).subscribe((position: Position) => {
        MaterialService.toast('Позиція створена')
        this.positions.push(position)
      }, error => {
        this.form.enable()
        MaterialService.toast(error.error.message)
      }, completed
      )
    }
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation() // батьківські елементи не будуть викликані
    const decision = window.confirm(`Ви дійсно бажаєте виділити позицію "${position.name}"?`)

    if (decision){
      this.positionsService.delete(position).subscribe(
        response => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions.splice(idx, 1);
          MaterialService.toast(response.message);
        },
        error => {
          MaterialService.toast(error.error.message);

        }
      )
    }
  }
}
