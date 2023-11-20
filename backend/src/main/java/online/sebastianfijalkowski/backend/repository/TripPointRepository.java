package online.sebastianfijalkowski.backend.repository;

import online.sebastianfijalkowski.backend.model.Trip;
import online.sebastianfijalkowski.backend.model.TripPoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TripPointRepository extends JpaRepository<TripPoint, UUID> {
    List<TripPoint> findAllByTrip(Trip trip);
}
