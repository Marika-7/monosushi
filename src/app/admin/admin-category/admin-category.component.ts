import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryResponse } from 'src/app/shared/interfaces/category/category.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { Storage, deleteObject, getDownloadURL, percentage, ref, uploadBytesResumable } from "@angular/fire/storage";

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  public adminCategories!: ICategoryResponse[];
  public categoryForm!: FormGroup;
  private currentCategoryId = 0;
  public inputsIsOpen = false;
  public editStatus = false;
  public uploadPercent = 0;
  public isUploaded = false;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private storage: Storage
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.initCategoryForm();
  }

  loadCategories(): void {
    this.categoryService.getAll()
      .subscribe(data => {
      this.adminCategories = data;
    })
  }

  initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      path: [null, Validators.required],
      imagePath: [null, Validators.required]
    });
  }

  openInputs(): void {
    this.inputsIsOpen = !this.inputsIsOpen;
  }

  saveCategory(): void {
    if (this.editStatus) {
      this.categoryService.update(this.categoryForm.value, this.currentCategoryId)
        .subscribe(() => {
          this.loadCategories();
        })
    } else {
      this.categoryService.create(this.categoryForm.value)
        .subscribe(() => {
        this.loadCategories();
      })
    }
    this.inputsIsOpen = false;
    this.editStatus = false;
    this.categoryForm.reset();
    this.isUploaded = false;
    this.uploadPercent = 0;
  }

  editCategory(category: ICategoryResponse): void {
    this.categoryForm.patchValue({
      name: category.name,
      path: category.path,
      imagePath: category.imagePath
    });
    this.currentCategoryId = category.id;
    this.editStatus = true;
    this.inputsIsOpen = true;
    this.isUploaded = true;
  }

  deleteCategory(category: ICategoryResponse): void {
    this.categoryService.delete(category.id)
      .subscribe(() => {
        this.loadCategories();
      })
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images/category', file.name, file)
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

  async uploadFile(folder: string, name: string, file: File | null): Promise<string> {
    const path = `${folder}/${name}`;
    let url = '';
    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe(data => {
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
        this.categoryForm.patchValue({
          imagePath: null
        });
      })
  }

  valueByControl(control: string): string {
    return this.categoryForm.get(control)?.value;
  }

}
