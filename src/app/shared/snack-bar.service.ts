import { inject, Injectable, signal } from '@angular/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

public message = signal('');

private _snackBar = inject(MatSnackBar);

public durationInMiliSecs = 3000;

//barra de notificação declarada no topo do lado esquerdo da tela

public horizontalPosition: MatSnackBarHorizontalPosition = 'end'; //end = final da tela (lado direito)

public verticalPosition: MatSnackBarVerticalPosition = 'top'; //top = declarado no topo da tela

public showSnackBar(
  message: string,
  duration: number,
  horizontalPosition: MatSnackBarHorizontalPosition,
  verticalPosition: MatSnackBarVerticalPosition
): void{
  this.message.set(message);
  this.durationInMiliSecs = duration;
  this.horizontalPosition = horizontalPosition;
  this.verticalPosition = verticalPosition;

  this._openSnackBar();
}

private _openSnackBar(): void{
  this._snackBar.open(this.message(), '❌', {
    duration: this.durationInMiliSecs,
    horizontalPosition: this.horizontalPosition,
    verticalPosition: this.verticalPosition,
})
}
}
