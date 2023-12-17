package online.sebastianfijalkowski.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.dto.AutoRouteBodyDTO;
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

import java.util.*;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final TripPointRepository tripPointRepository;
    private final UserService userService;
    private final TripPointService tripPointService;


    private ResponseEntity<?> handleInvalidUUID(String id) {
        return new ResponseEntity<>("Invalid UUID string: " + id, HttpStatus.NOT_FOUND);
    }

    private ResponseEntity<?> handleTripNotFound() {
        return new ResponseEntity<>("Trip not found", HttpStatus.NOT_FOUND);
    }

    private ResponseEntity<?> handleTripBelongsToOtherUser() {
        return new ResponseEntity<>("Trip belongs to another user", HttpStatus.NOT_FOUND);
    }

    private ResponseEntity<?> handleTripPointBelongsToOtherUser() {
        return new ResponseEntity<>("Trip Point belongs to another user", HttpStatus.NOT_FOUND);
    }

    private UUID parseUUID(String id) {
        try {
            return UUID.fromString(id);
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }

    private Optional<Trip> getTripById(UUID uuid) {
        return tripRepository.findById(uuid);
    }

    private boolean isTripBelongsToUser(Trip trip, OAuth2User user) {
        User userFromDB = userService.getUserById(user.getAttribute("sub"));
        return trip.getUser().equals(userFromDB);
    }

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

    public ResponseEntity<?> getTripById(OAuth2User user, String id) {
        UUID uuid = parseUUID(id);
        if (uuid == null) {
            return handleInvalidUUID(id);
        }

        Optional<Trip> optionalTrip = getTripById(uuid);
        if (optionalTrip.isPresent()) {
            Trip trip = optionalTrip.get();
            if (isTripBelongsToUser(trip, user)) {
                return new ResponseEntity<>(trip, HttpStatus.OK);
            } else {
                return handleTripBelongsToOtherUser();
            }
        } else {
            return handleTripNotFound();
        }
    }

    public ResponseEntity<?> setTripCompleted(OAuth2User user, String id) {
        UUID uuid = parseUUID(id);
        if (uuid == null) {
            return handleInvalidUUID(id);
        }

        Optional<Trip> optionalTrip = getTripById(uuid);
        if (optionalTrip.isPresent()) {
            Trip trip = optionalTrip.get();
            if (!isTripBelongsToUser(trip, user)) {
                return handleTripBelongsToOtherUser();
            }
            trip.setIsCompleted(true);
            tripRepository.save(trip);
            return new ResponseEntity<>(trip, HttpStatus.OK);
        } else {
            return handleTripNotFound();
        }
    }


    public ResponseEntity<?> setTripPlanned(OAuth2User user, String id) {
        UUID uuid = parseUUID(id);
        if (uuid == null) {
            return handleInvalidUUID(id);
        }

        Optional<Trip> optionalTrip = getTripById(uuid);
        if (optionalTrip.isPresent()) {
            Trip trip = optionalTrip.get();
            if (!isTripBelongsToUser(trip, user)) {
                return handleTripBelongsToOtherUser();
            }
            trip.setIsCompleted(false);
            tripRepository.save(trip);
            return new ResponseEntity<>(trip, HttpStatus.OK);
        } else {
            return handleTripNotFound();
        }
    }

    public ResponseEntity<?> deleteTrip(OAuth2User user, String id) {
        UUID uuid = parseUUID(id);
        if (uuid == null) {
            return handleInvalidUUID(id);
        }

        Optional<Trip> optionalTrip = getTripById(uuid);
        if (optionalTrip.isPresent()) {
            Trip trip = optionalTrip.get();
            if (!isTripBelongsToUser(trip, user)) {
                return handleTripBelongsToOtherUser();
            }
            tripPointRepository.deleteByTrip(trip);
            tripRepository.delete(trip);
            return new ResponseEntity<>(trip, HttpStatus.OK);
        } else {
            return handleTripNotFound();
        }
    }

    public ResponseEntity<?> autoRoute(OAuth2User user, AutoRouteBodyDTO body) {
        var allTripPoints = body.getTripPoints();
        var firstLocation = body.getFirstLocation();
        var lastLocation = body.getLastLocation();

        for(var tripPoint : allTripPoints) {
            if(!tripPointService.isTripPointBelongsToUserOrNoOne(tripPoint, user)){
                return handleTripPointBelongsToOtherUser();
            }
        }
        if(firstLocation != null && !tripPointService.isTripPointBelongsToUserOrNoOne(firstLocation, user)){
            return handleTripPointBelongsToOtherUser();
        }
        if(lastLocation != null && !tripPointService.isTripPointBelongsToUserOrNoOne(lastLocation, user)){
            return handleTripPointBelongsToOtherUser();
        }

        var sortedTripPoints = new ArrayList<>();

        var index = 0;
        if(firstLocation != null) {
            allTripPoints.remove(firstLocation);
            firstLocation.setOrderInTrip(index++);
            sortedTripPoints.add(firstLocation);
        }
        if (lastLocation != null) {
            allTripPoints.remove(lastLocation);
            lastLocation.setOrderInTrip(allTripPoints.size() + 1);
            sortedTripPoints.add(lastLocation);
        }
        for (var tripPoint : allTripPoints) {
            tripPoint.setOrderInTrip(index++);
            sortedTripPoints.add(tripPoint);
        }

        return new ResponseEntity<>(sortedTripPoints, HttpStatus.OK);
    }
}
