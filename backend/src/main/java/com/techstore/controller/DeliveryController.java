package com.techstore.controller;

import com.techstore.dto.NovaPoshtaWarehouseDto;
import com.techstore.service.NovaPoshtaService;
import com.techstore.dto.NovaPoshtaCityDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    private final NovaPoshtaService novaPoshtaService;

    public DeliveryController(NovaPoshtaService novaPoshtaService) {
        this.novaPoshtaService = novaPoshtaService;
    }

    @GetMapping("/cities")
    public ResponseEntity<List<NovaPoshtaCityDto>> getCities(@RequestParam(required = false, defaultValue = "") String cityName) {
        return ResponseEntity.ok(novaPoshtaService.getCities(cityName));
    }

    @GetMapping("/warehouses")
    public ResponseEntity<List<NovaPoshtaWarehouseDto>> getWarehouses(@RequestParam String cityRef) {
        return ResponseEntity.ok(novaPoshtaService.getWarehouses(cityRef));
    }
}
