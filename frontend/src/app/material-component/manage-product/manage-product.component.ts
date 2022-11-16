import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ProductComponent } from '../dialog/product/product.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {
  displayedColumns:string[] = ['name', 'categoryName', 'description','price','edit'];
  dataSource:any;
  responseMessage:any;


  constructor(private productService:ProductService,
    private dialog:MatDialog,
    private snackbarService:SnackbarService,
    private router:Router) { }


  ngOnInit(): void {
    this.tableData();
  }

  
  tableData(){
    this.productService.getproducts().subscribe((response:any)=>{
      this.dataSource = new MatTableDataSource(response);
    },(error) =>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    
    })
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction(){
    const dialogConfig = new MatDialogConfig(); 
    dialogConfig.data={
      action: 'Add'
    }
    dialogConfig.width="850px";
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);

    const sub= dialogRef.componentInstance.onAddProduct.subscribe(
      (response)=>{
        this.tableData();
      }
    )
  }

  handleEditAction(value:any){
    const dialogConfig = new MatDialogConfig(); 
    dialogConfig.data={
      action: 'Edit',
      data: value
    }
    dialogConfig.width="850px";
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);

    const sub= dialogRef.componentInstance.onEditProduct.subscribe(
      (response)=>{
        this.tableData();
      }
    )
  }

  handleDeleteAction(value:any){
    const dialogConfig = new MatDialogConfig(); 
    dialogConfig.data={
      message: 'borrar '+value.name
    }

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);

    const sub= dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (response)=>{
        this.deleteProduct(value.id);
        dialogRef.close();
      }
    )
  }

  deleteProduct(id:any){
    this.productService.delete(id).subscribe((response:any)=>{
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"exito");
    },(error:any) =>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    
    }
    )
  }

  onChange(status:any, id:any){

  }

}
 