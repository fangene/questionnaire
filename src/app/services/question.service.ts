
import { Injectable } from "@angular/core";
import { MdDialogConfig, MdDialog } from "@angular/material";
import { AddQuestionModalComponent } from "../add-question-modal/add-question-modal.component";

@Injectable()
export class QuestionService {

    constructor(public dialog: MdDialog) {

    }

    public addQuestion() {
        let config: MdDialogConfig = {
            width: '750px'
        }
        let dialogRef = this.dialog.open(AddQuestionModalComponent, config);

        return dialogRef.afterClosed();
    }
}