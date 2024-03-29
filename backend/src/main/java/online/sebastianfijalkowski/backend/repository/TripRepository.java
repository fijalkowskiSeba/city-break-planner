package online.sebastianfijalkowski.backend.repository;

import online.sebastianfijalkowski.backend.model.Trip;
import online.sebastianfijalkowski.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.UUID;

public interface TripRepository extends JpaRepository<Trip, UUID> {
    ArrayList<Trip> findAllByUser(User user);
}
