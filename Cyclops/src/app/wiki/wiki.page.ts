import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { AlertController, NavController, IonAccordionGroup } from '@ionic/angular';
import { FirebaseService } from '../FirebaseService/firebase.service';
import { segmentItem } from '../sharedData/displayArticle';
// import { IonAccordionGroup } from '@ionic/angular';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.page.html',
  styleUrls: ['./wiki.page.scss'],
})
export class WikiPage implements OnInit {
  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  @ViewChild('editor') editorComponent: CKEditorComponent;
  needSaving: boolean = false;
  editMode: boolean = true;//edit mode decides whether we are in edit mode or not
  contents: EditPageArticle;
  currentSeg: number;
  articleId: String;
  public model;
  public Editor = InlineEditor;
  navControl: NavController;

  constructor(
    private activatedrouter: ActivatedRoute,
    public firebaseService: FirebaseService,
    public alertController: AlertController,
    public navCtrl: NavController,
  ) {
    this.navControl = navCtrl;
    //we start reading the first element
    this.currentSeg = 0;
    //fetch article id from the other side and store it in articleId
    this.articleId = this.activatedrouter.snapshot.paramMap.get('docId');
  }
  ngOnInit() {
    this.loadEditorDataById();
    // this.presentAlert();
  }
  ngOnDestroy() {
    this.contents = null;
  }
  newEditor() {
    const Edi = InlineEditor;
    return Edi;
  }
  updateDataById(docId, data) {
    this.firebaseService.updateDataByIdService(docId, data).then((res: any) => {
    })
  }
  startPreview() {
    this.editMode = false;
  }
  endPreview() {
    this.editMode = true;
  }
  loadEditorDataById() {
    const subscription = this.firebaseService.getDataByIdService(this.articleId).subscribe(
      e => {
        this.contents = {
          title: e.payload.data()['title'],
          image: e.payload.data()['image'],
          segment: e.payload.data()['segment'],
        };
        if (this.contents.segment.length == 0) {
          //this is persumably a new Segment with no segment component, so we increase a new one
          console.log("***Unexpected error: article with zero segments")
          this.onChipAdd();
        }
        this.model = {//model specifies the information the page would get
          editorData: this.contents.segment[this.currentSeg].segmentBody
        };

        subscription.unsubscribe();
        this.needSaving = false;
        // this.editorComponent.focus;

      },
      err => {
        console.debug(err);
        this.presentErr("err");
      }
    )
  }

  async presentErr(errMessage: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Err',
      subHeader: 'Message:',
      message: 'errMessage',
      // buttons: ['OK']
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'This is Article Edit Page. You can edit, add and remove article here.',
      buttons: ['OK']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role == "cancel") {
    }

  }


  public onChipClick(index: number) {
    // this.saveChangesLocal();
    this.currentSeg = index;
    this.editorComponent.editorInstance.setData(this.contents.segment[this.currentSeg].segmentBody)
  }

  public onChipAdd() {
    const templateText: segmentItem = {
      segmentTitle: "New Segment",
      segmentBody: "Body Paragraph"
    }
    this.contents.segment.push({
      segmentTitle: "New Segment",
      segmentBody: "Body Paragraph"
    });
    this.currentSeg = this.contents.segment.length - 1;
    this.updateArticle();
  }

  public onChange({ editor }: ChangeEvent) {
    // const newSegmentBody: string = this.editorComponent.editorInstance.getData();
    // this.contents.segment[this.currentSeg].segmentBody = newSegmentBody;
    // console.log("Changes saved locally!");
    this.needSaving = true;
  }

  onTitleEditorChange(data: string) {
    // const newTitle: string = document.getElementById(data).value;
    this.needSaving = true;
  }

  updateArticle() {
    this.editorComponent.editorInstance.setData(this.contents.segment[this.currentSeg].segmentBody)
  }

  public async backArticle() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Do you want to go back to main page? All unsaved changes will be lost.',
      buttons: ['Cancel', 'OK']
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role == "cancel") {
    } else {
      this.navControl.back();
    }
  }

  public async removeArticle() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Do you want to remove ' + this.contents.segment[this.currentSeg].segmentTitle + "?",
      buttons: ['Cancel', 'OK']
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role == "cancel") {
    } else {
      this.contents.segment.splice(this.currentSeg, 1);
      this.currentSeg = 0;
      if (this.contents.segment.length == 0) {
        this.onChipAdd();
      }
      this.updateArticle();
    }
  }

  reloadPage() {
    this.contents = null;
    this.loadEditorDataById();
  }

  async saveChangesToCloud() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Do you want to save all changes to Cloud?',
      buttons: ['Cancel', 'OK']
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role == "cancel") {
    } else {
      this.updateDataById(this.articleId, this.contents);
      // this.reloadPage();
      this.displayMessage("Upload Success");
      //change saving state to close
      this.needSaving = false;
    }
  }

  async displayMessage(inputMessage: string) {
    const alert2 = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: inputMessage,
      buttons: ['OK']
    });
    await alert2.present();
  }

}
type EditPageArticle = {
  title: string;
  image: string;
  segment: segmentItem[];
}
