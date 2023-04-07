import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDiscountResponse } from 'src/app/shared/interfaces/discount/discount.interface';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';
import { Storage, deleteObject, getDownloadURL, percentage, ref, uploadBytesResumable } from "@angular/fire/storage";

@Component({
  selector: 'app-admin-discount',
  templateUrl: './admin-discount.component.html',
  styleUrls: ['./admin-discount.component.scss']
})
export class AdminDiscountComponent implements OnInit {

  public adminDiscounts!: IDiscountResponse[];
  public discountForm!: FormGroup;
  private currentDiscountId = 0;
  public inputsIsOpen = false;
  public editStatus = false;
  public uploadPercent = 0;
  public isUploaded = false;

  constructor(
    private discountService: DiscountService,
    private fb: FormBuilder,
    private storage: Storage
    ) {}

    ngOnInit(): void {
      this.loadDiscounts();
      this.initDiscountForm();
    }
  
    loadDiscounts(): void {
      this.discountService.getAll()
        .subscribe(data =>{
          this.adminDiscounts = data;
        })
    }
  
    initDiscountForm(): void {
      this.discountForm = this.fb.group({
        name: [null, Validators.required],
        header: [null, Validators.required],
        description: [null, Validators.required],
        imagePath: [null, Validators.required]
      });
    }
  
    openInputs(): void {
      this.inputsIsOpen = !this.inputsIsOpen;
    }
  
    saveDiscount(): void {
      if (this.editStatus) {
        this.discountService.update(this.discountForm.value, this.currentDiscountId)
          .subscribe(() => {
            this.loadDiscounts();
          })
      } else {
        this.discountService.create(this.discountForm.value)
          .subscribe(() => {
            this.loadDiscounts();
          })
      }
      this.inputsIsOpen = false;
      this.editStatus = false;
      this.discountForm.reset();
      this.isUploaded = false;
      this.uploadPercent = 0;
    }
  
    editDiscount(discount: IDiscountResponse): void {
      this.discountForm.patchValue({
        name: discount.name,
        header: discount.header,
        description: discount.description,
        imagePath: discount.imagePath
      });
      this.currentDiscountId = discount.id;
      this.editStatus = true;
      this.inputsIsOpen = true;
      this.isUploaded = true;
    }
  
    deleteDiscount(discount: IDiscountResponse): void {
      this.discountService.delete(discount.id)
        .subscribe(() => {
          this.loadDiscounts();
        })
    }
  
    upload(event: any): void {
      const file = event.target.files[0];
      this.uploadFile('images/discount', file.name, file)
        .then(data => {
          this.discountForm.patchValue({
            imagePath: data
          });
          this.isUploaded = true;
        })
        .catch(err => {
          console.log(err);
        })
    }
  
    async uploadFile(folder: string, name: string, file: File | null): Promise<string> {
      const path = `${folder}/${name}`;
      let url = '';
      if (file) {
        try {
          const storageRef = ref(this.storage, path);
          const task = uploadBytesResumable(storageRef, file);
          percentage(task)
            .subscribe(data => {
              this.uploadPercent = data.progress;
            });
            await task;
            url = await getDownloadURL(storageRef);
        } catch(err: any) {
          console.log(err);
        }
      } else {
        console.log('wrong format');
      }
      return Promise.resolve(url);
    }
  
    deleteImage(): void {
      const task = ref(this.storage, this.valueByControl('imagePath'));
      deleteObject(task)
        .then(() => {
          console.log('File deleted');
          this.isUploaded = false;
          this.uploadPercent = 0;
          this.discountForm.patchValue({
            imagePath: null
          });
        })
    }
    
    valueByControl(control: string): string {
      return this.discountForm.get(control)?.value;
    }

}
