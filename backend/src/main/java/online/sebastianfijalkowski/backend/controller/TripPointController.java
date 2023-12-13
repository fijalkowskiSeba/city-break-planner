package online.sebastianfijalkowski.backend.controller;

import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.service.TripPointService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/tripPoint")
public class TripPointController {

    private final TripPointService tripPointService;
    @PatchMapping("/setVisited/{id}/{isVisited}")
    ResponseEntity<?> setTripPointVisited(@AuthenticationPrincipal OAuth2User user, @PathVariable String id, @PathVariable Boolean isVisited) {
        return tripPointService.setTripPointVisited(user, id, isVisited);
    }
}
