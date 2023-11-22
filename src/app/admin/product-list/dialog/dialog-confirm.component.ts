import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogType } from '../../../dialogtype';


@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})



export class DialogConfirmComponent  {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogType,
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
