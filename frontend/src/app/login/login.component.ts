import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private router:Router,
    private userService:UserService,
    private SnackbarService:SnackbarService,
    public dialogRef:MatDialogRef<LoginComponent>) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      correo:[null,[Validators.required, Validators.pattern(GlobalConstants.correoRegex)]],
      password:[null,[Validators.required]],
    })
  }

  handleSubmit(){
    var formData  = this.loginForm.value;
    var data = {
      correo: formData.correo,
      password: formData.password
    }

    this.userService.login(data).subscribe((response:any)=>{
      this.dialogRef.close();
      localStorage.setItem('token', response.token);
      this.router.navigate(['/cafe/dashboard']);
    },(error) =>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.SnackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    
    })
  }



}
