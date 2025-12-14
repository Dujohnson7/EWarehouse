USE [EWarehouse_DB]
GO

-- =============================================
-- FIX 4: Dynamic StockLevel Logic
-- The user requested to update StockLevel (Normal, Low Stock, Out of Stock)
-- automatically in the Stored Procedures.
-- =============================================

-- =============================================
-- 1. FIX: usp_StockMovements_Insert_IN
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
      
    -- 2. Update Stock Status and StockLevel
    IF EXISTS (SELECT 1 FROM StockStatus WHERE ProductID = @ProductID AND WarehouseID = @WarehouseID)
    BEGIN 
        -- Update existing logic with CASE statement for StockLevel
        UPDATE StockStatus
        SET Quantity = Quantity + @Quantity, 
            StockLevel = CASE 
                            WHEN (Quantity + @Quantity) <= 0 THEN 'Out of Stock'
                            WHEN (Quantity + @Quantity) < 10 THEN 'Low Stock'
                            ELSE 'Normal'
                         END,
            UpdateAt = GETDATE()
        WHERE ProductID = @ProductID AND WarehouseID = @WarehouseID;
    END
    ELSE
    BEGIN  
        -- Insert logic with CASE statement
        INSERT INTO StockStatus (ProductID, WarehouseID, Quantity, StockLevel, UpdateAt)
        VALUES (@ProductID, @WarehouseID, @Quantity, 
                CASE 
                    WHEN @Quantity <= 0 THEN 'Out of Stock' -- Should not happen on IN but for safety
                    WHEN @Quantity < 10 THEN 'Low Stock'
                    ELSE 'Normal'
                END, 
                GETDATE());
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

-- =============================================
-- 2. FIX: usp_StockMovements_Update_IN
-- =============================================
CREATE OR ALTER PROCEDURE [dbo].[usp_StockMovements_Update_IN]
    @MovementID INT,
    @NewQuantity INT,
    @ToBinID VARCHAR(50) = NULL,
    @PerformingUserID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @OldQuantity INT;
    DECLARE @ProductID INT;
    DECLARE @WarehouseID INT;
    DECLARE @OldBinID VARCHAR(50);
    DECLARE @QuantityDifference INT;

    -- Get Old Details
    SELECT @OldQuantity = Quantity, @ProductID = ProductID, @WarehouseID = WarehouseID, @OldBinID = ToBinID
    FROM StockMovements WHERE MovementID = @MovementID;

    SET @QuantityDifference = @NewQuantity - @OldQuantity;

    -- 1. Update Movement
    UPDATE StockMovements 
    SET Quantity = @NewQuantity, ToBinID = @ToBinID 
    WHERE MovementID = @MovementID;

    -- 2. Update Stock Status (with Logic)
    UPDATE StockStatus
    SET Quantity = Quantity + @QuantityDifference,
        StockLevel = CASE 
                        WHEN (Quantity + @QuantityDifference) <= 0 THEN 'Out of Stock'
                        WHEN (Quantity + @QuantityDifference) < 10 THEN 'Low Stock'
                        ELSE 'Normal'
                     END,
        UpdateAt = GETDATE()
    WHERE ProductID = @ProductID AND WarehouseID = @WarehouseID;

    -- 3. Update Old Bin (Remove Old Difference)
    IF @OldBinID IS NOT NULL
    BEGIN
        UPDATE ProductLocations 
        SET Quantity = Quantity - @OldQuantity 
        WHERE ProductID = @ProductID AND BinID = @OldBinID;
    END

    -- 4. Update New Bin (Add New Quantity)
    IF @ToBinID IS NOT NULL
    BEGIN
        IF EXISTS (SELECT 1 FROM ProductLocations WHERE ProductID = @ProductID AND BinID = @ToBinID)
        BEGIN
            UPDATE ProductLocations 
            SET Quantity = Quantity + @NewQuantity
            WHERE ProductID = @ProductID AND BinID = @ToBinID;
        END
        ELSE
        BEGIN
            INSERT INTO ProductLocations (ProductID, BinID, Quantity, AssignedAt)
            VALUES (@ProductID, @ToBinID, @NewQuantity, GETDATE());
        END
    END

    -- Audit
    INSERT INTO AuditLog (UserID, Action, CreatedAt)
    VALUES (@PerformingUserID, 'UPDATE Stock IN', GETDATE());
END
GO
