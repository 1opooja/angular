import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Key } from 'protractor';
import { Product } from './product';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'productnewtask';
  url='https://newproduct-a27a5-default-rtdb.firebaseio.com/.json'
  productsTable=[];
  keyId="";

  constructor(private http:HttpClient){
   this.getdata();
  };

  productForm = new FormGroup({

    productNameCtrl:new FormControl('maxi-dress',[Validators.required,Validators.minLength(3),Validators.maxLength(50)]),
    quantityCtrl: new FormControl('2',[Validators.required,Validators.minLength(1),Validators.maxLength(10)]),
    HSNCtrl: new FormControl('md123',[Validators.required,Validators.minLength(3),Validators.maxLength(10)]),
    priceCtrl:new FormControl('2000',[Validators.required,Validators.minLength(1),Validators.maxLength(10)])

  });

  getdata(){
    this.http.get(this.url).subscribe((values)=>{
      this.productsTable=[];
      if(values==null) return;
      
      Object.keys(values).forEach((Key) => {
       
        let a :any ={}
        {
    
        a.keyId = Key;
        a.ProductName = values[Key].ProductName;
        a.quantity = values[Key].quantity;
        a.price =values[Key] .price;
        a.HSNCode =values[Key] .HSNCode;
        }
        this.productsTable.push(a);

      })
      
    })
  }

  submit()
  {
    if (this.productForm.invalid) return;
    if (this.keyId != "") return this.update();
    let a:Product= new Product()
    
      a.ProductName=this.productForm.controls.productNameCtrl.value;
      a.quantity=this.productForm.controls.quantityCtrl.value;
      a.HSNCode=this.productForm.controls.HSNCtrl.value;
      a.price=this.productForm.controls.priceCtrl.value;
     
      this.http.post(this.url,a).subscribe((values)=>{
      
        this.getdata();
        this.clear();
      })

    

  }
  
  update()
  {
    
    let a:Product= new Product()
    
      a.ProductName=this.productForm.controls.productNameCtrl.value;
      a.quantity=this.productForm.controls.quantityCtrl.value;
      a.HSNCode=this.productForm.controls.HSNCtrl.value;
      a.price=this.productForm.controls.priceCtrl.value;
      
      this.http.put(`https://newproduct-a27a5-default-rtdb.firebaseio.com/${this.keyId}.json`,a).subscribe((values)=>{
        this.getdata();
        this.clear();
      })

    

  }
  edit(product)
  {
    this.keyId=product.keyId;
    this.productForm.controls.productNameCtrl.setValue(product.ProductName);
    this.productForm.controls.priceCtrl.setValue(product.price);
    this.productForm.controls.quantityCtrl.setValue(product.quantity);
    this.productForm.controls.HSNCtrl.setValue(product.HSNCode);


  }
  delete(keyId)
  {
    this.http.delete(`https://newproduct-a27a5-default-rtdb.firebaseio.com/${keyId}.json`).subscribe((value)=>
    {
      this.getdata();
    })

  }
  clear()
  {
    this.keyId="";
    this.productForm.reset();
  }

}
