package online.sebastianfijalkowski.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTripDTO {
    private String id;
    private String name;
    private Boolean isCompleted;
    private List<TripPointDTO> tripPoints;
}
