package online.sebastianfijalkowski.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.dto.*;
import online.sebastianfijalkowski.backend.model.*;
import online.sebastianfijalkowski.backend.repository.TripBillIRepository;
import online.sebastianfijalkowski.backend.repository.TripCommentRepository;
import online.sebastianfijalkowski.backend.repository.TripPhotoRepository;
import online.sebastianfijalkowski.backend.repository.TripPointRepository;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TripPointService {
    private final TripPointRepository tripPointRepository;
    private final UserService userService;
    private final TripBillIRepository tripBillRepository;
    private final TripCommentRepository tripCommentRepository;
    private final TripPhotoRepository tripPhotoRepository;
    private final AutoRouteService autoRouteService;

    @Transactional
    public List<TripPoint> newTripPoints(TripPointDTO[] tripPoints, Trip trip) {
        List<TripPoint> tripPointList = new ArrayList<>();

        if(tripPoints == null) {
            System.out.println("tripPoints is null");
            return tripPointList;
        }

        // -1 is first location, -2 is last location, 0 is every other location
        TripPointDTO firstLocation = null;

        for (var tripPoint : tripPoints) {
            if (tripPoint.getOrderInTrip() == -1) {
                firstLocation = tripPoint;
                break;
            }
        }

        TripPointDTO lastLocation = null;
        for (var tripPoint : tripPoints) {
            if (tripPoint.getOrderInTrip() == -2) {
                lastLocation = tripPoint;
                break;
            }
        }

        List<TripPointDTO> tripPointsList = Arrays.asList(tripPoints);
        List<TripPointDTO> orderedTripPoints = autoRouteService.optimizeTrip(new ArrayList<>(tripPointsList), firstLocation, lastLocation);

        for (var tripPoint : orderedTripPoints) {
            TripPoint tripPointEntity = new TripPoint();
            tripPointEntity.setName(tripPoint.getName());
            tripPointEntity.setLatitude(tripPoint.getLatitude());
            tripPointEntity.setLongitude(tripPoint.getLongitude());
            tripPointEntity.setOrderInTrip(tripPoint.getOrderInTrip());
            tripPointEntity.setVisited(false);
            tripPointEntity.setTrip(trip);
            tripPointEntity.setTripBills(new ArrayList<>());
            tripPointEntity.setTripComments(new ArrayList<>());
            tripPointEntity.setTripPhotos(new ArrayList<>());
            tripPointList.add(tripPointEntity);
        }

        return tripPointList;
    }

    @Transactional
    public ResponseEntity<?> setTripPointVisited(OAuth2User user, String id, Boolean isVisited) {

        ResponseEntity<?> response = isTripPointBelongsToUser(id, user);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        UUID uuid = parseUUID(id);
        if (uuid == null) {
            return handleInvalidUUID(id);
        }

        TripPoint tripPointFromDB = findTripPointById(uuid);
        if (tripPointFromDB == null) {
            return new ResponseEntity<>("TripPoint not found", HttpStatus.NOT_FOUND);
        }

        tripPointFromDB.setVisited(isVisited);

        return new ResponseEntity<>(tripPointRepository.save(tripPointFromDB), HttpStatus.OK);
    }

    private ResponseEntity<?> isTripPointBelongsToUser(String tripID, OAuth2User user) {
        User userFromDB = userService.getUserById(user.getAttribute("sub"));

        if (userFromDB == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        UUID uuid = parseUUID(tripID);
        if (uuid == null) {
            return handleInvalidUUID(tripID);
        }

        TripPoint tripPointFromDB = findTripPointById(uuid);
        if (tripPointFromDB == null) {
            return new ResponseEntity<>("TripPoint not found", HttpStatus.NOT_FOUND);
        }

        if (!tripPointFromDB.getTrip().getUser().equals(userFromDB)) {
            return new ResponseEntity<>("TripPoint belongs to another user", HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().build();
    }

    private TripPoint findTripPointById(UUID id) {
        return tripPointRepository.findById(id).orElse(null);
    }
    private UUID parseUUID(String id) {
        try {
            return UUID.fromString(id);
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }

    private ResponseEntity<?> handleInvalidUUID(String id) {
        return new ResponseEntity<>("Invalid UUID string: " + id, HttpStatus.NOT_FOUND);
    }

    public boolean isTripPointBelongsToUserOrNoOne(TripPointDTO tripPoint, OAuth2User user) {
        if(tripPoint.getId() == null){
            return true;
        }

        User userFromDB = userService.getUserById(user.getAttribute("sub"));

        var tripPointFromDB = findTripPointById(tripPoint.getId());
        if (tripPointFromDB == null) {
            return true;
        }

        return tripPointFromDB.getTrip().getUser().equals(userFromDB);

    }

    @Transactional
    public ResponseEntity<?> addBill(OAuth2User user, String tripPointId, NewBillDTO bill) {
        ResponseEntity<?> response = isTripPointBelongsToUser(tripPointId, user);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        UUID uuid = parseUUID(tripPointId);
        if (uuid == null) {
            return handleInvalidUUID(tripPointId);
        }

        TripPoint tripPointFromDB = findTripPointById(uuid);
        if (tripPointFromDB == null) {
            return new ResponseEntity<>("TripPoint not found", HttpStatus.NOT_FOUND);
        }

        TripBill tripBill = new TripBill();
        tripBill.setName(bill.getName());
        tripBill.setPrice(bill.getPrice());
        tripBill.setCurrency(bill.getCurrency());
        tripBill.setTripPoint(tripPointFromDB);
        tripPointFromDB.getTripBills().add(tripBill);

        var savedBill = tripBillRepository.save(tripBill);
        tripPointRepository.save(tripPointFromDB);
        return new ResponseEntity<>(savedBill, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<?> deleteBill(OAuth2User user, String billId) {
        ResponseEntity<?> response = isBillBelongsToUser(billId, user);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        UUID uuid = parseUUID(billId);
        if (uuid == null) {
            return handleInvalidUUID(billId);
        }

        TripBill tripBillFromDB = tripBillRepository.findById(uuid).orElse(null);
        if (tripBillFromDB == null) {
            return new ResponseEntity<>("TripBill not found", HttpStatus.NOT_FOUND);
        }

        tripBillRepository.delete(tripBillFromDB);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private ResponseEntity<?> isBillBelongsToUser(String billId, OAuth2User user) {
        User userFromDB = userService.getUserById(user.getAttribute("sub"));

        if (userFromDB == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        UUID uuid = parseUUID(billId);
        if (uuid == null) {
            return handleInvalidUUID(billId);
        }

        TripBill tripBillFromDB = tripBillRepository.findById(uuid).orElse(null);
        if (tripBillFromDB == null) {
            return new ResponseEntity<>("TripBill not found", HttpStatus.NOT_FOUND);
        }

        if (!tripBillFromDB.getTripPoint().getTrip().getUser().equals(userFromDB)) {
            return new ResponseEntity<>("TripBill belongs to another user", HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().build();
    }

    @Transactional
    public ResponseEntity<?> updateBill(OAuth2User user, String billId, NewBillDTO bill) {
        ResponseEntity<?> response = isBillBelongsToUser(billId, user);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        UUID uuid = parseUUID(billId);
        if (uuid == null) {
            return handleInvalidUUID(billId);
        }

        TripBill tripBillFromDB = tripBillRepository.findById(uuid).orElse(null);
        if (tripBillFromDB == null) {
            return new ResponseEntity<>("TripBill not found", HttpStatus.NOT_FOUND);
        }

        tripBillFromDB.setName(bill.getName());
        tripBillFromDB.setPrice(bill.getPrice());
        tripBillFromDB.setCurrency(bill.getCurrency());

        var savedBill = tripBillRepository.save(tripBillFromDB);
        return new ResponseEntity<>(savedBill, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<?> addComment(OAuth2User user, String tripPointId, NewCommentDTO comment) {
        ResponseEntity<?> response = isTripPointBelongsToUser(tripPointId, user);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        UUID uuid = parseUUID(tripPointId);
        if (uuid == null) {
            return handleInvalidUUID(tripPointId);
        }

        TripPoint tripPointFromDB = findTripPointById(uuid);
        if (tripPointFromDB == null) {
            return new ResponseEntity<>("TripPoint not found", HttpStatus.NOT_FOUND);
        }

        TripComment tripComment = new TripComment();
        tripComment.setTitle(comment.getTitle());
        tripComment.setContent(comment.getContent());
        tripComment.setTripPoint(tripPointFromDB);
        tripPointFromDB.getTripComments().add(tripComment);

        tripPointRepository.save(tripPointFromDB);

        return new ResponseEntity<>(tripCommentRepository.save(tripComment), HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<?> deleteComment(OAuth2User user, String commentId) {
        ResponseEntity<?> response = isCommentBelongsToUser(commentId, user);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        UUID uuid = parseUUID(commentId);
        if (uuid == null) {
            return handleInvalidUUID(commentId);
        }

        TripComment tripCommentFromDB = tripCommentRepository.findById(uuid).orElse(null);
        if (tripCommentFromDB == null) {
            return new ResponseEntity<>("TripComment not found", HttpStatus.NOT_FOUND);
        }

        tripCommentRepository.delete(tripCommentFromDB);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    private ResponseEntity<?> isCommentBelongsToUser(String commentId, OAuth2User user) {
        User userFromDB = userService.getUserById(user.getAttribute("sub"));

        if (userFromDB == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        UUID uuid = parseUUID(commentId);
        if (uuid == null) {
            return handleInvalidUUID(commentId);
        }

        TripComment tripCommentFromDB = tripCommentRepository.findById(uuid).orElse(null);
        if (tripCommentFromDB == null) {
            return new ResponseEntity<>("TripComment not found", HttpStatus.NOT_FOUND);
        }

        if (!tripCommentFromDB.getTripPoint().getTrip().getUser().equals(userFromDB)) {
            return new ResponseEntity<>("TripComment belongs to another user", HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().build();
    }

    @Transactional
    public ResponseEntity<?> updateComment(OAuth2User user, String commentId, TripComment comment) {
        ResponseEntity<?> response = isCommentBelongsToUser(commentId, user);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        UUID uuid = parseUUID(commentId);
        if (uuid == null) {
            return handleInvalidUUID(commentId);
        }

        TripComment tripCommentFromDB = tripCommentRepository.findById(uuid).orElse(null);
        if (tripCommentFromDB == null) {
            return new ResponseEntity<>("TripComment not found", HttpStatus.NOT_FOUND);
        }

        tripCommentFromDB.setTitle(comment.getTitle());
        tripCommentFromDB.setContent(comment.getContent());

        return new ResponseEntity<>(tripCommentRepository.save(tripCommentFromDB), HttpStatus.OK);
    }


    @Transactional
    public ResponseEntity<?> addPhoto(OAuth2User user, String tripPointId, String photoName, MultipartFile file) {
        ResponseEntity<?> response = isTripPointBelongsToUser(tripPointId, user);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        UUID uuid = parseUUID(tripPointId);
        if (uuid == null) {
            return handleInvalidUUID(tripPointId);
        }

        TripPoint tripPointFromDB = findTripPointById(uuid);
        if (tripPointFromDB == null) {
            return new ResponseEntity<>("TripPoint not found", HttpStatus.NOT_FOUND);
        }

        try {
            TripPhoto tripPhoto = new TripPhoto();
            tripPhoto.setName(photoName);
            tripPhoto.setTripPoint(tripPointFromDB);
            tripPointFromDB.getTripPhotos().add(tripPhoto);
            tripPointRepository.save(tripPointFromDB);
            var savedPhoto = tripPhotoRepository.save(tripPhoto);

           String userUploadDir = "/images/";
            Path userDirectory = Path.of(userUploadDir);

            if (!Files.exists(userDirectory)) {
                Files.createDirectories(userDirectory);
            }

            String fileExtension = Objects.requireNonNull(file.getContentType())
                    .substring(Objects.requireNonNull(file.getContentType()).lastIndexOf('/') + 1);
            String filename = savedPhoto.getUuid() + "." + fileExtension.toLowerCase();

            Path filePath = userDirectory.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            tripPhoto.setFileName(filename);
            savedPhoto = tripPhotoRepository.save(tripPhoto);

            byte[] imageBytes = Files.readAllBytes(filePath);
            String base64Image = Base64.encodeBase64String(imageBytes);
            PhotoFileDTO photoFileDTO = new PhotoFileDTO(savedPhoto.getUuid(), base64Image, fileExtension);

            PhotoFileAndObjectDTO  photoFileAndObjectDTO = new PhotoFileAndObjectDTO(savedPhoto, photoFileDTO);

            return new ResponseEntity<>(photoFileAndObjectDTO, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error saving the photo", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public List<PhotoFileDTO> getAllPhotos(Trip trip) {
        List<PhotoFileDTO> photos = new ArrayList<>();
        for (var tripPoint : trip.getTripPoints()) {
            for (var tripPhoto : tripPoint.getTripPhotos()) {

                String userUploadDir = "/images/";
                Path userDirectory = Path.of(userUploadDir);

                if (!Files.exists(userDirectory)) {
                    continue;
                }

                Path filePath = userDirectory.resolve(tripPhoto.getFileName());
                try {
                    byte[] imageBytes = Files.readAllBytes(filePath);
                    String base64Image = Base64.encodeBase64String(imageBytes);
                    photos.add(new PhotoFileDTO(tripPhoto.getUuid(), base64Image, tripPhoto.getFileName().substring(tripPhoto.getFileName().lastIndexOf('.') + 1)));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return photos;
    }

    @Transactional
    public ResponseEntity<?> deletePhoto(OAuth2User user,String tripPointId, String photoId) {
        ResponseEntity<?> response = isPhotoBelongsToUser(photoId, user);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        UUID uuid = parseUUID(photoId);
        if (uuid == null) {
            return handleInvalidUUID(photoId);
        }

        TripPhoto tripPhotoFromDB = tripPhotoRepository.findById(uuid).orElse(null);
        if (tripPhotoFromDB == null) {
            return new ResponseEntity<>("TripPhoto not found", HttpStatus.NOT_FOUND);
        }

        String userUploadDir = "/images/";
        Path userDirectory = Path.of(userUploadDir);

        if (!Files.exists(userDirectory)) {
            return new ResponseEntity<>("User directory not found", HttpStatus.NOT_FOUND);
        }

        Path filePath = userDirectory.resolve(tripPhotoFromDB.getFileName());
        try {
            Files.delete(filePath);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error deleting the photo", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        tripPhotoRepository.delete(tripPhotoFromDB);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private ResponseEntity<?> isPhotoBelongsToUser(String photoId, OAuth2User user) {
        User userFromDB = userService.getUserById(user.getAttribute("sub"));

        if (userFromDB == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        UUID uuid = parseUUID(photoId);
        if (uuid == null) {
            return handleInvalidUUID(photoId);
        }

        TripPhoto tripPhotoFromDB = tripPhotoRepository.findById(uuid).orElse(null);
        if (tripPhotoFromDB == null) {
            return new ResponseEntity<>("TripPhoto not found", HttpStatus.NOT_FOUND);
        }

        if (!tripPhotoFromDB.getTripPoint().getTrip().getUser().equals(userFromDB)) {
            return new ResponseEntity<>("TripPhoto belongs to another user", HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> updatePhoto(OAuth2User user, String photoId, String newName) {
        ResponseEntity<?> response = isPhotoBelongsToUser(photoId, user);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        UUID uuid = parseUUID(photoId);
        if (uuid == null) {
            return handleInvalidUUID(photoId);
        }

        TripPhoto tripPhotoFromDB = tripPhotoRepository.findById(uuid).orElse(null);
        if (tripPhotoFromDB == null) {
            return new ResponseEntity<>("TripPhoto not found", HttpStatus.NOT_FOUND);
        }
        tripPhotoFromDB.setName(newName);
        return new ResponseEntity<>(tripPhotoRepository.save(tripPhotoFromDB), HttpStatus.OK);
    }
}
