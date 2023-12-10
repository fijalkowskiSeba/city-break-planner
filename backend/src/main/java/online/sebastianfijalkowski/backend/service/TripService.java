package online.sebastianfijalkowski.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.dto.TripCreationDTO;
import online.sebastianfijalkowski.backend.model.Trip;
import online.sebastianfijalkowski.backend.model.TripPoint;
import online.sebastianfijalkowski.backend.model.User;
import online.sebastianfijalkowski.backend.repository.TripPointRepository;
import online.sebastianfijalkowski.backend.repository.TripRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final TripPointRepository tripPointRepository;
    private final UserService userService;
    private final TripPointService tripPointService;

    @Transactional
    public ResponseEntity<?> saveTripAndTripPointsAndUserIfNotExist(OAuth2User user, TripCreationDTO tripData) {
        User userFromDB = userService.addUserIfNotExist(user);

        Trip trip = new Trip();
        trip.setUser(userFromDB);
        trip.setName(tripData.getTripName());
        trip.setIsCompleted(false);

        List<TripPoint> tripPoints = tripPointService.newTripPoints(tripData.getLocations(), trip);
        trip.setTripPoints(tripPoints);

        return new ResponseEntity<>(tripRepository.save(trip), HttpStatus.OK);
    }

    public ArrayList<Trip> getAllTrips(OAuth2User user) {
        User userFromDB = userService.addUserIfNotExist(user);
        return tripRepository.findAllByUser(userFromDB);
    }

    public ResponseEntity<?> getTripById(String id) {
        UUID uuid;
        try {
            uuid = UUID.fromString(id);
        } catch (IllegalArgumentException exception) {
            return new ResponseEntity<>("Invalid UUID string", HttpStatus.NOT_FOUND);
        }

        var optionalTrip = tripRepository.findById(uuid);
        if (optionalTrip.isPresent()) {
            Trip trip = optionalTrip.get();
            return new ResponseEntity<>(trip, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Trip not found", HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<?> setTripCompleted(String id) {
        UUID uuid;
        try {
            uuid = UUID.fromString(id);
        } catch (IllegalArgumentException exception) {
            return new ResponseEntity<>("Invalid UUID string", HttpStatus.NOT_FOUND);
        }

        var optionalTrip = tripRepository.findById(uuid);
        if (optionalTrip.isPresent()) {
            Trip trip = optionalTrip.get();
            trip.setIsCompleted(true);
            tripRepository.save(trip);
            return new ResponseEntity<>(trip, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Trip not found", HttpStatus.NOT_FOUND);
        }
    }


    public ResponseEntity<?> setTripPlanned(String id) {
        UUID uuid;
        try {
            uuid = UUID.fromString(id);
        } catch (IllegalArgumentException exception) {
            return new ResponseEntity<>("Invalid UUID string", HttpStatus.NOT_FOUND);
        }

        var optionalTrip = tripRepository.findById(uuid);
        if (optionalTrip.isPresent()) {
            Trip trip = optionalTrip.get();
            trip.setIsCompleted(false);
            tripRepository.save(trip);
            return new ResponseEntity<>(trip, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Trip not found", HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<?> deleteTrip(String id) {
        UUID uuid;
        try {
            uuid = UUID.fromString(id);
        } catch (IllegalArgumentException exception) {
            return new ResponseEntity<>("Invalid UUID string", HttpStatus.NOT_FOUND);
        }

        var optionalTrip = tripRepository.findById(uuid);
        if (optionalTrip.isPresent()) {
            Trip trip = optionalTrip.get();
            tripPointRepository.deleteByTrip(trip);

            tripRepository.delete(trip);
            return new ResponseEntity<>(trip, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Trip not found", HttpStatus.NOT_FOUND);
        }
    }

//    public ResponseEntity<?> getTripWithAllData(String id) {
//        UUID uuid;
//        try {
//            uuid = UUID.fromString(id);
//        } catch (IllegalArgumentException exception) {
//            return new ResponseEntity<>("Invalid UUID string", HttpStatus.NOT_FOUND);
//        }
//
//        var optionalTrip = tripRepository.findById(uuid);
//        Trip trip;
//        if (optionalTrip.isPresent()) {
//            trip = optionalTrip.get();
//        } else {
//            return new ResponseEntity<>("Trip not found", HttpStatus.NOT_FOUND);
//        }
//
//        List<TripPoint> tripPoints = tripPointRepository.findAllByTrip(trip);
//
//    }
}
