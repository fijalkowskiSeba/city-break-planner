package online.sebastianfijalkowski.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripPointDTO {
    private UUID id;

    private String name;

    private Double latitude;

    private Double longitude;

    private Integer orderInTrip;
}
