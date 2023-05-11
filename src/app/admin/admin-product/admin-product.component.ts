import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryResponse } from 'src/app/shared/interfaces/category/category.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { IProductResponse } from 'src/app/shared/interfaces/product/product.interface';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { ImageService } from 'src/app/shared/services/image/image.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {

  public adminProducts!: IProductResponse[];
  public adminCategories!: ICategoryResponse[];
  public productForm!: FormGroup;
  public inputsIsOpen = false;
  public editStatus = false;
  public isUploaded = false;
  private currentProductId!: string | number;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    public imageService: ImageService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initProductForm();
    this.loadCategories();
    this.loadProducts();
    this.imageService.uploadPercent = 0;
  }

  loadCategories(): void {
    // this.categoryService.getAll()
    //   .subscribe(data => {
    //   this.adminCategories = data;
    //   this.productForm.patchValue({
    //     category: this.adminCategories[0].id
    //   })
    // });
    this.categoryService.getAllFirebase()
      .subscribe(data => {
      this.adminCategories = data as ICategoryResponse[];
      this.productForm.patchValue({
        category: this.adminCategories[0].id
      })
    });
  }

  loadProducts(): void {
    // this.productService.getAll()
    //   .subscribe(data => {
    //   this.adminProducts = data;
    // })
    this.productService.getAllFirebase()
      .subscribe(data => {
      this.adminProducts = data as IProductResponse[];
    })
  }

  initProductForm(): void {
    this.productForm = this.fb.group({
      category: [null, Validators.required],
      name: [null, Validators.required],
      path: [null, Validators.required],
      description: [null, Validators.required],
      weight: [null, Validators.required],
      price: [null, Validators.required],
      imagePath: [null, Validators.required],
      count: [1]
    });
  }

  toggleOpenForm(): void {
    this.inputsIsOpen = !this.inputsIsOpen;
  }

  saveProduct(): void {
    this.productForm.value.count = 1;
    if (this.editStatus) {
      // this.productService.update(this.productForm.value, this.currentProductId as number)
      //   .subscribe(() => {
      //     this.loadProducts();
      //     this.toastr.success('Product successfully updated');
      //   })
      this.productService.updateFirebase(this.productForm.value, this.currentProductId as string)
        .then(() => {
          this.loadProducts();
          this.toastr.success('Product successfully updated');
        })
    } else {
      // this.productService.create(this.productForm.value)
      //   .subscribe(() => {
      //   this.loadProducts();
      //   this.toastr.success('Product successfully created');
      // })
      this.productService.createFirebase(this.productForm.value)
        .then(() => {
        this.loadProducts();
        this.toastr.success('Product successfully created');
      })
    }
    this.inputsIsOpen = false;
    this.editStatus = false;
    this.productForm.reset();
    this.isUploaded = false;
    this.imageService.uploadPercent = 0;
  }

  editProduct(product: IProductResponse): void {
    this.productForm.patchValue({
      category: product.category,
      name: product.name,
      path: product.path,
      description: product.description,
      weight: product.weight,
      price: product.price,
      imagePath: product.imagePath
    });
    // this.currentProductId = product.id as number;
    this.currentProductId = product.id as string;
    this.editStatus = true;
    this.isUploaded = true;
    this.inputsIsOpen = true;
  }

  deleteProduct(product: IProductResponse): void {
    // this.productService.delete(product.id as number)
    //   .subscribe(() => {
    //     this.loadProducts();
    //     this.toastr.success('Product successfully deleted');
    //   })
    this.productService.deleteFirebase(product.id as string)
      .then(() => {
        this.loadProducts();
        this.toastr.success('Product successfully deleted');
      })
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.imageService.uploadFile('images/product', file.name, file)
      .then(data => {
        this.productForm.patchValue({
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
        this.productForm.patchValue({ imagePath: null });
      })
      .catch(err => {
        console.log(err);
      })
      this.isUploaded = false;
      this.imageService.uploadPercent = 0;
  }

  valueByControl(control: string): string {
    return this.productForm.get(control)?.value;
  }

}
