package online.sebastianfijalkowski.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AutoRouteBodyDTO {
    private ArrayList<TripPointDTO> tripPoints;
    private TripPointDTO firstLocation;
    private TripPointDTO lastLocation;
}
