import { Component, OnInit, Input, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { QuestionValue, Question } from '../models/question';
import * as _ from 'lodash';

@Component({
    selector: 'app-add-question-modal',
    templateUrl: './add-question-modal.component.html',
    styleUrls: ['./add-question-modal.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class AddQuestionModalComponent {
    public qTypes = [
        { code: 'boolean', name: 'Boolean' },
        { code: 'multi_multi', name: 'Multi answers with one choice' }
    ];

    public btnText = 'Add';
    public responseTypes = this.buildResponseTypes();
    private result = this.resultType();
    public question: Question = new Question('BOOLEAN', '', this.result.boolean);

    constructor(public dialogRef: MatDialogRef<AddQuestionModalComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
        if (data && data.type) {
            Object.assign(this.question, data);
            this.btnText = 'Save';
            this.responseTypes.forEach(item => {
                item.active = item.id === data.type;
            });
        }
    }

    ngOnInit() {}

    addValue() {
        this.question.values.push(new QuestionValue('', ''));
    }

    save() {
        this.dialogRef.close(this.question);
    }

    selectType() {
        this.question.values = [];
        if (this.question.type === 'boolean') {
            this.question.values.push(new QuestionValue('', ''));
            this.question.values.push(new QuestionValue('', ''));
        }
    }

    onResponseType(responseType) {
        this.responseTypes.forEach(item => {
            item.active = false;
        });

        responseType.active = true;
        this.updateQuestion(responseType);
    }

    addChoiceToQuestion() {
        if (!this.question.values) {
            this.question.values = [];
        }

        if (this.isFullConditional()) {
            return;
        }

        this.question.values.push({
            value: ''
        });
    }

    private updateQuestion(responseType) {
        const widgetValues = responseType.id === 'BOOLEAN' ? this.result.boolean : this.isTextQuestionType() ? this.result.text : [];
        this.question.values = widgetValues;
        this.question.type = responseType.id;
    }

    isQuestionDuplicate() {
        if (!this.question.values || this.question.values.length < 2) {
            return false;
        }
        const filtered = this.question.values.filter(function(item) {
            return item.value && item.value.length;
        }),
            vals = filtered.map(function(v) {
                return v.value.toLowerCase();
            }),
            uniqVals = _.uniq(vals);

        if (uniqVals.length <= 1 && !uniqVals[0]) {
            return false;
        }

        return !_.isEqual(vals, uniqVals);
    }

    isOptionsLess() {
        return !this.question.values || this.question.values.length < 2;
    }

    isOptionsEmpty() {
        let isEmpty = false;

        if (!this.question.values || this.question.values.length < 1) {
            return false;
        }

        this.question.values.forEach(value => {
            if (!value.value) {
                isEmpty = true;
            }
        });

        return isEmpty;
    }

    private isConditionalQuestionType() {
        return this.question.type === 'BOOLEAN';
    }

    private isFullConditional() {
        return this.isConditionalQuestionType() && this.question.values.length >= 2;
    }

    public isChoiseQuestionType() {
        return ['BOOLEAN', 'MULTI_CHOICE_MULTI', 'MULTI_CHOICE_SINGLE'].includes(this.question.type);
    }

    public isTextQuestionType() {
        return ['DATE_TYPE', 'SHORT_ANSWER', 'LONG_ANSWER', 'NUMERICAL'].includes(this.question.type);
    }

    private buildResponseTypes() {
        return [{
            id: 'BOOLEAN',
            name: 'Boolean',
            class: 'boolean',
            active: true
        }, {
            id: 'MULTI_CHOICE_SINGLE',
            name: 'Multiple choice (Single answer)',
            class: 'multiple-choice-single',
            active: false
        }, {
            id: 'MULTI_CHOICE_MULTI',
            name: 'Multiple choice (Multiple answer)',
            class: 'multiple-choice-multiple',
            active: false
        }, {
            id: 'DATE_TYPE',
            name: 'Date',
            class: 'date',
            active: false
        }, {
            id: 'SHORT_ANSWER',
            name: 'Short Answer',
            class: 'short-answer',
            active: false
        }, {
            id: 'LONG_ANSWER',
            name: 'Long Answer',
            class: 'long-answer',
            active: false
        }, {
            id: 'NUMERICAL',
            name: 'Numerical',
            class: 'numerical',
            active: false
        }];
    }

    private resultType() {
        return {
            boolean: [{
                value: 'Yes'
            }, {
                value: 'No'
            }],
            text: [{
                value: ''
            }]
        };
    }
}
