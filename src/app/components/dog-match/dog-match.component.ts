import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { DogsService } from 'src/app/services/dogs.service';
import { Dog } from 'src/app/utils/models';

@Component({
  selector: 'app-dog-match',
  templateUrl: './dog-match.component.html',
  styleUrls: ['./dog-match.component.scss']
})
export class DogMatchComponent {
  dog$: Observable<Dog>;
  isImageLoadingError = false;
  constructor(@Inject(MAT_DIALOG_DATA) public matchedDogId: string, private readonly dogService: DogsService) {
    this.dog$ = this.dogService.getDogDetails([matchedDogId]).pipe(map(res => res[0]));
  }
}
