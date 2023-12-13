package online.sebastianfijalkowski.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "TRIPS_POINTS")
public class TripPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column
    private String name;

    private Double latitude;

    private Double longitude;

    private Integer orderInTrip;

    private Boolean visited;

    @JsonBackReference
    @ManyToOne
    private Trip trip;

    @JsonManagedReference
    @OneToMany(mappedBy = "tripPoint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripBill> tripBills = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "tripPoint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripPhoto> tripPhotos = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "tripPoint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripComment> tripComments = new ArrayList<>();
}
