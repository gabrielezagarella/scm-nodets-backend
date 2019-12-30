import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./admin/admin.component";
import { UsersListsComponent } from "./users-lists/users-lists.component";
import { IsAdminGuard } from "../auth/permissions/isAdmin.guard";

const routes: Routes = [
  { path: "", component: UsersListsComponent, canActivate: [IsAdminGuard] },
  { path: ":userId", component: AdminComponent, canActivate: [IsAdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
