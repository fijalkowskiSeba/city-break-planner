package online.sebastianfijalkowski.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class PhotoFileDTO {
    private UUID uuid;
    private String base64String;
    private String fileExtension;
}
