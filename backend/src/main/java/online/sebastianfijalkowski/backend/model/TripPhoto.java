package online.sebastianfijalkowski.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "TRIP_PHOTOS")
public class TripPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID uuid;

    private String name;

    private String fileName;

    @JsonBackReference
    @JsonIgnore
    @ManyToOne
    private TripPoint tripPoint;

    @PreRemove
    private void removeFile() {
        String userUploadDir = "/images/";
        Path userDirectory = Path.of(userUploadDir);

        if (!Files.exists(userDirectory)) {
            return;
        }

        Path filePath = userDirectory.resolve(this.fileName);
        try {
            Files.delete(filePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
