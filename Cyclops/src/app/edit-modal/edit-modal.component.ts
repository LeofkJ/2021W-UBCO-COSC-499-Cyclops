import { Component, OnInit } from '@angular/core';
import { ModalController,NavParams } from '@ionic/angular';
@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
})
export class EditModalComponent implements OnInit {

  contentModal: any ={};
  constructor( 
    public modalController: ModalController,
    private navParams:NavParams
    ) { 
        this.contentModal = this.navParams.data;

    }

  ngOnInit() {}

  onclose() {
    this.modalController.dismiss();
  } 

  submit() {
    this.modalController.dismiss(this.contentModal)

    
  }
}
