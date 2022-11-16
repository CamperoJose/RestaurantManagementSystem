import { StaticSymbol } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {

  displayedColumns:string[] = ['name', 'correo', 'numero','status'];
  dataSource:any;
  responseMessage:any;


  constructor(private UserService:UserService,
    private dialog:MatDialog,
    private snackbarService:SnackbarService,
    private router:Router) { }

  ngOnInit(): void {
    this.tableData();
  } 

  tableData(){
    this.UserService.getUsers().subscribe((response:any)=>{
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

  
  handleChangeAction(status:any,id:any){
    var data={
      status:status.toString(),
      id:id
    }
    this.UserService.update(data).subscribe((response:any)=>{
      this.responseMessage=response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"exito")
    },(error) =>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    
    })
  }

}
