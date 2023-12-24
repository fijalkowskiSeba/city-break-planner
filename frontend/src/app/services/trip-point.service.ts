import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TripPoint} from "../models/db models/TripPoint";
import {TripBill} from "../models/db models/TripBill";
import {TripComment} from "../models/db models/TripComment";

@Injectable({
  providedIn: 'root'
})
export class TripPointService {

  private apiPath = "/api/tripPoint";

  constructor(
    private http: HttpClient
  ) {
  }

  setVisited(location: TripPoint) {
    const url = this.apiPath + "/setVisited" + "/" + location.id + "/" + location.visited;
    return this.http.patch(url, location);
  }

  addBillToTripPoint(id: string, bill: any) {
    const url = this.apiPath + "/addBill" + "/" + id;
    return this.http.post<TripBill>(url, bill);
  }

  deleteBillFromTripPoint(uuid: string) {
    const url = this.apiPath + "/deleteBill" + "/" + uuid;
    return this.http.delete(url);
  }

  updateBill(id: string, bill: TripBill) {
    const url = this.apiPath + "/updateBill" + "/" + id;
    return this.http.put(url, bill);
  }

  addCommentToTripPoint(tripPointId: string, newCommentForm: any) {
    const url = this.apiPath + "/addComment" + "/" + tripPointId;
    return this.http.post(url, newCommentForm);
  }

  deleteCommentFromTripPoint(commentId: string) {
    const url = this.apiPath + "/deleteComment" + "/" + commentId;
    return this.http.delete(url);
  }

  updateComment(tripPointId: string, comment: TripComment) {
    const url = this.apiPath + "/updateComment" + "/" + tripPointId;
    return this.http.put(url, comment);
  }
}
