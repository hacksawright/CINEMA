-- V2__update_staff_table.sql
-- Cập nhật bảng staff: xóa cột position, salary và thêm cột address nếu chưa có

-- 1️⃣ Xóa khóa ngoại nếu tồn tại (an toàn)
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

-- 2️⃣ Xóa cột position và salary nếu có
SET @stmt = (
  SELECT IF(EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='cinema_db' AND TABLE_NAME='staff' AND COLUMN_NAME='position'),
  'ALTER TABLE cinema_db.staff DROP COLUMN position;', 'SELECT "position không tồn tại";')
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

SET @stmt = (
  SELECT IF(EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='cinema_db' AND TABLE_NAME='staff' AND COLUMN_NAME='salary'),
  'ALTER TABLE cinema_db.staff DROP COLUMN salary;', 'SELECT "salary không tồn tại";')
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

-- 3️⃣ Thêm cột address nếu chưa có
SET @stmt = (
  SELECT IF(NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='cinema_db' AND TABLE_NAME='staff' AND COLUMN_NAME='address'),
  'ALTER TABLE cinema_db.staff ADD COLUMN address VARCHAR(255);', 'SELECT "address đã tồn tại";')
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

-- ✅ Hoàn tất
SELECT 'Cập nhật bảng staff hoàn tất!' AS message;
