import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ]
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  @Input() errorMessage = '';

  value: string | number = '';
  disabled = false;

  private onChange: (value: string | number) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = this.type === 'number' ? Number(input.value) : input.value;
    this.value = val;
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string | number): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}