package com.techstore.controller;

import com.techstore.dto.ProductDetailResponse;
import com.techstore.dto.ProductResponse;
import com.techstore.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public Page<ProductResponse> getProducts(

            @RequestParam(required = false) String search,

            @RequestParam(required = false) Long categoryId,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        return productService.getProducts(
                search,
                categoryId,
                pageable
        );
    }

    @GetMapping("/{id}")
    public ProductDetailResponse getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }
}