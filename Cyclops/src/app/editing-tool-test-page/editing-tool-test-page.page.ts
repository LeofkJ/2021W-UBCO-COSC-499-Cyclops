import { Component, OnInit, ViewChild } from '@angular/core';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { displayArticle, segmentItem } from '../sharedData/displayArticle';
import { displayArticles } from '../sharedData/displayArticles';
import { ActivatedRoute } from '@angular/router';
// import { Content } from '@angular/compiler/src/render3/r3_ast';
import { FirebaseService } from '../FirebaseService/firebase.service';
import { AlertController, LoadingController, NavController, ModalController } from '@ionic/angular';
import { SearchAddEcoSolutionsPage } from './search-add-eco-solutions/search-add-eco-solutions.page';


@Component({
  selector: 'app-editing-tool-test-page',
  templateUrl: './editing-tool-test-page.page.html',
  styleUrls: ['./editing-tool-test-page.page.scss'],
})
export class EditingToolTestPagePage implements OnInit {
  @ViewChild('editor') editorComponent: CKEditorComponent;

  // @ViewChild('titleInput') 
  // @Input("content") protected content: Content;

  // testTitleClass:string = "focusClass";//an attempt to set properties using [ngClass]
  //needSaving describes if the current version is the latest version
  needSaving: boolean = false;

  //get access to all the articles
  contents: EditPageArticle;
  // Update how we fetch contents, now using receiveSegment()

  //sepcify the segment section
  currentSeg: number;
  //get access to a specific article (with the provided id passes from page space la)
  articleId: String;
  //specify data for CKEditor
  public model;
  //get ionic input data
  TitleInput: string;
  navControl: NavController;
  checkedSolutions: any[];
  checkedIds: any[];
  allSolutions: any[];
  progressAlertMessage: string;


  //Import the editor build in your Angular component and assign it to a public property to make it accessible from the template
  // public Editor = ClassicEditor;
  public Editor = InlineEditor;

  constructor(
    private activatedrouter: ActivatedRoute,
    public firebaseService: FirebaseService,
    public alertController: AlertController,
    public navCtrl: NavController,
    private modalCtrol: ModalController,
    public loadingController: LoadingController
  ) {
    this.navControl = navCtrl;
    //we start reading the first element
    this.currentSeg = 0;
    //fetch article id from the other side and store it in articleId
    this.articleId = this.activatedrouter.snapshot.paramMap.get('docId');
  }

  ngOnInit() {
    this.loadEditorDataById();//update data by id
    this.contentLoading();
    this.presentAlert();
  }

