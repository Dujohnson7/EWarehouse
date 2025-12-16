USE [EWarehouse_DB]
GO

-- =============================================
-- 1. Fix INSERT OUT (Support Bin Deduction)
-- =============================================
ALTER PROCEDURE [dbo].[usp_StockMovements_Insert_OUT]
    @ProductID INT,
    @WarehouseID INT, 
    @FromBinID VARCHAR(50) = NULL, 
    @Quantity INT,
    @Reason VARCHAR(255) = NULL, 
    @PerformingUserID INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @NewMovementID INT; 
    
    INSERT INTO StockMovements (ProductID, WarehouseID, UserID, MovementType, FromBinID, Quantity, Reason, CreatedAt)
    VALUES (@ProductID, @WarehouseID, @PerformingUserID, 'OUT', @FromBinID, @Quantity, @Reason, GETDATE() );
    
    SET @NewMovementID = SCOPE_IDENTITY();
    
    -- 1. Update Warehouse Total
    IF EXISTS (SELECT 1 FROM StockStatus WHERE ProductID = @ProductID AND WarehouseID = @WarehouseID)
    BEGIN
        UPDATE StockStatus
        SET Quantity = Quantity - @Quantity,
            UpdateAt = GETDATE()
        WHERE ProductID = @ProductID AND WarehouseID = @WarehouseID;
    END

    -- 2. Update Bin Quantity (ProductLocation)
    IF @FromBinID IS NOT NULL AND @FromBinID <> ''
    BEGIN
        UPDATE ProductLocations
        SET Quantity = Quantity - @Quantity,
            AssignedAt = GETDATE()
        WHERE ProductID = @ProductID AND BinID = @FromBinID;
    END
    
    SELECT @NewMovementID AS NewMovementID;
    
    INSERT INTO AuditLog (UserID, Action, CreatedAt)
    VALUES (@PerformingUserID, 'INSERT Stock OUT', GETDATE());
END
GO

-- =============================================
-- 2. Fix UPDATE IN (Support Bin Changes)
-- =============================================
ALTER PROCEDURE [dbo].[usp_StockMovements_Update_IN]
    @MovementID INT,
    @NewQuantity INT,
    @ToBinID VARCHAR(50) = NULL,
    @PerformingUserID INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @OldQuantity INT;
    DECLARE @OldBinID VARCHAR(50);
    DECLARE @ProductID INT;
    DECLARE @WarehouseID INT;
    DECLARE @Difference INT;

    SELECT 
        @OldQuantity = Quantity,
        @OldBinID = ToBinID,
        @ProductID = ProductID,
        @WarehouseID = WarehouseID
    FROM StockMovements
    WHERE MovementID = @MovementID;

    IF @OldQuantity IS NOT NULL
    BEGIN
        -- 1. Revert Old Bin (Subtract Old Qty)
        IF @OldBinID IS NOT NULL AND @OldBinID <> ''
        BEGIN
            UPDATE ProductLocations
            SET Quantity = Quantity - @OldQuantity
            WHERE ProductID = @ProductID AND BinID = @OldBinID;
        END

        -- 2. Apply New Bin (Add New Qty)
        IF @ToBinID IS NOT NULL AND @ToBinID <> ''
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

        -- 3. Update Warehouse Total
        SET @Difference = @NewQuantity - @OldQuantity;
        UPDATE StockStatus
        SET Quantity = Quantity + @Difference,
            UpdateAt = GETDATE()
        WHERE ProductID = @ProductID AND WarehouseID = @WarehouseID;

        -- 4. Update Movement Record
        UPDATE StockMovements
        SET Quantity = @NewQuantity,
            ToBinID = @ToBinID,
            UserID = @PerformingUserID,
            CreatedAt = GETDATE() 
        WHERE MovementID = @MovementID;

        INSERT INTO AuditLog (UserID, Action, CreatedAt)
        VALUES (@PerformingUserID, 'UPDATE Stock IN', GETDATE());
    END
END
GO

-- =============================================
-- 3. Fix UPDATE OUT (Support Bin Changes)
-- =============================================
ALTER PROCEDURE [dbo].[usp_StockMovements_Update_OUT]
    @MovementID INT,
    @NewQuantity INT,
    @FromBinID VARCHAR(50) = NULL,
    @Reason VARCHAR(255) = NULL,
    @PerformingUserID INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @OldQuantity INT;
    DECLARE @OldBinID VARCHAR(50);
    DECLARE @ProductID INT;
    DECLARE @WarehouseID INT;
    DECLARE @Difference INT;

    SELECT 
        @OldQuantity = Quantity,
        @OldBinID = FromBinID,
        @ProductID = ProductID,
        @WarehouseID = WarehouseID
    FROM StockMovements
    WHERE MovementID = @MovementID;

    IF @OldQuantity IS NOT NULL
    BEGIN
        -- 1. Revert Old Bin (Add back Old Qty)
        IF @OldBinID IS NOT NULL AND @OldBinID <> ''
        BEGIN
            UPDATE ProductLocations
            SET Quantity = Quantity + @OldQuantity
            WHERE ProductID = @ProductID AND BinID = @OldBinID;
        END

        -- 2. Apply New Bin (Subtract New Qty)
        IF @FromBinID IS NOT NULL AND @FromBinID <> ''
        BEGIN
            UPDATE ProductLocations
            SET Quantity = Quantity - @NewQuantity
            WHERE ProductID = @ProductID AND BinID = @FromBinID;
        END

        -- 3. Update Warehouse Total
        SET @Difference = @NewQuantity - @OldQuantity;
        -- For OUT, if New > Old, we removed MORE, so we subtract valid difference
        -- Logic: Stock = Stock + Old - New = Stock - (New - Old)
        UPDATE StockStatus
        SET Quantity = Quantity - @Difference,
            UpdateAt = GETDATE()
        WHERE ProductID = @ProductID AND WarehouseID = @WarehouseID;

        -- 4. Update Movement Record
        UPDATE StockMovements
        SET Quantity = @NewQuantity,
            FromBinID = @FromBinID,
            Reason = @Reason,
            UserID = @PerformingUserID,
            CreatedAt = GETDATE()
        WHERE MovementID = @MovementID;

        INSERT INTO AuditLog (UserID, Action, CreatedAt)
        VALUES (@PerformingUserID, 'UPDATE Stock OUT', GETDATE());
    END
END
GO
