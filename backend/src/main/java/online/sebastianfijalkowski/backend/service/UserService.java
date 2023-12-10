package online.sebastianfijalkowski.backend.service;

import lombok.RequiredArgsConstructor;
import online.sebastianfijalkowski.backend.model.User;
import online.sebastianfijalkowski.backend.repository.UserRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;

    public User addUserIfNotExist(OAuth2User user) {
        String uuid = user.getAttribute("sub");
        String name = user.getAttribute("name");
        String email = user.getAttribute("email");
        String picture = user.getAttribute("picture");

        var userFromDB = userRepository.findById(uuid).orElse(null);
        if (userFromDB == null) {
            userFromDB = userRepository.save(new User(uuid, name, email, picture , new ArrayList<>()));
        }
        return userFromDB;
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }
}