  updateDataById(docId, data) {
    this.firebaseService.updateDataByIdService(docId, data).then((res: any) => {
    }).catch((error) => {
      this.alertMessage('Failed to save changes, Try again! ');
      console.log("error", error);
    })
  }
  async alertMessage(message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: message,
      buttons: ['Ok']
    });
    await alert.present();
  }

  loadEditorDataById() {
    this.firebaseService.getDataByIdService(this.articleId).subscribe(
      e => {
        this.contents = {
          title: e.payload.data()['title'],
          image: e.payload.data()['image'],
          segment: e.payload.data()['segment'],
          solutions: e.payload.data()['solutions'],
          solSegment: e.payload.data()['solSegment']
        };
        this.checkedIds = this.contents.solutions;//contents.solutions hold the checkedIds
        if (this.contents.segment.length == 0) {
          //this is persumably a new Segment with no segment component, so we increase a new one
          console.log("***Unexpected error: article with zero segments")
          this.onChipAdd();
        }
        this.model = {//model specifies the information the page would get
          editorData: this.contents.segment[this.currentSeg].segmentBody
        };
        this.TitleInput = this.contents.segment[this.currentSeg].segmentTitle;
        // this.content.addCssClass("no-scroll");
        this.needSaving = false;
        // this.editorComponent.focus;
      },
      err => {
        console.debug(err);
        this.presentErr("err");
      }
    )

  }
  contentLoading() {
    this.firebaseService.getAllEcoSolutionService().subscribe((res) => {
      this.allSolutions = res.map(e => {
        return {
          id: e.payload.doc.id,
          name: e.payload.doc.data()['name'],
          section: e.payload.doc.data()['section'],
          star: e.payload.doc.data()['star'],
          detail: e.payload.doc.data()['detail'],
          checked: false
        }
      })
      /*
      this.checkedIds = [];
      if(this.checkedSolutions){
        for (let i = 0; i < this.checkedSolutions.length; i++) {
          this.checkedIds.push(this.checkedSolutions[i].id);
        }
        for (let i = 0; i < this.searchField.length; i++) {
          let currentSol = this.searchField[i];
          if (this.checkedIds.indexOf(currentSol.id)!=-1) {
            this.searchField[i].checked=true;
          }
        }
      }
      */
      this.updateCheckedSolutions();
    }, (err: any) => {
      console.log(err);
    })
  }

  updateCheckedSolutions() {//update checkedSolutions based on what is in checkedIds
    this.checkedSolutions = [];//reset checked solutions 
    //checkedIds might be undefined or empty, only push content if it's defined or is not empty

    if (this.checkedIds != undefined) {
      for (let i = 0; i < this.allSolutions.length; i++) {
        if (this.checkedIds.indexOf(this.allSolutions[i].id) != -1) {//add only solutions in checkedIds
          this.checkedSolutions.push(this.allSolutions[i]);
        }
      }
    }

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
      // header: '',
      // subHeader: 'Subtitle',
      message: 'This is Article Edit Page. You can edit, add and remove article here.',
      // buttons: ['OK']
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

    // this.model.editorData= this.contents[this.articleId].segment[this.currentSeg].segmentBody;
    // console.log(this.editorComponent.editorInstance);\
    //update the content in the CKEditor
    this.editorComponent.editorInstance.setData(this.contents.segment[this.currentSeg].segmentBody)
    // const el: HTMLElement = document.querySelector('ion-chip');
    // el.style.setProperty('', '#36454f');
  }

  public onChipAdd() {
    // console.log("not implemented yet");
    //include an empty one
    const templateText: segmentItem = {
      segmentTitle: "New Segment",
      segmentBody: "Body Paragraph"
    }
    //add segment to contents
    this.contents.segment.push({
      segmentTitle: "New Segment",
      segmentBody: "Body Paragraph"
    });
    // this.saveChangesLocal();
    //update it to the local one
    this.currentSeg = this.contents.segment.length - 1;
    this.needSaving = true;
    //title input space updates automatically
    //manually update editor input area here
    this.updateArticle();
  }

  public onChange({ editor }: ChangeEvent) {
    // const data = editor.getData();
    // console.log(data);
    const newSegmentBody: string = this.editorComponent.editorInstance.getData();
    //store the data
    this.contents.segment[this.currentSeg].segmentBody = newSegmentBody;
    // console.log("Changes saved locally!");
  }

  onTitleEditorChange() {
    this.contents.segment[this.currentSeg].segmentTitle = this.TitleInput;
    // this.needSaving = true;
    // console.log("need Saving on Title Editor Change");
  }
  titleFocus() {//change saving state to open when title input focused
    this.needSaving = true;
  }
  textAreaFocus() {
    this.needSaving = true;
  }

  updateArticle() {
    this.editorComponent.editorInstance.setData(this.contents.segment[this.currentSeg].segmentBody)
  }

  public async backArticle() {
    if (this.needSaving) {
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
      if (this.currentSeg == this.contents.solSegment) {
        this.contents.solSegment = -1;
        this.contents.solutions = [];//make sure solutions array is empty
      }
      this.currentSeg = 0;
      if (this.contents.segment.length == 0) {
        //empty segment here, increase one
        //this initialized a new Chip
        this.onChipAdd();
        //this updates the CKEditor Directly, this is not good practice
        // this.editorComponent.editorInstance.setData("Body Paragraph");
      }

      this.needSaving = true;
      this.updateArticle();
      // this.updateDataById(this.articleId, this.contents);
      // this.loadEditorDataById();
      // this.displayMessage("Delete Success");
    }
  }

  reloadPage() {
    this.contents = null;
    this.loadEditorDataById();

  }

  searchModalEvent() {
    this.modalCtrol.create({
      component: SearchAddEcoSolutionsPage,
      componentProps: {
        checkedSolutions: this.checkedSolutions
      },
      backdropDismiss: false
    }).then(modalres => {
      modalres.present();
      modalres.onDidDismiss().then(res => {//res returns checked *IDS*
        this.checkedIds = res['data'];
        this.updateCheckedSolutions();//once checkedIds changed, update the displayed solution cards
        this.contents.solutions = this.checkedIds;//save checked *IDS* to database
        this.needSaving = true;
        if (this.contents.solutions) {
          if (this.contents.solutions.length != 0 && (this.contents.solSegment == undefined || (this.contents.solSegment != undefined&&this.contents.solSegment == -1))) {
            this.addSolutionsChip();
          } else if (this.contents.solutions.length != 0 && (this.contents.solSegment !== undefined && this.contents.solSegment != -1)) {//there is already one, move there
            this.currentSeg = this.contents.solSegment;
          } else if (this.contents.solutions.length == 0 && (this.contents.solSegment !== undefined && this.contents.solSegment != -1)) {//nothing selected but there is an eco tab
            this.removeArticle();
          }
        }

      })

    })

  }
  addSolutionsChip() {
    // console.log("not implemented yet");
    //include an empty one
    const templateText: segmentItem = {
      segmentTitle: "ECO Solutions",
      segmentBody: "Body Paragraph"
    }
    //add segment to contents
    this.contents.segment.push({
      segmentTitle: "ECO Solutions",
      segmentBody: "Body Paragraph"
    });
    // this.saveChangesLocal();
    //update it to the local one
    this.currentSeg = this.contents.segment.length - 1;
    this.contents.solSegment = this.currentSeg;
    this.needSaving = true;
    //title input space updates automatically
    //manually update editor input area here
    this.updateArticle();
  }

  colorAssign(color: number) {
    if (color == 2) {
      this.progressAlertMessage = "Doing it!"
      return 'success';
    }
    else if (color == 1) {
      this.progressAlertMessage = "Working on it!"
      return 'warning';
    }
    else if (color == 0) {
      this.progressAlertMessage = "Not doing it!"
      return 'danger';
    }
    else {
      this.progressAlertMessage = "Not applicable"
      return 'medium';
    }

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
      const loading = await this.loadingController.create({
        message: 'Please wait...',
      });
      loading.present();
      // this.saveChangesLocal();
      //we need to show animation to let user know there are changes
      // this.updateDataById(this.articleId, this.contents);

      this.firebaseService.updateDataByIdService(this.articleId, this.contents).then((res: any) => {
        // this.reloadPage();


        this.displayMessage("Upload Success");
        loading.dismiss();
        //change saving state to close
        this.needSaving = false;
      }).catch((error) => {
        loading.dismiss();
        this.alertMessage('Failed to save changes, Try again! ');
        console.log("error", error);
      })

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
  solutions: string[];
  solSegment: number;
}
