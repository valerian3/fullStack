import {ElementRef} from "@angular/core";

declare var M

export interface MaterialInstance {
  open?(): void,
  close?(): void,
  destroy?(): void,
}

export interface MaterialDatepicker extends MaterialInstance {
  date?: Date
}

export class MaterialService {
  static toast(message: string){
    M.toast({html: message}) // це звичайна вставка, по типу inner html
  }

  static initializeFloatingButton(ref: ElementRef){
    M.FloatingActionButton.init(ref.nativeElement )
  }

  static updateTextInputs(){
    M.updateTextFields()
  }

  static initModal(ref: ElementRef): MaterialInstance{
    return M.Modal.init(ref.nativeElement)
  }

  static initToolTip(ref: ElementRef): MaterialInstance {
    return M.Tooltip.init(ref.nativeElement)
  }

  static initDatepicker(ref: ElementRef, onClose: () => void): MaterialDatepicker{
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose
    })
  }

  static initTapTarget(ref: ElementRef): MaterialInstance{
    return M.TapTarget.init(ref.nativeElement)
  }
}