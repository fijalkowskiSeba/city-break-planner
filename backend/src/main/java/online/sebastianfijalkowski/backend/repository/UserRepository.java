package online.sebastianfijalkowski.backend.repository;

import online.sebastianfijalkowski.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
