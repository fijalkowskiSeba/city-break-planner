package online.sebastianfijalkowski.backend.service;

import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.dto.TripCreationDTO;
import online.sebastianfijalkowski.backend.model.Trip;
import online.sebastianfijalkowski.backend.model.User;
import online.sebastianfijalkowski.backend.repository.TripRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

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

        return tripRepository.save(trip);
    }

    public ArrayList<Trip> getAllTrips(OAuth2User user) {
        User userFromDB = userService.addUserIfNotExist(user);
        return tripRepository.findAllByUser(userFromDB);
    }
}
