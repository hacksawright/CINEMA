-- Thêm cột order_id vào bảng tickets
ALTER TABLE tickets
ADD COLUMN order_id BIGINT;

-- Thiết lập khóa ngoại (giả định bảng orders có cột id)
ALTER TABLE tickets
ADD CONSTRAINT fk_ticket_order
FOREIGN KEY (order_id)
REFERENCES orders(id);

-- Có thể thêm chỉ mục để tối ưu hóa việc tra cứu
CREATE INDEX idx_ticket_order_id ON tickets (order_id);