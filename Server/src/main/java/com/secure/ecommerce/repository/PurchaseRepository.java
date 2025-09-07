package com.secure.ecommerce.repository;

import com.secure.ecommerce.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    
    @Query("SELECT p FROM Purchase p WHERE p.user.username = :username ORDER BY p.purchaseDate DESC, p.createdAt DESC")
    List<Purchase> findByUserUsernameOrderByPurchaseDateDesc(@Param("username") String username);
    
    @Query("SELECT p FROM Purchase p WHERE p.user.username = :username AND p.purchaseDate >= :date ORDER BY p.purchaseDate DESC, p.createdAt DESC")
    List<Purchase> findUpcomingPurchasesByUsername(@Param("username") String username, @Param("date") LocalDate date);
    
    @Query("SELECT p FROM Purchase p WHERE p.user.username = :username AND p.purchaseDate < :date ORDER BY p.purchaseDate DESC, p.createdAt DESC")
    List<Purchase> findPastPurchasesByUsername(@Param("username") String username, @Param("date") LocalDate date);
    
    @Query("SELECT COUNT(p) FROM Purchase p WHERE p.user.username = :username")
    long countByUserUsername(@Param("username") String username);
}