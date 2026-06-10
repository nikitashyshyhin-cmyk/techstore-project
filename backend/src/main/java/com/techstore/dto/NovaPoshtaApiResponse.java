package com.techstore.dto;

import java.util.List;
import java.util.Map;

public class NovaPoshtaApiResponse {
    private boolean success;
    private List<Map<String, Object>> data;

    public NovaPoshtaApiResponse() {
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public List<Map<String, Object>> getData() { return data; }
    public void setData(List<Map<String, Object>> data) { this.data = data; }
}
