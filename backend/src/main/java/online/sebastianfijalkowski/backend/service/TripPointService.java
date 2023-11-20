package online.sebastianfijalkowski.backend.service;

import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.repository.TripPointRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TripPointService {
    private final TripPointRepository tripPointRepository;
}
