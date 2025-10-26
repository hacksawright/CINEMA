-- V4__add_ticket_code_to_orders.sql
ALTER TABLE orders ADD COLUMN ticket_code VARCHAR(50) UNIQUE;