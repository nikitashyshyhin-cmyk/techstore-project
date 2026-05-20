package com.techstore.service;

import com.techstore.dto.ProductResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {

    Page<ProductResponse> getProducts(
            String search,
            Pageable pageable
    );
}