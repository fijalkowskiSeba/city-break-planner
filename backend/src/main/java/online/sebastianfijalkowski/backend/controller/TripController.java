package online.sebastianfijalkowski.backend.controller;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.dto.TripCreationDTO;
import online.sebastianfijalkowski.backend.model.Trip;
import online.sebastianfijalkowski.backend.service.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/trip")
public class TripController {

    private final TripService tripService;

    @GetMapping("/all")
    ArrayList<Trip> allTrips(@AuthenticationPrincipal OAuth2User user) {
        return tripService.getAllTrips(user);
    }

    @Transactional
    @PostMapping("/new")
    public Trip newTrip(@AuthenticationPrincipal OAuth2User user, @RequestBody TripCreationDTO body) {
        return tripService.saveTripAndTripPointsAndUserIfNotExist(user, body);
    }

    @GetMapping("/{id}")
    ResponseEntity<?> getTripById(@PathVariable String id) {
        return tripService.getTripById(id);
    }

    @Transactional
    @PatchMapping("/{id}/setCompleted")
    public ResponseEntity<?> setTripCompleted(@PathVariable String id) {
        return tripService.setTripCompleted(id);
    }

    @Transactional
    @PatchMapping("/{id}/setPlanned")
    public ResponseEntity<?> setTripPlanned(@PathVariable String id) {
        return tripService.setTripPlanned(id);
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable String id) {
        return tripService.deleteTrip(id);
    }
}
