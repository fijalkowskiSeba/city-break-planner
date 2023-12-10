package online.sebastianfijalkowski.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "TRIP_BILLS")
public class TripBill {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID uuid;

    private String item;

    private Double price;

    @JsonBackReference
    @JsonIgnore
    @ManyToOne
    private TripPoint tripPoint;
}
