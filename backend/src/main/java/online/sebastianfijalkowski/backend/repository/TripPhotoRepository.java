package online.sebastianfijalkowski.backend.repository;

import online.sebastianfijalkowski.backend.model.TripPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TripPhotoRepository extends JpaRepository<TripPhoto, UUID> {
}
