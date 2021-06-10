import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Component
import { StudentsComponent } from './students/students.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';

const routes: Routes = [
  {path: '', redirectTo: '/Dashboard', pathMatch: 'full' },
  {path: 'Dashboard', component: DashboardComponent },
  {path: 'Students', component: StudentsComponent},
  {path: 'Detail/:id', component: StudentDetailComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
