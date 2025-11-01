-- V2__update_staff_table.sql
-- Cập nhật bảng staff an toàn cho Flyway + MySQL 8

-- 1️⃣ Xóa khóa ngoại nếu tồn tại
SET @stmt = (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = 'cinema_db'
        AND TABLE_NAME = 'staff'
        AND CONSTRAINT_NAME = 'fk_staff_user'
    ),
    'ALTER TABLE cinema_db.staff DROP FOREIGN KEY fk_staff_user;',
    'SELECT "fk_staff_user không tồn tại";'
  )
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

SET @stmt = (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM information_schema.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = 'cinema_db'
        AND TABLE_NAME = 'staff'
        AND CONSTRAINT_NAME = 'fk_staff_role'
    ),
    'ALTER TABLE cinema_db.staff DROP FOREIGN KEY fk_staff_role;',
    'SELECT "fk_staff_role không tồn tại";'
  )
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

-- 2️⃣ Xóa từng cột nếu tồn tại
SET @stmt = (
  SELECT IF(EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='cinema_db' AND TABLE_NAME='staff' AND COLUMN_NAME='user_id'),
  'ALTER TABLE cinema_db.staff DROP COLUMN user_id;', 'SELECT "user_id không tồn tại";')
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

SET @stmt = (
  SELECT IF(EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='cinema_db' AND TABLE_NAME='staff' AND COLUMN_NAME='role_id'),
  'ALTER TABLE cinema_db.staff DROP COLUMN role_id;', 'SELECT "role_id không tồn tại";')
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

SET @stmt = (
  SELECT IF(EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='cinema_db' AND TABLE_NAME='staff' AND COLUMN_NAME='started_at'),
  'ALTER TABLE cinema_db.staff DROP COLUMN started_at;', 'SELECT "started_at không tồn tại";')
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

SET @stmt = (
  SELECT IF(EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='cinema_db' AND TABLE_NAME='staff' AND COLUMN_NAME='created_at'),
  'ALTER TABLE cinema_db.staff DROP COLUMN created_at;', 'SELECT "created_at không tồn tại";')
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

SET @stmt = (
  SELECT IF(EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='cinema_db' AND TABLE_NAME='staff' AND COLUMN_NAME='updated_at'),
  'ALTER TABLE cinema_db.staff DROP COLUMN updated_at;', 'SELECT "updated_at không tồn tại";')
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

SET @stmt = (
  SELECT IF(EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='cinema_db' AND TABLE_NAME='staff' AND COLUMN_NAME='address'),
  'ALTER TABLE cinema_db.staff DROP COLUMN address;', 'SELECT "address không tồn tại";')
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

-- 3️⃣ Thêm các cột mới nếu chưa có
SET @stmt = (
  SELECT IF(NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='cinema_db' AND TABLE_NAME='staff' AND COLUMN_NAME='position'),
  'ALTER TABLE cinema_db.staff ADD COLUMN position VARCHAR(100);', 'SELECT "position đã tồn tại";')
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

SET @stmt = (
  SELECT IF(NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='cinema_db' AND TABLE_NAME='staff' AND COLUMN_NAME='salary'),
  'ALTER TABLE cinema_db.staff ADD COLUMN salary DECIMAL(15,2);', 'SELECT "salary đã tồn tại";')
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

SET @stmt = (
  SELECT IF(NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='cinema_db' AND TABLE_NAME='staff' AND COLUMN_NAME='role'),
  'ALTER TABLE cinema_db.staff ADD COLUMN role VARCHAR(50);', 'SELECT "role đã tồn tại";')
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;
