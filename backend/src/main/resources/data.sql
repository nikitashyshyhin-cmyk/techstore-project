ALTER TABLE products
ADD FULLTEXT INDEX ft_products_name_description (name, description);