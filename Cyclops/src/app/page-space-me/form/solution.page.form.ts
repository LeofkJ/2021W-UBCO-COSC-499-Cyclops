import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class SolutionPageForm{

    private formBuilder: FormBuilder;
    private form: FormGroup;

    constructor(formBuilder: FormBuilder){
        this.formBuilder = formBuilder;
        this.form = this.createForm();

    }
    private createForm() : FormGroup{
        return this.formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            phoneNumber: ['', [Validators.required]],
            email: ['', [Validators.required]],
            content: ['', [Validators.required]]
        });
    }

    getForm() : FormGroup{
        return this.form;
    }
    

}