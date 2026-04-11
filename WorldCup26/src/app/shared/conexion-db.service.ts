import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { register_userMoldel } from './register_user.model';
import { loginMoldel } from './login.model';
import { register_userConfigMoldel } from './registerUserConfig.model';

@Injectable({
  providedIn: 'root'
})
export class ConexionDBService {
  
  BASE_URL_SQL = 'http://localhost:3000'

  constructor(private http: HttpClient, private router: Router) { }

  RegistroUsuario(id: register_userMoldel ){
    return this.http.post<string>(`${this.BASE_URL_SQL}/cup/userResgiter`, id)
  }

   obtenerLogin(id: loginMoldel)  {
    return this.http.post<loginMoldel[]>(`${this.BASE_URL_SQL}/cup/UserAutenticar`, id);
  }


  // SECCION CONFIGURACION
  RegistroUsuarioConfig(id: register_userConfigMoldel){
    return this.http.post<string>(`${this.BASE_URL_SQL}/cup/ResgiterUserConfig`, id)
  }
  GerUserConfig(){
    return this.http.get<register_userConfigMoldel>(`${this.BASE_URL_SQL}/cup/GetUserConfig`)
  }
  actualizarUsuario(id: any) {
  return this.http.put(`${this.BASE_URL_SQL}/cup/UpdateUserConfig`, id);
}
}
