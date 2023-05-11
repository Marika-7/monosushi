import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProductRequest, IProductResponse } from '../../interfaces/product/product.interface';
import { CollectionReference, DocumentReference, Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, query, updateDoc, where } from '@angular/fire/firestore';
import { DocumentData } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url = environment.BACKEND_URL;
  private api = { products: `${this.url}/products` };
  private productCollection!: CollectionReference<DocumentData>;

  constructor(
    private http: HttpClient,
    private afs: Firestore
  ) { 
    this.productCollection = collection(this.afs, 'products');
  }

  // ---------- json-server ----------
  
  getAllFirebase(): Observable<DocumentData[]> {
    return collectionData(this.productCollection, { idField: 'id' });
  }
  
  getAllByCategoryFirebase(name: string): Observable<DocumentData[]> {
    const productCollectionById = query(collection(this.afs, 'products'), where('category.path', '==', name));
    // return this.http.get<IProductResponse[]>(`${this.api.products}?category.path=${name}`);
    return collectionData(productCollectionById, { idField: 'id' });
  }
  
  getOneFirebase(id: string): Observable<DocumentData> {
    const productDocumentReference = doc(this.afs, `products/${id}`);
    return docData(productDocumentReference, { idField: 'id' });
  }

  createFirebase(product: IProductRequest): Promise<DocumentReference<DocumentData>> {
    return addDoc(this.productCollection, product);
  }

  updateFirebase(product: IProductRequest, id: string): Promise<void> {
    const productDocumentReference = doc(this.afs, `products/${id}`);
    return updateDoc(productDocumentReference, { ...product });
  }
  
  deleteFirebase(id: string): Promise<void> {
    const productDocumentReference = doc(this.afs, `products/${id}`);
    return deleteDoc(productDocumentReference);
  }

  // ---------- json-server ----------
  
  getAll(): Observable<IProductResponse[]> {
    return this.http.get<IProductResponse[]>(this.api.products);
  }
  
  getAllByCategory(name: string): Observable<IProductResponse[]> {
    return this.http.get<IProductResponse[]>(`${this.api.products}?category.path=${name}`);
  }
  
  getOne(id: number): Observable<IProductResponse> {
    return this.http.get<IProductResponse>(`${this.api.products}/${id}`);
  }

  create(product: IProductRequest): Observable<IProductResponse> {
    return this.http.post<IProductResponse>(this.api.products, product);
  }

  update(product: IProductRequest, id: number): Observable<IProductResponse> {
    return this.http.patch<IProductResponse>(`${this.api.products}/${id}`, product);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api.products}/${id}`);
  }

}
