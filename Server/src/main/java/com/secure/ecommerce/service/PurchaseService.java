package com.secure.ecommerce.service;

import com.secure.ecommerce.dto.PurchaseDto;
import com.secure.ecommerce.entity.Purchase;
import com.secure.ecommerce.entity.User;
import com.secure.ecommerce.repository.PurchaseRepository;
import com.secure.ecommerce.repository.UserRepository;
import org.owasp.esapi.ESAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PurchaseService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private UserRepository userRepository;

    private static final List<String> VALID_DELIVERY_TIMES = Arrays.asList("10:00", "11:00", "12:00");
    private static final List<String> VALID_DISTRICTS = Arrays.asList(
        "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
        "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
        "Mullaitivu", "Vavuniya", "Puttalam", "Kurunegala", "Anuradhapura",
        "Polonnaruwa", "Badulla", "Moneragala", "Ratnapura", "Kegalle",
        "Ampara", "Batticaloa", "Trincomalee"
    );
    private static final List<String> VALID_PRODUCTS = Arrays.asList(
        "Laptop", "Smartphone", "Tablet", "Headphones", "Camera", "Watch",
        "Speaker", "Monitor", "Keyboard", "Mouse", "Printer", "Router"
    );

    public List<PurchaseDto> getAllPurchases(Authentication authentication) {
        String username = extractAndValidateUsername(authentication);
        
        List<Purchase> purchases = purchaseRepository.findByUserUsernameOrderByPurchaseDateDesc(username);
        
        return purchases.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<PurchaseDto> getUpcomingPurchases(Authentication authentication) {
        String username = extractAndValidateUsername(authentication);
        LocalDate today = LocalDate.now();
        
        List<Purchase> purchases = purchaseRepository.findUpcomingPurchasesByUsername(username, today);
        
        return purchases.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<PurchaseDto> getPastPurchases(Authentication authentication) {
        String username = extractAndValidateUsername(authentication);
        LocalDate today = LocalDate.now();
        
        List<Purchase> purchases = purchaseRepository.findPastPurchasesByUsername(username, today);
        
        return purchases.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public PurchaseDto createPurchase(PurchaseDto purchaseDto, Authentication authentication) {
        String username = extractAndValidateUsername(authentication);
        
        // Validate purchase data
        validatePurchaseData(purchaseDto);
        
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOptional.get();
        
        Purchase purchase = new Purchase(
            user,
            purchaseDto.getPurchaseDate(),
            purchaseDto.getDeliveryTime(),
            ESAPI.encoder().canonicalize(purchaseDto.getDeliveryLocation()),
            ESAPI.encoder().canonicalize(purchaseDto.getProductName()),
            purchaseDto.getQuantity(),
            ESAPI.encoder().canonicalize(purchaseDto.getMessage())
        );
        
        Purchase savedPurchase = purchaseRepository.save(purchase);
        return convertToDto(savedPurchase);
    }

    private void validatePurchaseData(PurchaseDto purchaseDto) {
        // Validate date (not Sunday and not in the past)
        LocalDate purchaseDate = purchaseDto.getPurchaseDate();
        if (purchaseDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
            throw new IllegalArgumentException("Sunday deliveries are not available");
        }
        
        if (purchaseDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Purchase date cannot be in the past");
        }
        
        // Validate delivery time
        String timeStr = purchaseDto.getDeliveryTime().toString();
        if (!VALID_DELIVERY_TIMES.contains(timeStr)) {
            throw new IllegalArgumentException("Invalid delivery time. Valid times are: 10:00 AM, 11:00 AM, 12:00 PM");
        }
        
        // Validate delivery location
        if (!VALID_DISTRICTS.contains(purchaseDto.getDeliveryLocation())) {
            throw new IllegalArgumentException("Invalid delivery location");
        }
        
        // Validate product name
        if (!VALID_PRODUCTS.contains(purchaseDto.getProductName())) {
            throw new IllegalArgumentException("Invalid product name");
        }
    }

    private String extractAndValidateUsername(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String username = jwt.getClaimAsString("preferred_username");
        
        // Sanitize username to prevent injection attacks
        return ESAPI.encoder().canonicalize(username);
    }

    private PurchaseDto convertToDto(Purchase purchase) {
        return new PurchaseDto(
            purchase.getId(),
            purchase.getPurchaseDate(),
            purchase.getDeliveryTime(),
            purchase.getDeliveryLocation(),
            purchase.getProductName(),
            purchase.getQuantity(),
            purchase.getMessage()
        );
    }

    public List<String> getValidDistricts() {
        return VALID_DISTRICTS;
    }

    public List<String> getValidProducts() {
        return VALID_PRODUCTS;
    }

    public List<String> getValidDeliveryTimes() {
        return Arrays.asList("10:00 AM", "11:00 AM", "12:00 PM");
    }
}