import { Injectable } from '@angular/core';
import { AsyncValidator, FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root'
})
export class UniqueEmail implements AsyncValidator {
    constructor(private authService: AuthService) {};
    validate = (control: FormControl) => {
        const { value } = control;
        return this.authService.emailAvailable(value).pipe(
            map(value => {
                if(value.available) return null;
                /*  But we can just return null because if it is not 
                    true it won't get to the map function and it will
                    skip it to the catchError() function
                 */
            }),
            catchError((error) => {
                if(error.error.available === false) {
                    return of({nonUniqueEmail: true});
                } else if (error.status === 0) {
                    return of({noConnection: true})
                } else {
                    return null;
                }
            })
        )
    }
}