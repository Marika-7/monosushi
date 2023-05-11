import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICategoryRequest, ICategoryResponse } from '../../interfaces/category/category.interface';
import { CollectionReference, DocumentReference, Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, updateDoc } from '@angular/fire/firestore';
import { DocumentData } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url = environment.BACKEND_URL;
  private api = { categories: `${this.url}/categories` };
  private categoryCollection!: CollectionReference<DocumentData>;

  constructor(
    private http: HttpClient,
    private afs: Firestore
  ) { 
    this.categoryCollection = collection(this.afs, 'categories');
  }

  // ----------  firebase  ----------

  getAllFirebase(): Observable<DocumentData[]> {
    return collectionData(this.categoryCollection, { idField: 'id' });
  }
  
  getOneFirebase(id: string): Observable<DocumentData> {
    const categoryDocumentReference = doc(this.afs, `categories/${id}`);
    return docData(categoryDocumentReference, { idField: 'id' });
  }

  createFirebase(category: ICategoryRequest): Promise<DocumentReference<DocumentData>> {
    return addDoc(this.categoryCollection, category);
  }

  updateFirebase(category: ICategoryRequest, id: string): Promise<void> {
    const categoryDocumentReference = doc(this.afs, `categories/${id}`);
    return updateDoc(categoryDocumentReference, { ...category });
  }
  
  deleteFirebase(id: string): Promise<void> {
    const categoryDocumentReference = doc(this.afs, `categories/${id}`);
    return deleteDoc(categoryDocumentReference);
  }

  // ---------- json-server ----------

  getAll(): Observable<ICategoryResponse[]> {
    return this.http.get<ICategoryResponse[]>(this.api.categories);
  }
  
  getOne(id: number): Observable<ICategoryResponse> {
    return this.http.get<ICategoryResponse>(`${this.api.categories}/${id}`);
  }

  create(category: ICategoryRequest): Observable<ICategoryResponse> {
    return this.http.post<ICategoryResponse>(this.api.categories, category);
  }

  update(category: ICategoryRequest, id: number): Observable<ICategoryResponse> {
    return this.http.patch<ICategoryResponse>(`${this.api.categories}/${id}`, category);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api.categories}/${id}`);
  }
  
}
