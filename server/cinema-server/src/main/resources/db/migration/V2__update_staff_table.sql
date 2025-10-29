-- V2__update_staff_table.sql

ALTER TABLE cinema_db.staff
    DROP FOREIGN KEY fk_staff_user;
ALTER TABLE cinema_db.staff
    DROP FOREIGN KEY fk_staff_role;


-- 2. Xóa các cột cũ không cần thiết
ALTER TABLE cinema_db.staff
DROP COLUMN user_id;
ALTER TABLE cinema_db.staff
DROP COLUMN role_id;
ALTER TABLE cinema_db.staff
DROP COLUMN started_at;
ALTER TABLE cinema_db.staff
DROP COLUMN created_at;
ALTER TABLE cinema_db.staff
DROP COLUMN updated_at;
ALTER TABLE cinema_db.staff
DROP COLUMN address;

-- 3. Thêm các cột mới theo yêu cầu
ALTER TABLE cinema_db.staff
ADD COLUMN position VARCHAR(100),
ADD COLUMN salary DECIMAL(15,2),
ADD COLUMN role VARCHAR(50);
