import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDiscountResponse } from 'src/app/shared/interfaces/discount/discount.interface';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';
import { ImageService } from 'src/app/shared/services/image/image.service';
import { ToastrService } from 'ngx-toastr';

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
  public isUploaded = false;

  constructor(
    private fb: FormBuilder,
    private discountService: DiscountService,
    public imageService: ImageService,
    private toastr: ToastrService
    ) {}

    ngOnInit(): void {
      this.loadDiscounts();
      this.initDiscountForm();
      this.imageService.uploadPercent = 0;
    }
  
    loadDiscounts(): void {
      this.discountService.getAll()
        .subscribe(data => {
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
  
    toggleOpenForm(): void {
      this.inputsIsOpen = !this.inputsIsOpen;
    }
  
    saveDiscount(): void {
      if (this.editStatus) {
        this.discountService.update(this.discountForm.value, this.currentDiscountId)
          .subscribe(() => {
            this.loadDiscounts();
            this.toastr.success('Discount successfully updated');
          })
      } else {
        this.discountService.create(this.discountForm.value)
          .subscribe(() => {
            this.loadDiscounts();
            this.toastr.success('Discount successfully created');
          })
      }
      this.inputsIsOpen = false;
      this.editStatus = false;
      this.discountForm.reset();
      this.isUploaded = false;
      this.imageService.uploadPercent = 0;
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
          this.toastr.success('Discount successfully deleted');
        })
    }
  
    upload(event: any): void {
      const file = event.target.files[0];
      this.imageService.uploadFile('images/discount', file.name, file)
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
  
    deleteImage(): void {
      this.imageService.deleteUploadFile(this.valueByControl('imagePath'))
      .then(() => {
        this.discountForm.patchValue({ imagePath: null });
      })
      .catch(err => {
        console.log(err);
      })
      this.isUploaded = false;
      this.imageService.uploadPercent = 0;
    }
    
    valueByControl(control: string): string {
      return this.discountForm.get(control)?.value;
    }

}
