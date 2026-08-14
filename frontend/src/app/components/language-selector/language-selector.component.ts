import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

interface LanguageOption {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ButtonComponent],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent implements OnChanges {
  @Input() extractedLanguages: string[] = [];
  @Output() selectionChanged = new EventEmitter<string[]>();

  options: LanguageOption[] = [];
  newLanguage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['extractedLanguages']) {
      this.options = this.extractedLanguages.map(name => ({ name, selected: true }));
      this.emitSelection();
    }
  }

  toggle(option: LanguageOption): void {
    option.selected = !option.selected;
    this.emitSelection();
  }

  remove(option: LanguageOption): void {
    this.options = this.options.filter(o => o !== option);
    this.emitSelection();
  }

  addLanguage(): void {
    const trimmed = this.newLanguage.trim();
    if (!trimmed) {
      return;
    }

    const alreadyExists = this.options.some(o => o.name.toLowerCase() === trimmed.toLowerCase());
    if (!alreadyExists) {
      this.options.push({ name: trimmed, selected: true });
      this.emitSelection();
    }

    this.newLanguage = '';
  }

  private emitSelection(): void {
    const selected = this.options.filter(o => o.selected).map(o => o.name);
    this.selectionChanged.emit(selected);
  }
}