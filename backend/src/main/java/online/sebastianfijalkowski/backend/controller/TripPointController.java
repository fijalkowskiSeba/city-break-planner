package online.sebastianfijalkowski.backend.controller;

import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.dto.NewBillDTO;
import online.sebastianfijalkowski.backend.service.TripPointService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/tripPoint")
public class TripPointController {

    private final TripPointService tripPointService;
    @PatchMapping("/setVisited/{id}/{isVisited}")
    ResponseEntity<?> setTripPointVisited(@AuthenticationPrincipal OAuth2User user, @PathVariable String id, @PathVariable Boolean isVisited) {
        return tripPointService.setTripPointVisited(user, id, isVisited);
    }

    @PostMapping("/addBill/{tripPointId}")
    ResponseEntity<?> addBill(@AuthenticationPrincipal OAuth2User user, @PathVariable String tripPointId, @RequestBody NewBillDTO bill) {
        return tripPointService.addBill(user, tripPointId, bill);
    }

    @DeleteMapping("/deleteBill/{billId}")
    ResponseEntity<?> deleteBill(@AuthenticationPrincipal OAuth2User user, @PathVariable String billId) {
        return tripPointService.deleteBill(user, billId);
    }

    @PutMapping("/updateBill/{billId}")
    ResponseEntity<?> updateBill(@AuthenticationPrincipal OAuth2User user,@PathVariable String billId, @RequestBody NewBillDTO bill) {
        return tripPointService.updateBill(user,billId, bill);
    }
}
