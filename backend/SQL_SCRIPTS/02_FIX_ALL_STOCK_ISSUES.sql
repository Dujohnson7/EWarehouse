USE [EWarehouse_DB]
GO

-- =============================================
-- CRITICAL FIX: The Table is named 'Warehouses' (Plural)
-- The original Triggers were using 'Warehouse' (Singular) which caused the crash.
-- =============================================

-- =============================================
-- 1. Fix Triggers (Alerts)
-- =============================================
CREATE OR ALTER TRIGGER trg_Alert_LowStock
ON StockStatus
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @LowStockThreshold INT = 10;
    
    INSERT INTO Alert (AlertType, Message, IsAcknowledged, CreatedAt, WarehouseID)
    SELECT DISTINCT
        'Low Stock' AS AlertType,
        CONCAT('Low stock alert: ', p.ProductName, ' in ', w.Name, '. Current quantity: ', i.Quantity) AS Message,
        0 AS IsAcknowledged,
        GETDATE() AS CreatedAt,
        w.WarehouseID -- Associating Alert with Warehouse
    FROM inserted i
    INNER JOIN Product p ON i.ProductID = p.ProductID
    INNER JOIN Warehouses w ON i.WarehouseID = w.WarehouseID -- FIXED: Warehouse -> Warehouses
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

-- =============================================
-- 2. Fix Stock IN Procedure (Prevent Partial Failures)
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[usp_StockMovements_Insert_IN]
    @ProductID INT,
    @WarehouseID INT,
    @PerformingUserID INT, 
    @ToBinID VARCHAR(50) = NULL,  
    @Quantity INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @NewMovementID INT; 
      
    -- 1. Insert Movement
    INSERT INTO StockMovements (ProductID, WarehouseID, UserID, MovementType, ToBinID, Quantity, CreatedAt )
    VALUES (@ProductID, @WarehouseID, @PerformingUserID, 'IN', @ToBinID, @Quantity, GETDATE() );
    
    SET @NewMovementID = SCOPE_IDENTITY();
      
    -- 2. Update Stock Status (This triggers the Alert Trigger above)
    IF EXISTS (SELECT 1 FROM StockStatus WHERE ProductID = @ProductID AND WarehouseID = @WarehouseID)
    BEGIN 
        UPDATE StockStatus
        SET Quantity = Quantity + @Quantity, 
            UpdateAt = GETDATE()
        WHERE ProductID = @ProductID AND WarehouseID = @WarehouseID;
    END
    ELSE
    BEGIN  
        INSERT INTO StockStatus (ProductID, WarehouseID, Quantity, StockLevel, UpdateAt)
        VALUES (@ProductID, @WarehouseID, @Quantity, 'Normal', GETDATE());
    END
     
    -- 3. Update Bin Quantity
    IF @ToBinID IS NOT NULL AND @ToBinID <> ''
    BEGIN
        IF EXISTS (SELECT 1 FROM ProductLocations WHERE ProductID = @ProductID AND BinID = @ToBinID)
        BEGIN
            UPDATE ProductLocations
            SET Quantity = Quantity + @Quantity,
                AssignedAt = GETDATE()
            WHERE ProductID = @ProductID AND BinID = @ToBinID;
        END
        ELSE
        BEGIN
            INSERT INTO ProductLocations (ProductID, BinID, Quantity, AssignedAt)
            VALUES (@ProductID, @ToBinID, @Quantity, GETDATE());
        END
    END
     
    SELECT @NewMovementID AS NewMovementID;
    
    -- 4. Audit
    INSERT INTO AuditLog (UserID, Action, CreatedAt)
    VALUES (@PerformingUserID, 'INSERT Stock IN', GETDATE());
END
GO
