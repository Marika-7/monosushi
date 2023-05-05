import { NgModule } from "@angular/core";

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const MODULES = [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule
]

const MATERIAL = [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
]

@NgModule({
    declarations: [],
    imports: [
        ...MODULES,
        ...MATERIAL
    ],
    exports: [
        ...MODULES,
        ...MATERIAL
    ]
})
export class SharedModule { }
