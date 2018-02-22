import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {User} from '../../assets/models/interfaces/User';
import {UserProvider} from '../../providers/tables/user/user';
import {CameraProvider} from '../../providers/utility/camera/camera';
import {LoaderProvider} from '../../providers/utility/loader/loader';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userTemp = {} as User;
  lock = false;

  constructor(private cameraProvider: CameraProvider, private loaderProvider: LoaderProvider, private userProvider: UserProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.initUser();


    this.cameraProvider.initStartUpImage(this.userTemp.photoUrl);
  }

  initUser() {
    this.userTemp = {} as User;
    this.userTemp.name = '';
    this.userTemp.edited = false;
    this.userTemp.photoUrl = this.cameraProvider.userDefault;
  }

  chooseImage() {
    this.cameraProvider.presentChoice();
  }

  update() {
    this.lock = true;
    if (this.userTemp.photoUrl != this.cameraProvider.base64Image) {
      this.cameraProvider.uploadImage(this.cameraProvider.userImgRef).then((url: any) => {
        this.userTemp.photoUrl = url;
        this.updateFurther();
      }).catch((err) => {
        this.lock = false;
      });
    }
    else {
      this.updateFurther();
    }
  }

  updateFurther() {
    this.userProvider.updateUser(this.userTemp).then((res) => {
      this.navCtrl.push("TabsPage");
      this.lock = false;
    })
      .catch((err) => {
        this.lock = false;
      })

  }

}