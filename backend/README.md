# TechStore Backend

## Вимоги

- Java 17+
- MySQL 8+

## Налаштування БД

1. Створити базу даних:

CREATE DATABASE techstore_db;

2. Налаштувати доступ у application.properties:

spring.datasource.username=root
spring.datasource.password=123456

## Запуск

Запустити клас:
TechstoreApplication

## API

POST /api/auth/register

Body:
{
  "email": "test@test.com",
  "password": "123456"
}
