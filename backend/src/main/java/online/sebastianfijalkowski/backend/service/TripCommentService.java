package online.sebastianfijalkowski.backend.service;

import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.repository.TripCommentRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TripCommentService {
    private final TripCommentRepository tripCommentRepository;
}
