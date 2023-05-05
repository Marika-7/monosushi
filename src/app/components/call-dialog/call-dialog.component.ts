import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-call-dialog',
  templateUrl: './call-dialog.component.html',
  styleUrls: ['./call-dialog.component.scss']
})
export class CallDialogComponent implements OnInit {

  public callForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initCallForm();
  }

  initCallForm(): void {
    this.callForm = this.fb.group({
      name: [null, Validators.required],
      phoneNumber: [null, Validators.required]
    });
  }

  callback(): void {
    console.log('Ми зателефонуємо');
    this.toastr.success('Очікуйте дзвінка');
  }

}
