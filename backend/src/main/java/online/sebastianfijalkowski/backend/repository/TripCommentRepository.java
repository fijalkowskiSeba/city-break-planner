package online.sebastianfijalkowski.backend.repository;

import online.sebastianfijalkowski.backend.model.TripComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TripCommentRepository extends JpaRepository<TripComment, UUID> {
}
