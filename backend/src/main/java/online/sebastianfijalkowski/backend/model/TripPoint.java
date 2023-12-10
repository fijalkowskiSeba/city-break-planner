package online.sebastianfijalkowski.backend.model;

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

    @ManyToOne
    private Trip trip;

    @OneToMany(mappedBy = "tripPoint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripBill> tripBills = new ArrayList<>();

    @OneToMany(mappedBy = "tripPoint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripPhoto> tripPhotos = new ArrayList<>();

    @OneToMany(mappedBy = "tripPoint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripComment> tripComments = new ArrayList<>();
}
