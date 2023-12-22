import {Component} from '@angular/core';
import {TripService} from "../../../services/trip.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Trip} from "../../../models/db models/Trip";
import {ErrorModalComponent} from "../../modals/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {TripPoint} from "../../../models/db models/TripPoint";
import {AddBillModalComponent} from "../../modals/add-bill-modal/add-bill-modal.component";
import {TripPointService} from "../../../services/trip-point.service";
import {TripBill} from "../../../models/db models/TripBill";

@Component({
  selector: 'app-trip-history',
  templateUrl: './trip-history.component.html',
  styleUrls: ['./trip-history.component.css']
})
export class TripHistoryComponent {
  trip?: Trip;
  waitingForData: boolean = true;
  rightColumnDisplay: string = 'bills';


  constructor(private tripService: TripService,
              private tripPointService: TripPointService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit() {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.tripService.getTripById(id).subscribe({
      next: trip => this.whenTripIsFetched(trip),
      error: error => this.handleFetchError(error)
    })
  }

  private whenTripIsFetched(trip: Trip) {
    this.trip = trip;
    this.trip.tripPoints.sort((a, b) => a.orderInTrip - b.orderInTrip);
    this.waitingForData = false;
  }

  private handleFetchError(error: any) {
    if (error.status === 404) {
      this.openErrorModal(error.error);
    } else {
      console.error('Error:', error);
    }
  }

  openErrorModal(errorMessage: string): void {
    this.dialog.open(ErrorModalComponent, {
      width: '400px',
      data: {
        title: 'Error',
        message: errorMessage,
        redirectPath: '/my-trips',
        buttonLabel: 'Go back to my trips'
      }
    });
  }

  onAddPhoto() {

  }

  onAddComment() {

  }

  onAddBill(tripPoint: TripPoint) {
    const dialogRef = this.dialog.open(AddBillModalComponent, {
      width: '400px',
      data: {
        modalTitle: 'Add bill to',
        tripPoint: tripPoint,
        billForm: {
          name: '',
          price: 0,
          currency: ''
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tripPointService.addBillToTripPoint(tripPoint.id, result).subscribe({
          next: result => {tripPoint.tripBills.push(result as TripBill)},
          error: error => this.handleAddBillError(error)
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/my-trips', this.trip?.id]);
  }

  onToggleChange() {
    //console.log(this.rightColumnDisplay);
  }

  private handleAddBillError(error: any) {
    this.dialog.open(ErrorModalComponent, {
      width: '400px',
      data: {
        title: 'Error',
        message: error.error.error, //TODO change after backend is done
        redirectPath: '',
        buttonLabel: 'OK'
      }
    });
  }

  onDeleteBill(tripPoint: TripPoint, bill: TripBill) {
    tripPoint.tripBills = tripPoint.tripBills.filter(b => b !== bill);
    this.tripPointService.deleteBillFromTripPoint(bill.uuid).subscribe();
  }

  onEditBill(tripPoint: TripPoint, bill: TripBill) {
    const dialogRef = this.dialog.open(AddBillModalComponent, {
      width: '400px',
      data: {
        modalTitle: 'Edit bill',
        tripPoint: tripPoint,
        billForm: {
          name: bill.name,
          price: bill.price,
          currency: bill.currency
        }
      }
    });

    dialogRef.afterClosed().subscribe(updatedBill => {
      if (updatedBill) {
        this.tripPointService.updateBill(bill.uuid,updatedBill).subscribe({
          next: result => {bill.name = updatedBill.name; bill.price = updatedBill.price; bill.currency = updatedBill.currency},
          error: error => this.handleAddBillError(error)
        });
      }
    });
  }
}
