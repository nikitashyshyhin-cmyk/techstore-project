package com.techstore.dto;

public class NovaPoshtaCityDto {
    private String ref;
    private String description;

    public NovaPoshtaCityDto() {
    }

    public NovaPoshtaCityDto(String ref, String description) {
        this.ref = ref;
        this.description = description;
    }

    public String getRef() { return ref; }
    public void setRef(String ref) { this.ref = ref; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
