import {ChangeDetectorRef, Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth';
import {Button, ButtonModule} from 'primeng/button';
import {InputText, InputTextModule} from 'primeng/inputtext';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, Button, InputTextModule],
    templateUrl: './profile.page.html',
    styleUrls: [
        './profile.page.css',
        // '../sign-in/signin.page.css',
        '../sign-up/signup.page.css'
    ]
})
export class ProfilePage {

    authService = inject(AuthService);
    readonly user = inject(AuthService).currentUser;
    private readonly router = inject(Router);
    http = inject(HttpClient);
    private readonly fb = inject(FormBuilder);


    previewUrl: string = this.user()!.picture;

    isInEdit: boolean = false;
    inWaiting = signal(false);
    isWaiting = computed(() => this.inWaiting());
    readonly message = signal('');
    readonly errorMessage = signal('');

    readonly form = this.fb.nonNullable.group({
        fullName: [this.user()?.username],
        mobilenumber: [this.user()?.mobile],
        email: [this.user()?.email, Validators.email],
        currentPassword: [''],
        newPassword: ['', [Validators.minLength(8)]],
        confirmPassword: ['']
    });

    errors: any = {}
    visibility: any = {
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    };

    profileImageFile: File | null = null;
    isInChangePassword: boolean = false;


    constructor(private cdr: ChangeDetectorRef) {}


    onProfileImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement;

        if (!input.files || input.files.length === 0) {
            return;
        }

        const file = input.files[0];

        if (!file.type.startsWith('image/')) {
            alert('Puoi caricare solo immagini');
            return;
        }

        const maxSizeMb = 5;
        if (file.size > maxSizeMb * 1024 * 1024) {
            alert(`Immagine troppo grande. Massimo ${maxSizeMb}MB`);
            return;
        }

        this.profileImageFile = file;

        const reader = new FileReader();
        reader.onload = () => {



            this.previewUrl = reader.result as string;
            console.log( this.previewUrl );
            this.cdr.detectChanges();

        };

        reader.readAsDataURL(file);
    }


    async submit(): Promise<void> {


        this.errors = {};
        let value: any = this.form.getRawValue();
        console.log(value);

        if (value.newPassword !== value.confirmPassword) {
            // console.log('Le password non coincidono.');
            // console.log(this.form.getRawValue());
            // console.log(this.form.controls.password.value);
            // console.log(this.form.controls.password.getRawValue());
            // console.log(this.form.controls.confirmPassword.value);
            // console.log(this.form.controls.confirmPassword.getRawValue());

            this.errors.confirmPassword = 'Le password non coincidono.'

            // this.message.set('Le password non coincidono.');
            // return;
        }

        if(!this.previewUrl) {
            this.errors.profilePicture = 'Manca límmagine di profilo'
            // return;
        }

        /*
        {
            "fullName": "Vito Lipari",
            "mobilenumber": "3281368113",
            "email": "vito@mail.com",
            "password": "poipoipoi",
            "confirmPassword": "poipoipoi"
        }
         */
        value.profilePicture = this.previewUrl;
        value.id = this.user()?.id;
        value.isInChangePassword = this.isInChangePassword;

        if (this.form.invalid) {
            // this.form.markAllAsTouched();

            console.log( 'form is NOT valid' );
            console.log( this.form );

            Object.entries(this.form.controls)
                .filter(([field, control]) => (!!control.errors))
                .filter(([field, control]) => (field !== 'confirmPassword'))
                .map(([field, control]) => {
                    // console.log(field, control.errors);
                    // console.log(Object.entries(control.errors));
                    this.errors[ field ] = Object.keys(control.errors ?? {}).join(', ');
                    // this.errors[ field ] = 'error';
                })

            // firstValueFrom(this.http.post('/user/signin', this.form))

            // return;
        }

        if( Object.keys(this.errors).length > 0 ) {
            return;
        }


        this.inWaiting.set(true);
        // this.message.set('');
        // this.inWaiting = true;

        try {
            // const response = await this.authService.signUp(value);
            // console.log('response di signup');
            // console.log( response );


            this.authService.editProfile(value)
                .then((response: any) => {
                    console.log('edit profile response');
                    console.log(response);

                    // this.authService.saveLoggedUser( response.user );
                    // this.authService.saveToken( response.accessToken );

                    this.authService.updateCurrentUser(value);

                    this.inWaiting.set(false);
                    this.isInEdit = false;

                    // TODO

                })
                .catch((e: any) => {
                    console.log('errore della promise di edit');
                    console.log(e);

                    let err = e;
                    if( typeof e === 'string' ) {

                    }
                    else {
                        if( !!e.code ) {
                            err = e.code;
                        }
                    }


                    // alert(err);
                    if( err.toLowerCase().trim().indexOf('email') !== -1 ) {
                        this.errors.email = err;
                    }
                    if( err.toLowerCase().trim().indexOf('phone') !== -1 ) {
                        this.errors.mobilenumber = err;
                    }
                    if( err.toLowerCase().trim().indexOf('mobile') !== -1 ) {
                        this.errors.mobilenumber = err;
                    }
                    if( err.toLowerCase().trim().indexOf('number') !== -1 ) {
                        this.errors.mobilenumber = err;
                    }
                    if( err.toLowerCase().trim().indexOf('unique') !== -1 ) {
                        this.errors.mobilenumber = 'Numero Esistente';
                    }
                    if( err.toLowerCase().trim().indexOf('password') !== -1 ) {
                        this.errors.currentPassword = err;
                    }


                    // TODO controllo sessione scaduta

                    // TODO controllo sessione inesistente


                    // TODO gestire l'errore generale

                    this.inWaiting.set(false);
                })


            // debugger;
            // await this.router.navigate(['/access/confirm'], {
            //     queryParams: {email: value.email}
            // });

        } catch {
            console.log('errore');
            this.message.set('Registrazione non riuscita.');
        } finally {
            // this.inWaiting.set(false);
        }
    }

    toggleVisibility(field: string) {
        this.visibility[ field ] = !this.visibility[ field ];
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/dashboard']);
    }

    edit() {
        this.isInEdit = true;
    }
}
