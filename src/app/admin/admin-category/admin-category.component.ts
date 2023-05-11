import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryResponse } from 'src/app/shared/interfaces/category/category.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { ImageService } from 'src/app/shared/services/image/image.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  public adminCategories!: ICategoryResponse[];
  public categoryForm!: FormGroup;
  private currentCategoryId!: string | number;
  public inputsIsOpen = false;
  public editStatus = false;
  public isUploaded = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    public imageService: ImageService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.initCategoryForm();
    this.imageService.uploadPercent = 0;
  }

  loadCategories(): void {
    // this.categoryService.getAll()
    //   .subscribe(data => {
    //   this.adminCategories = data;
    // });
    this.categoryService.getAllFirebase()
      .subscribe(data => {
      this.adminCategories = data as ICategoryResponse[];
    });
  }

  initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      path: [null, Validators.required],
      imagePath: [null, Validators.required]
    });
  }

  toggleOpenForm(): void {
    this.inputsIsOpen = !this.inputsIsOpen;
  }

  saveCategory(): void {
    if (this.editStatus) {
      // this.categoryService.update(this.categoryForm.value, this.currentCategoryId)
      //   .subscribe(() => {
      //     this.loadCategories();
      //     this.toastr.success('Category successfully updated');
      //   })
      this.categoryService.updateFirebase(this.categoryForm.value, this.currentCategoryId as string)
        .then(() => {
          this.loadCategories();
          this.toastr.success('Category successfully updated');
        })
    } else {
      // this.categoryService.create(this.categoryForm.value)
      //   .subscribe(() => {
      //   this.loadCategories();
      //   this.toastr.success('Category successfully created');
      // })
      this.categoryService.createFirebase(this.categoryForm.value)
      .then(() => {
      this.loadCategories();
      this.toastr.success('Category successfully created');
    })
    }
    this.inputsIsOpen = false;
    this.editStatus = false;
    this.categoryForm.reset();
    this.isUploaded = false;
    this.imageService.uploadPercent = 0;
  }

  editCategory(category: ICategoryResponse): void {
    // this.categoryService.getOneFirebase(category.id as string).subscribe(data => {
    //   console.log(data);
    // })
    this.categoryForm.patchValue({
      name: category.name,
      path: category.path,
      imagePath: category.imagePath
    });
    // this.currentCategoryId = category.id as number;
    this.currentCategoryId = category.id as string;
    this.editStatus = true;
    this.inputsIsOpen = true;
    this.isUploaded = true;
  }

  deleteCategory(category: ICategoryResponse): void {
    // this.categoryService.delete(category.id as number)
    //   .subscribe(() => {
    //     this.loadCategories();
    //     this.toastr.success('Category successfully deleted');
    //   })
    this.categoryService.deleteFirebase(category.id as string)
      .then(() => {
        this.loadCategories();
        this.toastr.success('Category successfully deleted');
      })
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.imageService.uploadFile('images/category', file.name, file)
      .then(data => {
        this.categoryForm.patchValue({
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
        this.categoryForm.patchValue({ imagePath: null });
      })
      .catch(err => {
        console.log(err);
      })
      this.isUploaded = false;
      this.imageService.uploadPercent = 0;
  }

  valueByControl(control: string): string {
    return this.categoryForm.get(control)?.value;
  }

}
