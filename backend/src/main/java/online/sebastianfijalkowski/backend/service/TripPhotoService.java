package online.sebastianfijalkowski.backend.service;

import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.repository.TripPhotoRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TripPhotoService {
    private final TripPhotoRepository tripPhotoRepository;
}
