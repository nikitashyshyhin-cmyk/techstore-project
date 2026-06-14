package com.techstore.service;

import com.techstore.dto.NovaPoshtaApiRequest;
import com.techstore.dto.NovaPoshtaApiResponse;
import com.techstore.dto.NovaPoshtaWarehouseDto;
import com.techstore.dto.NovaPoshtaCityDto;
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

    public List<NovaPoshtaWarehouseDto> getWarehouses(String cityRef) {
        // Змінюємо модель на "Address" (це правильна модель для фільтрації по місту)
        NovaPoshtaApiRequest requestBody = new NovaPoshtaApiRequest(apiKey, "Address", "getWarehouses");

        // Передаємо Ref міста (trim() прибирає випадкові пробіли, якщо вони є)
        requestBody.getMethodProperties().put("CityRef", cityRef.trim());

        // Ставимо ліміт на 500 відділень, щоб API гарантовано віддало результат і не впало від перевантаження
        requestBody.getMethodProperties().put("Limit", "500");

        List<NovaPoshtaWarehouseDto> result = new ArrayList<>();
        try {
            NovaPoshtaApiResponse response = restTemplate.postForObject(apiUrl, requestBody, NovaPoshtaApiResponse.class);
            if (response != null && response.isSuccess() && response.getData() != null) {
                for (Map<String, Object> item : response.getData()) {
                    String ref = (String) item.get("Ref");
                    String description = (String) item.get("Description");
                    result.add(new NovaPoshtaWarehouseDto(ref, description));
                }
            } else {
                // API відповіло, але response.isSuccess() == false (наприклад, невалідний токен)
                System.out.println("Нова Пошта API повернула success=false для відділень. Застосовано fallback-список.");
                result.add(new NovaPoshtaWarehouseDto("ref-wh-1", "Відділення №1: вул. Центральна, 1"));
                result.add(new NovaPoshtaWarehouseDto("ref-wh-2", "Відділення №2: вул. Київська, 22"));
                result.add(new NovaPoshtaWarehouseDto("ref-wh-3", "Поштомат №123: пр. Науки, 14"));
            }
        } catch (Exception e) {
            // Мережевий збій або відсутність інтернету
            System.out.println("Помилка з'єднання з Нова Пошта API: " + e.getMessage());
            result.add(new NovaPoshtaWarehouseDto("ref-wh-1", "Відділення №1: вул. Центральна, 1"));
            result.add(new NovaPoshtaWarehouseDto("ref-wh-2", "Відділення №2: вул. Київська, 22"));
            result.add(new NovaPoshtaWarehouseDto("ref-wh-3", "Поштомат №123: пр. Науки, 14"));
        }
        return result;
    }

    public List<NovaPoshtaCityDto> getCities(String cityName) {
        NovaPoshtaApiRequest requestBody = new NovaPoshtaApiRequest(apiKey, "Address", "getCities");
        if (cityName != null && !cityName.trim().isEmpty()) {
            requestBody.getMethodProperties().put("FindByString", cityName);
        }
        requestBody.getMethodProperties().put("Limit", "50");

        List<NovaPoshtaCityDto> result = new ArrayList<>();
        try {
            NovaPoshtaApiResponse response = restTemplate.postForObject(apiUrl, requestBody, NovaPoshtaApiResponse.class);
            if (response != null && response.isSuccess() && response.getData() != null) {
                for (Map<String, Object> item : response.getData()) {
                    String ref = (String) item.get("Ref");
                    String description = (String) item.get("Description");
                    result.add(new NovaPoshtaCityDto(ref, description));
                }
            } else {
                // API відповіло бізнес-помилкою
                System.out.println("Нова Пошта API повернула success=false для міст. Застосовано fallback-список.");
                result.add(new NovaPoshtaCityDto("ref-city-1", "Київ"));
                result.add(new NovaPoshtaCityDto("ref-city-2", "Харків"));
                result.add(new NovaPoshtaCityDto("ref-city-3", "Львів"));
                result.add(new NovaPoshtaCityDto("ref-city-4", "Одеса"));
                result.add(new NovaPoshtaCityDto("ref-city-5", "Дніпро"));
            }
        } catch (Exception e) {
            // Мережевий збій
            System.out.println("Помилка з'єднання з Нова Пошта API (міста): " + e.getMessage());
            result.add(new NovaPoshtaCityDto("ref-city-1", "Київ"));
            result.add(new NovaPoshtaCityDto("ref-city-2", "Харків"));
            result.add(new NovaPoshtaCityDto("ref-city-3", "Львів"));
            result.add(new NovaPoshtaCityDto("ref-city-4", "Одеса"));
            result.add(new NovaPoshtaCityDto("ref-city-5", "Дніпро"));
        }
        return result;
    }
}
