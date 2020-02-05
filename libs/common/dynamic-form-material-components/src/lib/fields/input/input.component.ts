import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormGroupTypes, IInputField } from '@uqt/common/dynamic-form';

@Component({
  selector: 'uqt-app-form-input',
  templateUrl: './input.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      .mat-form-field {
        width: 100%;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormInputComponent {
  @Input() idx: number; // Only accessed if a FormArrayGroup
  @Input() type: FormGroupTypes;
  @Input() field: IInputField;
  @Input() group: FormGroup;
}