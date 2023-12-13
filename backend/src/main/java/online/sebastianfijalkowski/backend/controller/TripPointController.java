package online.sebastianfijalkowski.backend.controller;

import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.model.TripPoint;
import online.sebastianfijalkowski.backend.service.TripPointService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/tripPoint")
public class TripPointController {

    private final TripPointService tripPointService;
    @PutMapping("/setVisited")
    ResponseEntity<?> setTripPointVisited(@AuthenticationPrincipal OAuth2User user, TripPoint tripPoint) {
        return tripPointService.setTripPointVisited(user, tripPoint);
    }
}
