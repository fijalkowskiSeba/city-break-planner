package online.sebastianfijalkowski.backend.dto;

import lombok.Data;

@Data
public class NewBillDTO {
    private String name;
    private Double price;
    private String currency;
}
