package com.techstore.repository;

import com.techstore.entity.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(
            value =
                    "SELECT * " +
                    "FROM products " +
                    "WHERE " +
                    "MATCH(name, description) " +
                    "AGAINST(:search IN NATURAL LANGUAGE MODE) " +
                    "OR LOWER(name) LIKE LOWER(CONCAT('%', :search, '%')) " +
                    "OR LOWER(description) LIKE LOWER(CONCAT('%', :search, '%'))",
            countQuery =
                    "SELECT COUNT(*) " +
                    "FROM products " +
                    "WHERE " +
                    "MATCH(name, description) " +
                    "AGAINST(:search IN NATURAL LANGUAGE MODE) " +
                    "OR LOWER(name) LIKE LOWER(CONCAT('%', :search, '%')) " +
                    "OR LOWER(description) LIKE LOWER(CONCAT('%', :search, '%'))",
            nativeQuery = true
    )
    Page<Product> fullTextSearch(
            @Param("search") String search,
            Pageable pageable
    );

    Page<Product> findByCategories_Id(
            Long categoryId,
            Pageable pageable
    );

    @Query(
            value =
                    "SELECT DISTINCT p.* " +
                    "FROM products p " +
                    "JOIN product_categories pc " +
                    "ON p.id = pc.product_id " +
                    "WHERE pc.category_id = :categoryId " +
                    "AND (" +
                    "MATCH(p.name, p.description) " +
                    "AGAINST(:search IN NATURAL LANGUAGE MODE) " +
                    "OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
                    "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))" +
                    ")",
            countQuery =
                    "SELECT COUNT(DISTINCT p.id) " +
                    "FROM products p " +
                    "JOIN product_categories pc " +
                    "ON p.id = pc.product_id " +
                    "WHERE pc.category_id = :categoryId " +
                    "AND (" +
                    "MATCH(p.name, p.description) " +
                    "AGAINST(:search IN NATURAL LANGUAGE MODE) " +
                    "OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
                    "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))" +
                    ")",
            nativeQuery = true
    )
    Page<Product> fullTextSearchByCategory(
            @Param("search") String search,
            @Param("categoryId") Long categoryId,
            Pageable pageable
    );

    Page<Product> findByCategories_Id(
            Long categoryId,
            Pageable pageable
    );

    Page<Product> findByNameContainingIgnoreCaseAndCategories_Id(
            String name,
            Long categoryId,
            Pageable pageable
    );
}