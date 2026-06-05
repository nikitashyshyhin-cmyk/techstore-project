package com.techstore.service;

import com.techstore.dto.ProductDetailResponse;
import com.techstore.dto.ProductResponse;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.techstore.dto.PopularProductDto;

public interface ProductService {

    Page<ProductResponse> getProducts(
            String search,
            Long categoryId,
            Pageable pageable
    );

    ProductDetailResponse getProductById(Long id);
    
    List<PopularProductDto> getPopularProducts();
}