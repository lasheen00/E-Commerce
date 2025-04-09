
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule , TranslatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  isLoading: boolean = false;
  msgError:string ="";
  Success:string = "";
  registerForm: FormGroup = this.formBuilder.group({
    name : [null , [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email : [null , [Validators.required, Validators.email]],
    password : [null , [Validators.required, Validators.pattern(/^[A-Z]\w{7}$/)]],
    rePassword : [null , [Validators.required]],
    phone : [null , [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
  })
  // registerForm: FormGroup = new FormGroup({
  //   name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  //   email: new FormControl(null, [Validators.required, Validators.email]),
  //   password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z]\w{7}$/)]),
  //   rePassword: new FormControl(null, [Validators.required]),
  //   phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),

  // }, { validators: this.confirmPassword });

  submitForm(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.sendRegisterForm(this.registerForm.value).subscribe({
        next: (res) => { console.log(res);
        if (res.message == 'success')
        {
          setTimeout(()=>{this.router.navigate(['/login']);} , 500)
          this.Success = res.message;
        };
        this.isLoading = false; },
        error: (err) => { console.log(err);
          this.msgError = err.error.message;
          this.isLoading = false;}
      })
    }
    else{
      this.registerForm?.setErrors({mismatch:true})
      this.registerForm.markAllAsTouched();
    }


  }

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    return password == rePassword ? null : { mismatch: true }

  }


}
