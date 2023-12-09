package online.sebastianfijalkowski.backend.service;

import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.dto.TripCreationDTO;
import online.sebastianfijalkowski.backend.model.Trip;
import online.sebastianfijalkowski.backend.model.User;
import online.sebastianfijalkowski.backend.repository.TripRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final UserService userService;
    private final TripPointService tripPointService;

    public Trip saveTripAndTripPointsAndUserIfNotExist(OAuth2User user, TripCreationDTO tripData) {
        User userFromDB = userService.addUserIfNotExist(user);
        Trip trip = this.newTrip(new Trip(), userFromDB, tripData.getTripName());

        tripPointService.newTripPoints(tripData.getLocations(), trip);

        return trip;
    }

    public Trip newTrip(Trip trip, User user, String tripName) {
        trip.setUser(user);
        trip.setName(tripName);
        trip.setIsCompleted(false);

        return tripRepository.save(trip);
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
}
