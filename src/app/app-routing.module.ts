import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DogsListComponent } from './components/dogs-list/dogs-list.component';
import { LoginComponent } from './components/login/login.component';
import { LoginGuardService } from './services/login-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dogs-list', pathMatch: 'full'
  },
  {
    path: 'dogs-list',
    component: DogsListComponent,
    canActivate: [LoginGuardService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: '**', redirectTo: '/dogs-list' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
