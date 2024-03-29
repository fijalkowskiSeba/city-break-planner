package online.sebastianfijalkowski.backend.controller;

import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.dto.NewBillDTO;
import online.sebastianfijalkowski.backend.dto.NewCommentDTO;
import online.sebastianfijalkowski.backend.model.TripComment;
import online.sebastianfijalkowski.backend.service.TripPointService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping("/addComment/{tripPointId}")
    ResponseEntity<?> addComment(@AuthenticationPrincipal OAuth2User user, @PathVariable String tripPointId, @RequestBody NewCommentDTO comment) {
        return tripPointService.addComment(user, tripPointId, comment);
    }

    @DeleteMapping("/deleteComment/{commentId}")
    ResponseEntity<?> deleteComment(@AuthenticationPrincipal OAuth2User user, @PathVariable String commentId) {
        return tripPointService.deleteComment(user, commentId);
    }

    @PutMapping("/updateComment/{commentId}")
    ResponseEntity<?> updateComment(@AuthenticationPrincipal OAuth2User user,@PathVariable String commentId, @RequestBody TripComment comment) {
        return tripPointService.updateComment(user,commentId, comment);
    }

    @PostMapping("/addPhoto/{tripPointId}/{photoName}")
    ResponseEntity<?> addPhoto(@AuthenticationPrincipal OAuth2User user, @PathVariable String tripPointId,@PathVariable String photoName, @RequestParam("image") MultipartFile file) {
        return tripPointService.addPhoto(user, tripPointId, photoName, file);
    }

    @DeleteMapping("/deletePhoto/{tripPointId}/{photoId}")
    ResponseEntity<?> deletePhoto(@AuthenticationPrincipal OAuth2User user,@PathVariable String tripPointId, @PathVariable String photoId) {
        return tripPointService.deletePhoto(user,tripPointId, photoId);
    }

    @PutMapping("/updatePhoto/{photoId}/{newName}")
    ResponseEntity<?> updatePhoto(@AuthenticationPrincipal OAuth2User user,@PathVariable String photoId, @PathVariable String newName) {
        return tripPointService.updatePhoto(user,photoId, newName);
    }
}
