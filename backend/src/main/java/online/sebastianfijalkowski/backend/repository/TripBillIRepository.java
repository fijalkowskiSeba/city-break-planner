package online.sebastianfijalkowski.backend.repository;

import online.sebastianfijalkowski.backend.model.TripBill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TripBillIRepository extends JpaRepository<TripBill, UUID> {
}
