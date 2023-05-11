import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDiscountRequest, IDiscountResponse } from '../../interfaces/discount/discount.interface';
import { CollectionReference, DocumentReference, Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, updateDoc } from '@angular/fire/firestore';
import { DocumentData } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private url = environment.BACKEND_URL;
  private api = { discounts: `${this.url}/discounts` };
  private discountCollection!: CollectionReference<DocumentData>;

  constructor(
    private http: HttpClient,
    private afs: Firestore
    ) { 
      this.discountCollection = collection(this.afs, 'discounts');
    }

    // ---------- firebase ----------

    getAllFirebase(): Observable<DocumentData[]> {
      return collectionData(this.discountCollection, { idField: 'id' });
    }
  
    getOneFirebase(id: string): Observable<DocumentData> {
      const discountDocumentReference = doc(this.afs, `discounts/${id}`);
      return docData(discountDocumentReference, { idField: 'id' });
    }
  
    createFirebase(discount: IDiscountRequest): Promise<DocumentReference<DocumentData>> {
      return addDoc(this.discountCollection, discount);
    }
  
    updateFirebase(discount: IDiscountRequest, id: string): Promise<void> {
      const discountDocumentReference = doc(this.afs, `discounts/${id}`);
      return updateDoc(discountDocumentReference, { ...discount });
    }
  
    deleteFirebase(id: string):  Promise<void> {
      const discountDocumentReference = doc(this.afs, `discounts/${id}`);
      return deleteDoc( discountDocumentReference);
    }

    // ---------- json-server ----------

    getAll(): Observable<IDiscountResponse[]> {
      return this.http.get<IDiscountResponse[]>(this.api.discounts);
    }
  
    getOne(id: number): Observable<IDiscountResponse> {
      return this.http.get<IDiscountResponse>(`${this.api.discounts}/${id}`);
    }
  
    create(discount: IDiscountRequest): Observable<IDiscountResponse> {
      return this.http.post<IDiscountResponse>(this.api.discounts, discount);
    }
  
    update(discount: IDiscountRequest, id: number): Observable<IDiscountResponse> {
      return this.http.patch<IDiscountResponse>(`${this.api.discounts}/${id}`, discount);
    }
  
    delete(id: number):  Observable<void> {
      return this.http.delete<void>(`${this.api.discounts}/${id}`);
    }
}
