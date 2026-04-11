import { NgModule } from '@angular/core';
import { RouterLink, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Users/login/login.component';
import { RegisterUserComponent } from './Users/register-user/register-user.component';
import { StartComponent } from './Home/Menu/start.component';
import { DashboardComponent } from './Home/Dashboard/dashboard.component';
import { RegisterUserConfigComponent } from './Configuration/register-userConfig/register-userConfig.component';

const routes: Routes = [
  {path: "",  component:LoginComponent},
  { path: 'login', component: LoginComponent },
  {path : 'register-user', component: RegisterUserComponent},
  {path: 'start', component: StartComponent},
  {path: 'Dashboard', component: DashboardComponent},
  {path: 'Register_UserConfig', component: RegisterUserConfigComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
