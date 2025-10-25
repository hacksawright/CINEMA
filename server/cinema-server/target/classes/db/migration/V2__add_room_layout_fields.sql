-- V2_add_room_layout_fields.sql
ALTER TABLE rooms ADD COLUMN total_rows INT NOT NULL DEFAULT 10;
ALTER TABLE rooms ADD COLUMN seats_per_row INT NOT NULL DEFAULT 12;