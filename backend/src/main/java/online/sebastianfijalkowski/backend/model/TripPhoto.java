package online.sebastianfijalkowski.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    private String pathToFile;

    @ManyToOne
    private Trip trip;

}
