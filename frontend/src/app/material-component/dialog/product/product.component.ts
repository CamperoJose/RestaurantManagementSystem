import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
}) 
export class ProductComponent implements OnInit {

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  ProductForm:any = FormGroup;
  dialogAction:any = "Add";
  action:any="Add";
  responseMessage:any;
  categorys:any = [];


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuiler:FormBuilder,
  private productService:ProductService,
  public dialogRef:MatDialogRef<ProductComponent>,
  private categoryService:CategoryService,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.ProductForm=this.formBuiler.group({
      name:[null,[Validators.required]],
      categoryID:[null,Validators.required],
      price:[null,Validators.required],
      description:[null,Validators.required]
    })

    if(this.dialogData.action === 'Edit'){
      this.dialogAction="Edit";
      this.action = "Update";
      this.ProductForm.patchValue(this.dialogData.data);
    }

    this.getcategorys();
  }

  getcategorys(){
    this.categoryService.getcategorys().subscribe((response:any)=>{
      this.categorys = response;
    },(error:any)=>{
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }

  handleSubmit(){
    if(this.dialogAction === "Edit"){
      this.edit();
    }else{
      this.add();
    }
  }

  edit(){
    var formData = this.ProductForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryID: formData.categoryID,
      price: formData.price,
      description: formData.description
    }
    this.productService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditProduct.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "exito");
      },(error:any)=>{
        this.dialogRef.close();
          if(error.error?.message){
            this.responseMessage = error.error?.message;
          }else{
            this.responseMessage = GlobalConstants.genericError;
          }
          this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
      })
  }

  add(){
    var formData = this.ProductForm.value;
    var data = {
      name: formData.name,
      categoryID: formData.categoryID,
      price: formData.price,
      description: formData.description
    }
    this.productService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddProduct.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "exito");
      },(error:any)=>{
        this.dialogRef.close();
          if(error.error?.message){
            this.responseMessage = error.error?.message;
          }else{
            this.responseMessage = GlobalConstants.genericError;
          }
          this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
      })
  }

}
