-- =============================================
-- SQL Trigger: Automatic Alert Generation After Stock Movement
-- =============================================

-- Trigger 1: After INSERT/UPDATE on StockStatus - Check for Low Stock
CREATE OR ALTER TRIGGER trg_Alert_LowStock
ON StockStatus
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @LowStockThreshold INT = 10;
    
    -- Insert alerts for low stock products (only if alert doesn't already exist)
    INSERT INTO Alert (AlertType, Message, IsAcknowledged, CreatedAt)
    SELECT DISTINCT
        'Low Stock' AS AlertType,
        CONCAT('Low stock alert: ', p.ProductName, ' in ', w.Name, '. Current quantity: ', i.Quantity) AS Message,
        0 AS IsAcknowledged,
        GETDATE() AS CreatedAt
    FROM inserted i
    INNER JOIN Product p ON i.ProductID = p.ProductID
    INNER JOIN Warehouse w ON i.WarehouseID = w.WarehouseID
    WHERE 
        i.Quantity < @LowStockThreshold 
        AND i.Quantity >= 0
        AND NOT EXISTS (
            SELECT 1 
            FROM Alert a
            WHERE a.AlertType = 'Low Stock'
                AND a.Message LIKE '%' + p.ProductName + '%'
                AND a.Message LIKE '%' + w.Name + '%'
                AND a.IsAcknowledged = 0
        );
END;
GO

-- Trigger 2: After INSERT on Product - Check for Missing Location
CREATE OR ALTER TRIGGER trg_Alert_MissingLocation
ON Product
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Insert alerts for products without location (only if alert doesn't already exist)
    INSERT INTO Alert (AlertType, Message, IsAcknowledged, CreatedAt)
    SELECT DISTINCT
        'Missing Location' AS AlertType,
        CONCAT('Product ''', i.ProductName, ''' has no assigned bin location') AS Message,
        0 AS IsAcknowledged,
        GETDATE() AS CreatedAt
    FROM inserted i
    WHERE NOT EXISTS (
        SELECT 1 
        FROM ProductLocation pl
        WHERE pl.ProductID = i.ProductID
    )
    AND NOT EXISTS (
        SELECT 1 
        FROM Alert a
        WHERE a.AlertType = 'Missing Location'
            AND a.Message LIKE '%' + i.ProductName + '%'
            AND a.IsAcknowledged = 0
    );
END;
GO

-- Trigger 3: After DELETE on ProductLocation - Check if product now has no location
CREATE OR ALTER TRIGGER trg_Alert_LocationRemoved
ON ProductLocation
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- For each deleted product location, check if product now has zero locations
    INSERT INTO Alert (AlertType, Message, IsAcknowledged, CreatedAt)
    SELECT DISTINCT
        'Missing Location' AS AlertType,
        CONCAT('Product ''', p.ProductName, ''' has no assigned bin location') AS Message,
        0 AS IsAcknowledged,
        GETDATE() AS CreatedAt
    FROM deleted d
    INNER JOIN Product p ON d.ProductID = p.ProductID
    WHERE NOT EXISTS (
        SELECT 1 
        FROM ProductLocation pl
        WHERE pl.ProductID = d.ProductID
    )
    AND NOT EXISTS (
        SELECT 1 
        FROM Alert a
        WHERE a.AlertType = 'Missing Location'
            AND a.Message LIKE '%' + p.ProductName + '%'
            AND a.IsAcknowledged = 0
    );
END;
GO

-- =============================================
-- How to use:
-- =============================================
-- 1. Run these CREATE/ALTER TRIGGER statements in your database
-- 2. Triggers will automatically fire when:
--    - StockStatus is inserted/updated (checks for low stock)
--    - Product is inserted (checks if it has location)
--    - ProductLocation is deleted (checks if product now has no location)
-- 3. No manual intervention needed - fully automatic!

-- =============================================
-- To disable triggers (if needed):
-- =============================================
-- DISABLE TRIGGER trg_Alert_LowStock ON StockStatus;
-- DISABLE TRIGGER trg_Alert_MissingLocation ON Product;
-- DISABLE TRIGGER trg_Alert_LocationRemoved ON ProductLocation;

-- =============================================
-- To enable triggers (if disabled):
-- =============================================
-- ENABLE TRIGGER trg_Alert_LowStock ON StockStatus;
-- ENABLE TRIGGER trg_Alert_MissingLocation ON Product;
-- ENABLE TRIGGER trg_Alert_LocationRemoved ON ProductLocation;

-- =============================================
-- To drop triggers (if you want to remove them):
-- =============================================
-- DROP TRIGGER IF EXISTS trg_Alert_LowStock;
-- DROP TRIGGER IF EXISTS trg_Alert_MissingLocation;
-- DROP TRIGGER IF EXISTS trg_Alert_LocationRemoved;
