import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GroupProvider} from '../../../providers/tables/group/group';

@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public groupProvider: GroupProvider) {
  }

  publicChat() {
    this.navCtrl.push("ChatPage", {"title": "Public Chat", "receiver": "public"});
  }

  groupChat() {
    this.navCtrl.push("ChatPage", {"title": "Group Chat", "receiver": this.groupProvider.userGroupId});
  }

  joinGroup() {
    this.navCtrl.push("GroupListPage");
  }

}