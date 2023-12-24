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
import {TripComment} from "../../../models/db models/TripComment";
import {CommentModalComponent} from "../../modals/comment-modal/comment-modal.component";
import {AddPhotoModalComponent} from "../../modals/add-photo-modal/add-photo-modal.component";

@Component({
  selector: 'app-trip-history',
  templateUrl: './trip-history.component.html',
  styleUrls: ['./trip-history.component.css']
})
export class TripHistoryComponent {
  trip?: Trip;
  waitingForData: boolean = true;
  rightColumnDisplay: string = 'photos';


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

  onAddPhoto(tripPoint: TripPoint) {
    const dialogRef = this.dialog.open(AddPhotoModalComponent, {
      width: '400px',
      data: {
        modalTitle: 'Add photo to',
        tripPoint: tripPoint,
        photoName: ''
      }
    });
  }

  onAddComment(tripPoint: TripPoint) {
    const dialogRef = this.dialog.open(CommentModalComponent, {
      width: '400px',
      data: {
        modalTitle: 'Add comment to',
        tripPoint: tripPoint,
        commentForm: {
          title: '',
          content: ''
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tripPointService.addCommentToTripPoint(tripPoint.id, result).subscribe({
          next: result => {tripPoint.tripComments.push(result as TripComment); this.rightColumnDisplay = 'comments';},
          error: error => this.handleApiError(error)
        });
      }
    });
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
          next: result => {tripPoint.tripBills.push(result as TripBill); this.rightColumnDisplay = 'bills';},
          error: error => this.handleApiError(error)
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

  private handleApiError(error: any) {
    this.dialog.open(ErrorModalComponent, {
      width: '400px',
      data: {
        title: 'Error',
        message: error.error.error,
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
          error: error => this.handleApiError(error)
        });
      }
    });
  }

  onEditComment(tripPoint: TripPoint, comment: TripComment) {
    const dialogRef = this.dialog.open(CommentModalComponent, {
      width: '400px',
      data: {
        modalTitle: 'Edit comment',
        tripPoint: tripPoint,
        commentForm: {
          title: comment.title,
          content: comment.content
        }
      }
    });

    dialogRef.afterClosed().subscribe(updatedComment => {
      if (updatedComment) {
        this.tripPointService.updateComment(comment.uuid,updatedComment).subscribe({
          next: result => {comment.title = updatedComment.title; comment.content = updatedComment.content},
          error: error => this.handleApiError(error)
        });
      }
    });
  }

  onDeleteComment(tripPoint: TripPoint, comment: TripComment) {
    tripPoint.tripComments = tripPoint.tripComments.filter(c => c !== comment);
    this.tripPointService.deleteCommentFromTripPoint(comment.uuid).subscribe();
  }
}
