package online.sebastianfijalkowski.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "TRIPS")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Boolean isCompleted;

    @JsonIgnore
    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL)
    private Set<TripPoint> tripPoints = new HashSet<>();

}
