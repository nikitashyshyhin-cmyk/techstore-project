package com.techstore.dto;

import java.util.HashMap;
import java.util.Map;

public class NovaPoshtaApiRequest {
    private String apiKey;
    private String modelName;
    private String calledMethod;
    private Map<String, Object> methodProperties;

    public NovaPoshtaApiRequest(String apiKey, String modelName, String calledMethod) {
        this.apiKey = apiKey;
        this.modelName = modelName;
        this.calledMethod = calledMethod;
        this.methodProperties = new HashMap<>();
    }

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getCalledMethod() { return calledMethod; }
    public void setCalledMethod(String calledMethod) { this.calledMethod = calledMethod; }

    public Map<String, Object> getMethodProperties() { return methodProperties; }
    public void setMethodProperties(Map<String, Object> methodProperties) { this.methodProperties = methodProperties; }
}
