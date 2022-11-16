import { Injectable } from "@angular/core";

export interface Menu{
    state:string;
    name:string;
    icon:string;
    role:string;
}

const MENUITEMS = [
    {state:'dashboard', name:'Dashboard', icon:'dashboard', role: ''},
    {state:'category', name:'Categorias', icon:'category', role: 'admin'},
    {state:'product', name:'Productos', icon:'fastfood', role: 'admin'},
    {state:'order', name:'Nueva orden', icon:'list_alt', role: ''},
    {state:'user', name:'Usuarios', icon:'people', role: 'admin'},

]; 

@Injectable()
export class MenuItems{
    getMenuItem(): Menu[]{
        return MENUITEMS;
    }
}