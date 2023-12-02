package online.sebastianfijalkowski.backend.service;

import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.dto.TripPointDTO;
import online.sebastianfijalkowski.backend.model.Trip;
import online.sebastianfijalkowski.backend.model.User;
import online.sebastianfijalkowski.backend.repository.TripRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final UserService userService;
    private final TripPointService tripPointService;

    public Trip saveTripAndTripPointsAndUserIfNotExist(OAuth2User user, TripPointDTO[] tripPoints) {
        User userFromDB = userService.addUserIfNotExist(user);
        Trip trip = this.newTrip(new Trip(), userFromDB);

        tripPointService.newTripPoints(tripPoints, trip);

        return trip;
    }

    public Trip newTrip(Trip trip, User user) {
        trip.setUser(user);
        final String temporaryName = "New Trip";
        trip.setName(temporaryName);

        return tripRepository.save(trip);
    }
}
