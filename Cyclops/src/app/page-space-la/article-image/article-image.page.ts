import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { FirebaseService } from 'src/app/FirebaseService/firebase.service';

@Component({
  selector: 'app-article-image',
  templateUrl: './article-image.page.html',
  styleUrls: ['./article-image.page.scss'],
})
export class ArticleImagePage implements OnInit {
  articleId: string;
  constructor(
    public modalController: ModalController,
    private navParams: NavParams,
    public firebaseService: FirebaseService,
    public loadingController: LoadingController,
    public alertController: AlertController,
  ) {
    this.articleId = this.navParams.data.content;//fetch id from database
  }

  ngOnInit() {
  }
  async clickImageEvent(name) {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    loading.present();  // present loading animation
    const contents = {
      image: name,
    }
    //set changes to local
    this.firebaseService.updateDataByIdService(this.articleId, contents).then((res: any) => {
      console.log("Changes saved to cloud!", res);//log success mesage to console
      this.alertMess("Card Cover Change Success");//tell the user the success message
      loading.dismiss();//close loading animation
      //local saving
      this.modalController.dismiss();//close modal
      //remote saving complete
    }).catch((error) => {
      loading.dismiss();
      this.alertMess('Failed to save changes, Try again!');
      console.log("error", error);
    })

  }
  async alertMess(message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      subHeader: '',
      message: message,
      buttons: ['Ok']
    });
    await alert.present();
  }
  dismissModal() {
    this.modalController.dismiss();
  }

  listP = [
    '../assets/1.jpg',
    '../assets/2.jpg',
    '../assets/3.jpg',
    '../assets/4.jpg',
    '../assets/5.jpg',
    '../assets/6.jpg',
    '../assets/7.jpg',
    '../assets/8.jpg',
    '../assets/9.jpg',
    '../assets/10.jpg',
    '../assets/11.jpg',
    '../assets/12.jpg',
    '../assets/13.jpg',
    '../assets/14.jpg',
    '../assets/15.jpg',
    '../assets/16.jpg',
    '../assets/17.jpg',
    '../assets/18.jpg',
    '../assets/19.jpg',
    '../assets/20.jpg',
    '../assets/21.jpg',
    '../assets/22.jpg',
    '../assets/23.jpg',
    '../assets/24.jpg',
    '../assets/25.jpg',
    '../assets/26.jpg',
    '../assets/27.jpg',
    '../assets/28.jpg'];
}
