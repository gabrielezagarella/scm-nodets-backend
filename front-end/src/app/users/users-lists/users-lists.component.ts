import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";

import { environment } from "src/environments/environment";

import { UsersService } from "../users.service";

import User from "src/app/interfaces/user.model";
import { IList } from "src/app/interfaces/list.model";
import { IListCardModel } from "src/app/interfaces/list-card.model";

@Component({
  selector: "app-users-lists",
  templateUrl: "./users-lists.component.html",
  styleUrls: ["./users-lists.component.scss"]
})
export class UsersListsComponent implements OnInit {
  isHidden = true;
  users: User[] = [];
  usersPath = `${environment.usersPath}`;
  @Output() showUserById = new EventEmitter<{
    _id: string;
    action: string;
  }>();
  @Input() isNavigable = true;
  @Input() listTemplate: IListCardModel;

  constructor(private usersService: UsersService, private router: Router) {}

  async ngOnInit() {
    this.users = await this.usersService.getUsers();
  }

  mapUserListDetails() {
    const usersMapped: IList[] = this.users.map(user => {
      return {
        _id: user._id,
        title: `${user.name} ${user.surname}`,
        description: user.fiscalCode,
        buttons: ["Show", "Delete", "Edit"]
      };
    });
    return usersMapped;
  }

  async onActionToUser(action: { _id: string; action: string }) {
    console.log(action.action);
    if (this.isNavigable) {
      this.router.navigate([`/${this.usersPath}/${action._id}`]);
    } else if (action.action === "Show") {
      this.showUserById.emit(action);
    } else if (action.action === "Delete") {
      await this.usersService.deleteUserById(action._id);
      this.users.map((user, index) => {
        if (user._id === action._id) {
          this.users.splice(index, 1);
        }
      });
    }
  }
}
