import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GameProvider} from '../../../providers/tables/game/game';
import {StatusProvider} from '../../../providers/tables/status/status';
import {UserProvider} from '../../../providers/tables/user/user';
import {SettingProvider} from '../../../providers/setting/setting';
import {ToastProvider} from '../../../providers/utility/toast/toast';
import {LoaderProvider} from '../../../providers/utility/loader/loader';
import {ModalController} from 'ionic-angular';
import {GalleryModal} from 'ionic-gallery-modal';

@IonicPage()
@Component({
  selector: 'page-puzzle-solve',
  templateUrl: 'puzzle-solve.html',
})
export class PuzzleSolvePage {
  puzzleId = '';
  lock = false;
  answerTemp = '';

  constructor(private modalCtrl: ModalController, private loaderProvider: LoaderProvider, private toastProvider: ToastProvider, private settingProvider: SettingProvider, private userProvider: UserProvider, private gameProvider: GameProvider, private statusProvider: StatusProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.puzzleId = this.navParams.get('puzzleId');
    if (this.statusProvider.puzzleStatus[this.puzzleId] == null) {
      this.navCtrl.pop();
    }
    this.answerTemp = '';
  }

  openImage() {
    var photos = [];
    photos.push({
      url: this.gameProvider.puzzleDetails[this.puzzleId].photoUrl
    })
    let modal = this.modalCtrl.create(GalleryModal, {
        photos: photos,
        initialSlide: 0
      })
    ;
    modal.present();
  }


  checkAnswer(): boolean {
    var correctAnswer = this.gameProvider.puzzleDetails[this.puzzleId].answer.trim().toLowerCase();
    var strictFlag = this.gameProvider.puzzleDetails[this.puzzleId].strictAnswer;
    //ignore space, lower case only
    var cookedAnswer = this.answerTemp.trim().toLowerCase();
    if (strictFlag) {
      return correctAnswer == cookedAnswer;
    } else {
      //cookedAnswer match 80% of correct answer length, correct answer contains cookedAnswer, or cookedAnswer contains correct answer
      return (cookedAnswer.length >= 0.8 * correctAnswer.length && (cookedAnswer.indexOf(correctAnswer) >= 0 || correctAnswer.indexOf(cookedAnswer) >= 0))
    }
  }

  answerPuzzle() {

    if (!this.checkAnswer()) {
      this.toastProvider.showToast("Oops, wrong answer, try again");
      return
    }
    this.lock = true;
    this.loaderProvider.showLoader("Correct answer, updating!");
    this.statusProvider.answerPuzzle(this.puzzleId).then((res) => {
      this.statusProvider.changePoint(this.statusProvider.answerPoint).then((res) => {
        this.lock = false;
        this.loaderProvider.dismissLoader();
        if (res) {
          this.navCtrl.pop();
        }
      }).catch((err) => {
        this.lock = false;
        this.loaderProvider.dismissLoader();
      });
    }).catch((err) => {
      this.lock = false;
      this.loaderProvider.dismissLoader();
    });
  }

  viewHint1() {
    if (this.checkPoint()) {
      this.lock = true;
      this.loaderProvider.showLoader("Hint will be uncovered");
      this.statusProvider.viewHint1(this.puzzleId).then((res) => {
        this.statusProvider.changePoint(this.statusProvider.hintPoint).then((res) => {
          this.lock = false;
          this.loaderProvider.dismissLoader();
        }).catch((err) => {
          this.lock = false;
          this.loaderProvider.dismissLoader();
        });
      }).catch((err) => {
        this.lock = false;
        this.loaderProvider.dismissLoader();
      });
    }
  }

  viewHint2() {
    if (this.checkPoint()) {
      this.lock = true;
      this.loaderProvider.showLoader("Hint will be uncovered");
      this.statusProvider.viewHint2(this.puzzleId).then((res) => {
        this.statusProvider.changePoint(this.statusProvider.hintPoint).then((res) => {
          this.lock = false;
          this.loaderProvider.dismissLoader();
        }).catch((err) => {
          this.lock = false;
          this.loaderProvider.dismissLoader();
        });
      }).catch((err) => {
        this.lock = false;
        this.loaderProvider.dismissLoader();
      });
    }
  }

  checkPoint() {
    if (this.statusProvider.groupStatus.point < 20) {
      //to do
      return false
    }
    return true;
  }
}