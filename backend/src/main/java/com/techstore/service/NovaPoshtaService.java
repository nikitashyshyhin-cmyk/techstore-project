package com.techstore.service;

import com.techstore.dto.NovaPoshtaApiRequest;
import com.techstore.dto.NovaPoshtaApiResponse;
import com.techstore.dto.NovaPoshtaWarehouseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class NovaPoshtaService {

    private final RestTemplate restTemplate;
    private final String apiUrl;
    private final String apiKey;

    public NovaPoshtaService(
            @Value("${nova-poshta.api.url}") String apiUrl,
            @Value("${nova-poshta.api.key}") String apiKey
    ) {
        this.restTemplate = new RestTemplate();
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    public List<NovaPoshtaWarehouseDto> getWarehouses() {
        NovaPoshtaApiRequest requestBody = new NovaPoshtaApiRequest(apiKey, "AddressGeneral", "getWarehouses");
        requestBody.getMethodProperties().put("Limit", "150");

        List<NovaPoshtaWarehouseDto> result = new ArrayList<>();
        try {
            NovaPoshtaApiResponse response = restTemplate.postForObject(apiUrl, requestBody, NovaPoshtaApiResponse.class);
            if (response != null && response.isSuccess() && response.getData() != null) {
                for (Map<String, Object> item : response.getData()) {
                    String ref = (String) item.get("Ref");
                    String description = (String) item.get("Description");
                    result.add(new NovaPoshtaWarehouseDto(ref, description));
                }
            }
        } catch (Exception e) {
            // Тимчасовий fallback-список на випадок відсутності інтернету або невалідного токена під час тестування
            result.add(new NovaPoshtaWarehouseDto("ref-1", "Київ, Відділення №1: вул. Пирогівський шлях, 135"));
            result.add(new NovaPoshtaWarehouseDto("ref-2", "Харків, Відділення №1: вул. Польова, 67"));
            result.add(new NovaPoshtaWarehouseDto("ref-3", "Львів, Відділення №1: вул. Городоцька, 355-а"));
        }
        return result;
    }
}
