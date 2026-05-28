package com.techstore.service.impl;

import com.techstore.dto.CategoryResponse;
import com.techstore.dto.ProductDetailResponse;
import com.techstore.dto.ProductResponse;
import com.techstore.entity.Product;
import com.techstore.exception.ResourceNotFoundException;
import com.techstore.repository.ProductRepository;
import com.techstore.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Page<ProductResponse> getProducts(
            String search,
            Long categoryId,
            Pageable pageable
    ) {

        Page<Product> products;

        boolean hasSearch =
                search != null &&
                !search.trim().isEmpty();

        boolean hasCategory =
                categoryId != null;

        if (hasSearch && hasCategory) {

            products = productRepository.fullTextSearchByCategory(
                    search,
                    categoryId,
                    pageable
            );

        } else if (hasSearch) {

            products = productRepository.fullTextSearch(
                    search,
                    pageable
            );

        } else if (hasCategory) {

            products = productRepository.findByCategories_Id(
                    categoryId,
                    pageable
            );

            products = productRepository
                    .findByNameContainingIgnoreCase(
                            search,
                            pageable
                    );

        }
        // Тільки категорія
        else if (hasCategory) {

            products = productRepository.findAll(pageable);
        }

        return products.map(this::mapToResponse);
    }

    private ProductResponse mapToResponse(Product product) {

        String shortDescription = truncate(
                product.getDescription(),
                55
        );

        Set<CategoryResponse> categories = product
                .getCategories()
                .stream()
                .map(category ->
                        new CategoryResponse(
                                category.getId(),
                                category.getName()
                        )
                )
                .collect(Collectors.toSet());

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getPrice(),
                shortDescription,
                product.getImageUrl(),
                categories
        );
    }

    private String truncate(String text, int maxLength) {

        if (text == null) return "";

        if (text.length() <= maxLength) {
            return text;
        }

        return text.substring(0, maxLength) + "...";
    }

    @Override
    public ProductDetailResponse getProductById(Long id) {

        Product product = productRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + id
                        )
                );

        return new ProductDetailResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl()
        );
    }
}
