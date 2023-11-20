package online.sebastianfijalkowski.backend.controller;

import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.service.TripService;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/trip")
public class TripController {

    private final TripService tripService;

    @GetMapping()
    ResponseEntity<Void> allTrips(){
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
