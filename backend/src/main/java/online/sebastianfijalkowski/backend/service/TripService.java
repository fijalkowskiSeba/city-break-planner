package online.sebastianfijalkowski.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.dto.AutoRouteBodyDTO;
import online.sebastianfijalkowski.backend.dto.TripCreationDTO;
import online.sebastianfijalkowski.backend.dto.UpdateTripDTO;
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
    private final AutoRouteService autoRouteService;


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

        var sortedTripPoints = autoRouteService.optimizeTrip(allTripPoints, firstLocation, lastLocation);

        return new ResponseEntity<>(sortedTripPoints, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<?> updateTrip(OAuth2User user, String id, UpdateTripDTO body) {

        if(!id.equals(body.getId())) {
            return new ResponseEntity<>("Trip id in path and body are different", HttpStatus.NOT_FOUND);
        }

        UUID uuid = parseUUID(id);
        if (uuid == null) {
            return handleInvalidUUID(id);
        }

        Trip tripFromDB = tripRepository.findById(uuid).orElse(null);
        if(tripFromDB == null) {
            return handleTripNotFound();
        }

        if(!isTripBelongsToUser(tripFromDB, user)) {
            return handleTripBelongsToOtherUser();
        }

        var tripPointsFromBody = body.getTripPoints();
        for (var tripPoint : tripPointsFromBody) {
            if(!tripPointService.isTripPointBelongsToUserOrNoOne(tripPoint, user)){
                return handleTripPointBelongsToOtherUser();
            }
        }

        ArrayList<TripPoint> updatedTripPoints = new ArrayList<>();

        for (var tripPointFromBody: tripPointsFromBody){
            for (var tripPointFromBody2: tripPointsFromBody){
                if(tripPointFromBody.getId() != null && tripPointFromBody2.getId() != null && tripPointFromBody.getId() != tripPointFromBody2.getId() && tripPointFromBody.getId().equals(tripPointFromBody2.getId())){
                    tripPointFromBody2.setId(null);
                }
            }
        }

        for (var tripPointFromBody: tripPointsFromBody){
            if(tripPointFromBody.getId() == null) {
               var newtripPoint = new TripPoint();
                newtripPoint.setName(tripPointFromBody.getName());
                newtripPoint.setLatitude(tripPointFromBody.getLatitude());
                newtripPoint.setLongitude(tripPointFromBody.getLongitude());
                newtripPoint.setOrderInTrip(tripPointFromBody.getOrderInTrip());
                newtripPoint.setTrip(tripFromDB);
                newtripPoint  = tripPointRepository.save(newtripPoint);
                updatedTripPoints.add(newtripPoint);

            } else {
                var tripPointFromDB = tripPointRepository.findById(tripPointFromBody.getId()).orElse(null);
                if(tripPointFromDB == null) {
                    continue;
                }
                tripPointFromDB.setName(tripPointFromBody.getName());
                tripPointFromDB.setLatitude(tripPointFromBody.getLatitude());
                tripPointFromDB.setLongitude(tripPointFromBody.getLongitude());
                tripPointFromDB.setOrderInTrip(tripPointFromBody.getOrderInTrip());
                tripPointRepository.save(tripPointFromDB);
                updatedTripPoints.add(tripPointFromDB);
            }
        }


        Iterator<TripPoint> iterator = tripFromDB.getTripPoints().iterator();
        while (iterator.hasNext()) {
            var existingTripPoint = iterator.next();
            if (!updatedTripPoints.contains(existingTripPoint)) {
                iterator.remove();
                tripPointRepository.delete(existingTripPoint);
            }
        }

        tripFromDB.setName(body.getName());
        tripFromDB.setIsCompleted(body.getIsCompleted());

        return new ResponseEntity<>(tripRepository.save(tripFromDB), HttpStatus.OK);

    }

    public ResponseEntity<?> getAllPhotos(OAuth2User user, String tripId) {
        UUID uuid = parseUUID(tripId);
        if (uuid == null) {
            return handleInvalidUUID(tripId);
        }

        Optional<Trip> optionalTrip = getTripById(uuid);
        if (optionalTrip.isPresent()) {
            Trip trip = optionalTrip.get();
            if (!isTripBelongsToUser(trip, user)) {
                return handleTripBelongsToOtherUser();
            }
            return new ResponseEntity<>(tripPointService.getAllPhotos(trip), HttpStatus.OK);
        } else {
            return handleTripNotFound();
        }
    }
}
