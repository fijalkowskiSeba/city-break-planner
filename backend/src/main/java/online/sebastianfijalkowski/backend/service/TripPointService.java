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
        int orderInTrip = 0;

        for (var tripPoint : tripPoints) {
            TripPoint tripPointEntity = new TripPoint();
            tripPointEntity.setName(tripPoint.getName());
            tripPointEntity.setLatitude(tripPoint.getLatitude());
            tripPointEntity.setLongitude(tripPoint.getLongitude());
            orderInTrip++;
            tripPointEntity.setOrderInTrip(orderInTrip);
            tripPointEntity.setTrip(trip);
            tripPointList.add(tripPointRepository.save(tripPointEntity));
        }

        return tripPointList;
    }
}
