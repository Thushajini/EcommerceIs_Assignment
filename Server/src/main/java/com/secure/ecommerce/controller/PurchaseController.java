package com.secure.ecommerce.controller;

import com.secure.ecommerce.dto.PurchaseDto;
import com.secure.ecommerce.service.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class PurchaseController {

    @Autowired
    private PurchaseService purchaseService;

    @GetMapping
    public ResponseEntity<List<PurchaseDto>> getAllPurchases(Authentication authentication) {
        try {
            List<PurchaseDto> purchases = purchaseService.getAllPurchases(authentication);
            return ResponseEntity.ok(purchases);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<PurchaseDto>> getUpcomingPurchases(Authentication authentication) {
        try {
            List<PurchaseDto> purchases = purchaseService.getUpcomingPurchases(authentication);
            return ResponseEntity.ok(purchases);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/past")
    public ResponseEntity<List<PurchaseDto>> getPastPurchases(Authentication authentication) {
        try {
            List<PurchaseDto> purchases = purchaseService.getPastPurchases(authentication);
            return ResponseEntity.ok(purchases);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createPurchase(@Valid @RequestBody PurchaseDto purchaseDto, 
                                          BindingResult bindingResult, 
                                          Authentication authentication) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            PurchaseDto createdPurchase = purchaseService.createPurchase(purchaseDto, authentication);
            return ResponseEntity.ok(createdPurchase);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "An unexpected error occurred");
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/options")
    public ResponseEntity<Map<String, List<String>>> getPurchaseOptions() {
        Map<String, List<String>> options = new HashMap<>();
        options.put("districts", purchaseService.getValidDistricts());
        options.put("products", purchaseService.getValidProducts());
        options.put("deliveryTimes", purchaseService.getValidDeliveryTimes());
        return ResponseEntity.ok(options);
    }
}