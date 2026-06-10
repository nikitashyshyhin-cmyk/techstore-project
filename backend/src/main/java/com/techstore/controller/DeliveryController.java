package com.techstore.controller;

import com.techstore.dto.NovaPoshtaWarehouseDto;
import com.techstore.service.NovaPoshtaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    private final NovaPoshtaService novaPoshtaService;

    public DeliveryController(NovaPoshtaService novaPoshtaService) {
        this.novaPoshtaService = novaPoshtaService;
    }

    @GetMapping("/warehouses")
    public ResponseEntity<List<NovaPoshtaWarehouseDto>> getWarehouses() {
        return ResponseEntity.ok(novaPoshtaService.getWarehouses());
    }
}
