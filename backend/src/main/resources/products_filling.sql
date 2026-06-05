-- Очищення таблиці перед наповненням (щоб уникнути дублювання даних при перезапусках)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE product_categories;
TRUNCATE TABLE categories;
TRUNCATE TABLE products;

-- Починаємо AUTO_INCREMENT з початку щоб працювали категорії
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE categories AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

-- Наповнення каталогу товарів у твоєму строгому порядку стовпців (без ID)
INSERT INTO products (description, image_url, name, price) VALUES 
('Ефективний ноутбук для навчання та роботи з процесором Intel Core i3.', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/i/p/ip_slim_3_15irh10_lunagrey.jpg', 'Laptop Lenovo IdeaPad Slim 3', 31000.00),
('Флагманський смартфон для повсякденних задач.', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/i/p/iphone_17_pro_max_silver_pdp_image_position_1__ce-ww_1_.jpg', 'Apple iPhone 17 Pro Max 256Gb Silver', 69999.00),
('Тонкий та потужний ноутбук від Apple на базі чипа M5. Безшумна робота.', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/1/_/1_macbook_air_15-in_m5_midnight_pdp_image_position_1__ce-ww.jpg', 'Apple MacBook Air 15.3 M5 16GB 512GB Midnight', 76499.00),
('Ізогнутий ігровий монітор 27 дюймів із частотою оновлення 144 Гц.', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/l/s/ls27fg500eixua.jpg', 'Samsung Odyssey G5 Monitor', 10999.00),
('Потужний ігровий ноутбук із відеокартою RTX 5050.', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/6/7/67a239b89b6c40.49448004_1.jpg', 'Asus ROG Strix G18', 66999.00),
('Потужний смартфон за співвідношенням ціна/якість з екраном AMOLED.', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/s/m/sm-s731_jetblack_001_front_1_.jpg', 'Samsung Galaxy S25FE 8/256Gb Jetblack', 31499.00),
('Преміальні бездротові навушники з найкращим на ринку активним шумопоглинанням.', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/a/i/airpods-pro-3-hero-select-202509.jpg', 'Apple AirPods Pro 3 ', 14099.00),
('Компактні навушники-вкладиші із чистим звуком від AKG.', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/g/a/galaxy_buds3_fe_gray_007_case_opened_1_.jpg', 'TWS Samsung Galaxy Buds3 FE Grey', 4199.00),
('Процесор Intel Core i9-14900KF, 24 ядра, частота до 6.0 GHz.', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/1/4/1400_gallery_1705678460164265_0.jpg', 'Intel Core I9-14900KF', 27999.00),
('Процесор AMD Ryzen 7 9700X, 8 ядер, для виконання важких задач.', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/_/_/__2024-12-11_155335261-photoroom_1.jpg', 'AMD Ryzen 7 9700X', 13499.00),
('Відеокарта NVIDIA GeForce RTX 5070 12GB, підходить для важких ігор.', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/8/f/8f5ec499d15a67340b5bb3f4de724a3e-photoroom.jpg', 'NVIDIA GeForce RTX 5070', 32779.00),
('Відеокарта Asus TUF Gaming GeForce RTX 5080 16GB GDDR7 OC Edition', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/1/1/11_asus_tuf_gaming_geforce_rtx_5080_16gb_gddr7_oc_edition_tuf-rtx5080-o16g-gaming_.jpg', 'Asus TUF Gaming GeForce RTX 5080', 84599.00),
('Миша бездротова ігрова Logitech G Pro X Superlight 2 LightSpeed White. Роздільна здатність оптичного сенсора миші 32000 dpi', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/1/_/1_69__1.jpg', 'Logitech G Pro X Superlight 2', 4999.00),
('Оперативна пам''ять DDR5 64GB (2x32GB) 6000MHz.', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/6/0/600_gallery_16964018923317_0.jpg', 'Corsair Vengeance DDR5 32GB', 39399.00),
('SSD-накопичувач внутрішній Samsung 990 Pro 2TB M.2 PCIe 4.0x4', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/3/q/3qmz-v9p2t0gw9e50900f7a8563ff9aa0764e2df8c8b8.png', 'Samsung 990 Pro 2TB', 19099.00),
('Материнська плата Asus ROG STRIX X870E-E GAMING WIFI DDR5. Додаткові можливості:Bluetooth, S/PDIF, USB 3.0, USB 3.1, USB Type C, Wi-Fi', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/h/7/h732-photoroom.jpg', 'Asus ROG STRIX X870E-E', 24799.00),
('Блок живлення для ПК MSI MAG A1000GL PCIE5. Вихідна потужність: 1000 Вт', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/_/_/__2025-05-08_020938961-photoroom.jpg', 'MSI MAG A1000GL PCIE5', 5200.00),
('Процесор Intel Core i5-14400F Box (BX8071514400F), 10 ядер.', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/c/o/core_i5-14400_2.jpg', 'Intel Core i5-14400F', 9445.00),
('Клавіатура бездротова ігрова Aula F75 3 in 1 Wired+2.4G wireless +BT', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/1/_/1_aula_f75_3_in_1_wired_2.4g_wireless_bt_6948391208626_.jpg', 'Aula F75', 2499.00),
('Мікрофон до комп''ютера Fifine A6T. Конденсаторний, односпрямований. Тип підключення: USB.', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/a/6/a6t_1_.jpg', 'Fifine A6T', 3199.00),
('Килимок для миші ігровий Hator Tonn Evo M (HTP-021)', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/h/a/hator-tonn-evo-m_800_1.jpg', 'Hator Tonn Evo M', 349.00),
('Гарнітура дротова ігрова HyperX Cloud III Black-Red. Мікрофон з''ємний.', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/3/5/356505159.jpg', 'HyperX Cloud III Black-Red', 4999.00),
('Корпус Gamdias ATLAS M3M Mini-Tower PC Case (4711514503807). 3 вентилятори. Можливість рідинного охолодження', 'https://cdn.comfy.ua/media/catalog/product/cache/5/image/600x/9df78eab33525d08d6e5fb8d27136e95/a/t/atlas_m3m_slogan-removebg-preview.jpg', 'Gamdias ATLAS M3M Mini-Tower PC Case', 3299.00);

INSERT INTO categories (name) VALUES
('Ноутбуки'),
('Смартфони'),
('Навушники'),
('Процесори'),
('Відеокарти'),
('Комплектуючі'),
('Периферія'),
('Монітори');

INSERT INTO product_categories (product_id, category_id) VALUES

(1, 1),
(3, 1),
(5, 1),

(2, 2),
(6, 2),

(7, 3),
(8, 3),
(22, 3),

(9, 4),
(10, 4),
(18, 4),

(11, 5),
(12, 5),

(14, 6),
(15, 6),
(16, 6),
(17, 6),
(23, 6),

(13, 7),
(19, 7),
(20, 7),
(21, 7),

(4, 8);
