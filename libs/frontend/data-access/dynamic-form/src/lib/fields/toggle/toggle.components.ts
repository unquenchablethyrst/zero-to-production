import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TField } from '../../form.models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleComponent {
  @Input() field!: TField;
  @Input() group!: FormGroup;
}