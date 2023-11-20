package online.sebastianfijalkowski.backend.repository;

import online.sebastianfijalkowski.backend.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TripRepository extends JpaRepository<Trip, UUID> {
}
