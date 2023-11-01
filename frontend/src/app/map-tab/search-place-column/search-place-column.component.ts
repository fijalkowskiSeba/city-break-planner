import { Component } from '@angular/core';

@Component({
  selector: 'app-search-place-column',
  templateUrl: './search-place-column.component.html',
  styleUrls: ['./search-place-column.component.css']
})
export class SearchPlaceColumnComponent {
  inputData: string = '';
  serverData: any = null;

  fetchData() {
    // Call your API here with this.inputData
    // Example:
    // YourService.getData(this.inputData).subscribe(data => {
    //   this.serverData = data;
    // });
  }
}
