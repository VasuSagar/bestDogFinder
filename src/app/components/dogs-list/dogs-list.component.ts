import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject, Subject, filter, map, takeUntil } from 'rxjs';
import { DogsService } from 'src/app/services/dogs.service';
import { LoginService } from 'src/app/services/login.service';
import { Dog, DogIdQueryParams } from 'src/app/utils/models';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DogMatchComponent } from '../dog-match/dog-match.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dogs-list',
  templateUrl: './dogs-list.component.html',
  styleUrls: ['./dogs-list.component.scss']
})
export class DogsListComponent implements OnInit, OnDestroy {
  @ViewChild('paginator') paginator!: MatPaginator;
  dogsIds: string[] = [];
  displayedColumns: string[] = ['select', 'name', 'breed', 'img', 'age', 'zip_code'];
  dogsDataSource = new MatTableDataSource<Dog>([]);
  dogBreeds: string[] = [];
  filteredDogBreeds: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  selectedDogBreed: FormControl<any> = new FormControl<string[]>([]);
  private onDestroy$ = new ReplaySubject<void>(1);
  isLoading = false;
  totalElementLength = 0;
  sortField = "breed";
  sortDirection = "asc";
  dogIdQueryParams: DogIdQueryParams = {
    size: 10,
    breeds: this.selectedDogBreed.value,
    sort: `${this.sortField}:${this.sortDirection}`,
    from: 0,
    ageMin: 0,
    ageMax: 15
  }
  dogSelectionModel = new SelectionModel<Dog>(true, []);
  dogBreedSearchCritera: FormControl<any> = new FormControl<string>("");
  dogFilterForm = this.formBuilder.group({
    minAge: [0, [Validators.min(0), Validators.max(15)]],
    maxAge: [15, [Validators.min(0), Validators.max(15)]],
    selectedDogBreed: [[]],
  });

  constructor(private readonly formBuilder: NonNullableFormBuilder, private readonly dogService: DogsService, public dialog: MatDialog, private readonly loginService: LoginService, private readonly router: Router) { }

  ngOnInit(): void {
    this.dogBreedSearchCritera.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.filterDogsViaBreeds();
      });

    this.dogFilterForm.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.dogIdQueryParams.from = 0;
        this.paginator.pageIndex = 0;
        this.dogIdQueryParams.breeds = this.dogFilterForm.controls['selectedDogBreed'].value;
        this.dogIdQueryParams.ageMax = Math.trunc(this.dogFilterForm.controls['maxAge'].value);
        this.dogIdQueryParams.ageMin = Math.trunc(this.dogFilterForm.controls['minAge'].value);
        if (this.dogFilterForm.valid) {
          this.getDogIdsFromApi();
        }
      });
    this.getDogIdsFromApi();
    this.dogService.getDogBreeds().subscribe(data => {
      this.dogBreeds = data;
      this.filteredDogBreeds.next(this.dogBreeds.slice())
    });
  }

  getDogIdsFromApi() {
    this.dogService.getDogIds(this.dogIdQueryParams).subscribe(data => {
      this.dogsIds = data.resultIds.slice(0, 100);
      this.totalElementLength = data.total;
      this.getDogsDetails();
    });
  }

  getDogsDetails() {
    this.isLoading = true;
    this.dogService.getDogDetails(this.dogsIds).subscribe(dogsDetails => {
      dogsDetails.forEach(dogDetail => {
        dogDetail.isImageLoading = true;
        dogDetail.isImageLoadingError = false
      })
      this.isLoading = false;
      this.dogsDataSource.data = dogsDetails;

      const itemsToAdd = this.dogsDataSource.data.
        filter(item => {
          const foundItem = this.dogSelectionModel.selected.find(selectedItem => selectedItem.id === item.id);
          if (!foundItem) return;
          this.dogSelectionModel.deselect(foundItem);
          return item;
        });
      this.dogSelectionModel.select(...itemsToAdd);
    });
  }

  filterDogsViaBreeds() {
    if (!this.dogBreeds) {
      return;
    }
    let search = this.dogBreedSearchCritera.value;
    if (!search) {
      this.filteredDogBreeds.next(this.dogBreeds.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredDogBreeds.next(
      this.dogBreeds.filter(breed => breed.toLowerCase().indexOf(search) > -1)
    );
  }

  onPaginationChanged(event: PageEvent) {
    this.dogIdQueryParams.size = event.pageSize;
    this.dogIdQueryParams.from = event.pageSize * event.pageIndex;
    this.getDogIdsFromApi()
  }

  tableSortChange(sortState: Sort) {
    this.sortField = sortState.active;
    this.sortDirection = sortState.direction;
    this.dogIdQueryParams.sort = this.sortDirection ? `${this.sortField}:${this.sortDirection}` : "";
    this.getDogIdsFromApi();
  }

  getPageData() {
    return this.dogsDataSource._pageData(this.dogsDataSource._orderData(this.dogsDataSource.filteredData));
  }

  isEntirePageSelected() {
    return this.getPageData().every((row) => this.dogSelectionModel.isSelected(row));
  }

  masterToggle(): void {
    this.isEntirePageSelected() ?
      this.dogSelectionModel.deselect(...this.getPageData()) :
      this.dogSelectionModel.select(...this.getPageData());
  }


  getDogsMatch(): void {
    const selectedDogsId = this.dogSelectionModel.selected.map(dog => dog.id);
    this.dogService.getDogMatch(selectedDogsId).subscribe(data => {
      this.dialog.open(DogMatchComponent, {
        data: data.match
      });
    });
  }

  logout(): void {
    this.loginService.logout().subscribe(() => {
      this.loginService.clearIsAuthorized();
      this.router.navigate(['login']);
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
