import { Component, EventEmitter, OnInit, Output, HostListener, ViewChild } from '@angular/core';
import {NgForm, AbstractControl, FormControl} from '@angular/forms';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { takeWhile, debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: 'app-new-card-input',
  templateUrl: './new-card-input.component.html',
  styleUrls: ['./new-card-input.component.css'],
})

export class NewCardInputComponent implements OnInit {

  newCardForm: FormGroup;
  private alive = true;
  @ViewChild('form') public form: NgForm;
  inputText: string;

  constructor(fb: FormBuilder) {
      this.newCardForm = fb.group({
          'text': new FormControl(''),
      });

      this.newCardForm.valueChanges.pipe(
      filter((value) => this.newCardForm.valid),
      debounceTime(500),
      takeWhile(() => this.alive)
      ).subscribe(data => {
          console.log(data);
      });
  }

  public newCard: any = {text:' '}

  @Output() onCardAdd = new EventEmitter<string>();

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
      if (event.key === 'Enter' && this.newCardForm.get('text').value !== '') {
        let note = this.newCardForm.get('text').value;
        this.addCard(note);
      }
  }

  addCard(text) {
      this.onCardAdd.emit(text);
      this.newCardForm.controls['text'].setValue('');
  }

  ngOnInit() {}

}
