import { Component, OnInit, Input } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/FirebaseService/firebase.service';
import { segmentItem } from '../../sharedData/displayArticle';
import { ArticleEditPagePage } from '../article-edit-page/article-edit-page.page';
// import { ArticleEditComponent } from '../article-edit/article-edit.component';
import { AuthService } from '../../authentication/auth/auth.service';
import { ArticleImagePage } from '../article-image/article-image.page';
import { deleteField } from 'firebase/firestore';
import { solutionItem } from 'src/app/sharedData/ecoData';

@Component({
  selector: 'app-article-main',
  templateUrl: './article-main.component.html',
  styleUrls: ['./article-main.component.scss'],
})
export class ArticleMainComponent implements OnInit {
  @Input() contentCol: fetchArticle[];
  @Input() editMode: boolean;
  @Input() col: string;
  constructor(
    public alertController: AlertController,
    private modalCtrol: ModalController,
    public loadingController: LoadingController,
    public firebaseService: FirebaseService,
    public authService: AuthService,
  ) { }
  ngOnInit() { }

  async articleRemoveEvent(aIndex: number, content: fetchArticle) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Do you want to remove this article card along with all its content? This action cannot be undone.',
      buttons: ['Cancel', 'Yes']
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role == "cancel" || role == "backdrop") {
    } else {
      const loading = await this.loadingController.create({
        message: 'Please wait...',
      });
      loading.present();  // present loading animation

      this.contentCol.splice(aIndex, 1);//remove locally
      this.firebaseService.deleteDocByIdService("articles", content.id).then((res: any) => {
        this.removeUserReadArticles(content.id);
      }, (err: any) => {
        console.log(err); loading.dismiss();
      });//remove remotelly
      loading.dismiss();
    }
  }

  async removeUserReadArticles(docId) {
    let users = this.firebaseService.getAllUsersDataService();
    let segments: any[] = [];

    (await users).forEach((userDoc) => {
      segments = userDoc.data()['readArticles'];
      for (let i = 0; i < segments.length; i++) {

        if (segments[i].id == docId) {
          segments.splice(i, 1);
          break;
        }
        
      }
      if(userDoc.data()['latestRead']){
        if (docId == userDoc.data()['latestRead'].id){
          this.firebaseService.updateUserCollectionDataByIdService(userDoc.id, {latestRead:deleteField() });
        }
      }
      this.firebaseService.updateUserCollectionDataByIdService(userDoc.id, { readArticles: segments });
      
      /*let segmentRead = Array(segmentLength).fill(false);
      
      segments.push(newData);
      */

    });
  }

  articleAddEvent() {
    const newArticle: fetchArticle = {
      id: "",
      title: 'New Card Title',
      subtitle: '',
      image: '../assets/pic' + this.getRandomInt(1, 9) + '.jpg',
      cardIntroduction: 'New Card Introduction',
      columnName: this.col,
      segment: [{
        segmentTitle: "Sample Title",
        segmentBody: `<p>Sample Body</p>`
      }, {
        segmentTitle: "Sample Title",
        segmentBody: `<p>Sample Body</p>`
      }],
      solSegment: -1,
      solutions: [],
    }
    this.contentCol.push(newArticle);
    //update all user profiles read article tracker with new article
    this.firebaseService.addDataService("articles", newArticle).then((res: any) => {
      this.addUserReadArticles(res.id, newArticle.segment.length);
    })

  }
  async addUserReadArticles(docId, segmentLength) {
    let users = this.firebaseService.getAllUsersDataService();
    let segments: any[] = [];

    (await users).forEach((userDoc) => {
      segments = userDoc.data()['readArticles'];
      let segmentRead = Array(segmentLength).fill(false);
      let newData = { id: docId, segment: segmentRead };
      segments.push(newData);
      this.firebaseService.updateUserCollectionDataByIdService(userDoc.id, { readArticles: segments });

    });
  }


  coverEditEvent(aId: string) {
    this.modalCtrol.create({
      component: ArticleImagePage,
      componentProps: {
        content: aId,
      }
    }).then(modalres => {
      modalres.present();
      modalres.onDidDismiss().then(res => {
      })

    })
  }

  articleEditEvent(aId: string) {
    this.modalCtrol.create({
      component: ArticleEditPagePage,
      componentProps: {
        content: aId,
      }
    }).then(modalres => {
      modalres.present();

      modalres.onDidDismiss().then(res => {
      })

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

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

}
type fetchArticle = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cardIntroduction: string;
  columnName: string;
  segment: segmentItem[];
  solSegment: number;
  solutions: solutionItem[];
}