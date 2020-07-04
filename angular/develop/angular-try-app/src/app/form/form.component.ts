import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(10)
  ]);

  mail = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  pass = new FormControl('', [
    Validators.required,
    Validators.minLength(8)
  ]);
  
  myForm = this.builder.group({
    name: this.name,
    mail: this.mail,
    pass: this.pass
  });

  constructor(private builder: FormBuilder) { }

  show() {
    console.log(this.name.value);
    console.log(this.mail.value);
    console.log(this.pass.value);
    console.log(this.myForm.value);
  }

  ngOnInit(): void {
  }

}
