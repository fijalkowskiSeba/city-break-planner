import {TripPhoto} from "./db models/TripPhoto";
import {PhotoFileDto} from "./photo-file-dto";

export interface PhotoFileAndObject {
    tripPhoto: TripPhoto;
    photoFileDTO: PhotoFileDto;
}
