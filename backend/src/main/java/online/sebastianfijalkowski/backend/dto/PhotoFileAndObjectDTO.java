package online.sebastianfijalkowski.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import online.sebastianfijalkowski.backend.model.TripPhoto;

@Data
@AllArgsConstructor
public class PhotoFileAndObjectDTO {
    private TripPhoto tripPhoto;
    private PhotoFileDTO photoFileDTO;
}
