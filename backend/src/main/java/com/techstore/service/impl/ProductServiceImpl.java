package com.techstore.service.impl;

import com.techstore.dto.ProductResponse;
import com.techstore.entity.Product;
import com.techstore.repository.ProductRepository;
import com.techstore.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
            Pageable pageable
    ) {

        Page<Product> products;

        if (search == null || search.trim().isEmpty()) {

            products = productRepository.findAll(pageable);

        } else {

            products = productRepository
                    .findByNameContainingIgnoreCase(search, pageable);
        }

        return products.map(this::mapToResponse);
    }

    private ProductResponse mapToResponse(Product product) {
        String shortDescription = truncate(product.getDescription(), 100);

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getPrice(),
                shortDescription,
                product.getImageUrl()
        );
    }

    private String truncate(String text, int maxLength) {
        if (text == null) return "";
        if (text.length() <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    }
}