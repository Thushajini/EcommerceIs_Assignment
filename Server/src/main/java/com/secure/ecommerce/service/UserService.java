package com.secure.ecommerce.service;

import com.secure.ecommerce.dto.UserProfileDto;
import com.secure.ecommerce.entity.User;
import com.secure.ecommerce.repository.UserRepository;
import org.owasp.esapi.ESAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserProfileDto getUserProfile(Authentication authentication) {
        String username = extractUsername(authentication);
        
        // Input validation and sanitization
        username = ESAPI.encoder().canonicalize(username);
        
        Optional<User> userOptional = userRepository.findByUsername(username);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return new UserProfileDto(
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getContactNumber(),
                user.getCountry()
            );
        }
        
        // If user doesn't exist, create from JWT claims
        return createUserFromJwt(authentication);
    }

    private UserProfileDto createUserFromJwt(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        
        String username = jwt.getClaimAsString("preferred_username");
        String name = jwt.getClaimAsString("name");
        String email = jwt.getClaimAsString("email");
        String phone = jwt.getClaimAsString("phone_number");
        String country = jwt.getClaimAsString("country");
        
        // Sanitize and validate inputs
        username = ESAPI.encoder().canonicalize(username != null ? username : "");
        name = ESAPI.encoder().canonicalize(name != null ? name : "");
        email = ESAPI.encoder().canonicalize(email != null ? email : "");
        phone = ESAPI.encoder().canonicalize(phone != null ? phone : "");
        country = ESAPI.encoder().canonicalize(country != null ? country : "");
        
        // Create user if not exists
        if (!userRepository.existsByUsername(username)) {
            User newUser = new User(username, name, email, phone, country);
            userRepository.save(newUser);
        }
        
        return new UserProfileDto(username, name, email, phone, country);
    }

    private String extractUsername(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return jwt.getClaimAsString("preferred_username");
    }
}