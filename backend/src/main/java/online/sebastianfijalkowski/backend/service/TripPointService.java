package online.sebastianfijalkowski.backend.service;

import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.dto.TripPointDTO;
import online.sebastianfijalkowski.backend.model.Trip;
import online.sebastianfijalkowski.backend.model.TripPoint;
import online.sebastianfijalkowski.backend.repository.TripPointRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripPointService {
    private final TripPointRepository tripPointRepository;

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
}
