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

Для роботи Full-Text Search необхідно, щоб у таблиці `products` був створений FULLTEXT INDEX.

Якщо індекс не створився автоматично, виконайте:

ALTER TABLE products
ADD FULLTEXT INDEX ft_products_name_description (name, description);
