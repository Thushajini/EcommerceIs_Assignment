package com.secure.ecommerce.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalTime;

public class PurchaseDto {
    private Long id;

    @NotNull(message = "Purchase date is required")
    @FutureOrPresent(message = "Purchase date must be today or in the future")
    private LocalDate purchaseDate;

    @NotNull(message = "Delivery time is required")
    private LocalTime deliveryTime;

    @NotBlank(message = "Delivery location is required")
    @Size(max = 100, message = "Delivery location must not exceed 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s,.-]+$", message = "Delivery location contains invalid characters")
    private String deliveryLocation;

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must not exceed 100 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s,.-]+$", message = "Product name contains invalid characters")
    private String productName;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 999, message = "Quantity must not exceed 999")
    private Integer quantity;

    @Size(max = 500, message = "Message must not exceed 500 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s,.!?'-]*$", message = "Message contains invalid characters")
    private String message;

    // Constructors
    public PurchaseDto() {}

    public PurchaseDto(Long id, LocalDate purchaseDate, LocalTime deliveryTime, String deliveryLocation,
                      String productName, Integer quantity, String message) {
        this.id = id;
        this.purchaseDate = purchaseDate;
        this.deliveryTime = deliveryTime;
        this.deliveryLocation = deliveryLocation;
        this.productName = productName;
        this.quantity = quantity;
        this.message = message;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

    public LocalTime getDeliveryTime() { return deliveryTime; }
    public void setDeliveryTime(LocalTime deliveryTime) { this.deliveryTime = deliveryTime; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}