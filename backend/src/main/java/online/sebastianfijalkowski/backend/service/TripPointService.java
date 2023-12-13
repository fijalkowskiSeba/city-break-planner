package online.sebastianfijalkowski.backend.service;

import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.dto.TripPointDTO;
import online.sebastianfijalkowski.backend.model.Trip;
import online.sebastianfijalkowski.backend.model.TripPoint;
import online.sebastianfijalkowski.backend.model.User;
import online.sebastianfijalkowski.backend.repository.TripPointRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TripPointService {
    private final TripPointRepository tripPointRepository;
    private final UserService userService;

    public List<TripPoint> newTripPoints(TripPointDTO[] tripPoints, Trip trip) {
        List<TripPoint> tripPointList = new ArrayList<>();

        if(tripPoints == null) {
            System.out.println("tripPoints is null");
            return tripPointList;
        }

        // -1 is first location, -2 is last location, 0 is every other location
        TripPointDTO firstLocation = null;

        for (var tripPoint : tripPoints) {
            if (tripPoint.getOrderInTrip() == -1) {
                firstLocation = tripPoint;
                break;
            }
        }

        int orderInTrip = firstLocation == null ? 0 : 1;

        for (var tripPoint : tripPoints) {
            TripPoint tripPointEntity = new TripPoint();
            tripPointEntity.setName(tripPoint.getName());
            tripPointEntity.setLatitude(tripPoint.getLatitude());
            tripPointEntity.setLongitude(tripPoint.getLongitude());
            tripPointEntity.setOrderInTrip(tripPoint == firstLocation ? 0 : tripPoint.getOrderInTrip() == -2 ? tripPoints.length -1 : orderInTrip++);
            tripPointEntity.setVisited(false);
            tripPointEntity.setTrip(trip);
            tripPointEntity.setTripBills(new ArrayList<>());
            tripPointEntity.setTripComments(new ArrayList<>());
            tripPointEntity.setTripPhotos(new ArrayList<>());
            tripPointList.add(tripPointEntity);
        }

        return tripPointList;
    }

    public ResponseEntity<?> setTripPointVisited(OAuth2User user, String id, Boolean isVisited) {

        ResponseEntity<?> response = isTripPointBelongsToUser(id, user);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        UUID uuid = parseUUID(id);
        if (uuid == null) {
            return handleInvalidUUID(id);
        }

        TripPoint tripPointFromDB = findTripPointById(uuid);
        if (tripPointFromDB == null) {
            return new ResponseEntity<>("TripPoint not found", HttpStatus.NOT_FOUND);
        }

        tripPointFromDB.setVisited(isVisited);

        return new ResponseEntity<>(tripPointRepository.save(tripPointFromDB), HttpStatus.OK);
    }

    private ResponseEntity<?> isTripPointBelongsToUser(String tripID, OAuth2User user) {
        User userFromDB = userService.getUserById(user.getAttribute("sub"));

        if (userFromDB == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        UUID uuid = parseUUID(tripID);
        if (uuid == null) {
            return handleInvalidUUID(tripID);
        }

        TripPoint tripPointFromDB = findTripPointById(uuid);
        if (tripPointFromDB == null) {
            return new ResponseEntity<>("TripPoint not found", HttpStatus.NOT_FOUND);
        }

        if (!tripPointFromDB.getTrip().getUser().equals(userFromDB)) {
            return new ResponseEntity<>("TripPoint belongs to another user", HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().build();
    }

    private TripPoint findTripPointById(UUID id) {
        return tripPointRepository.findById(id).orElse(null);
    }
    private UUID parseUUID(String id) {
        try {
            return UUID.fromString(id);
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }

    private ResponseEntity<?> handleInvalidUUID(String id) {
        return new ResponseEntity<>("Invalid UUID string: " + id, HttpStatus.NOT_FOUND);
    }
}
