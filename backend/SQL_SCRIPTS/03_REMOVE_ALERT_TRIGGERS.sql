USE [EWarehouse_DB]
GO

-- =============================================
-- REMOVE ALERT TRIGGERS
-- The user requested to remove "alert stuff" causing "Invalid object name 'Alert'" errors.
-- =============================================

DROP TRIGGER IF EXISTS trg_Alert_LowStock;
GO

DROP TRIGGER IF EXISTS trg_Alert_MissingLocation;
GO

DROP TRIGGER IF EXISTS trg_Alert_LocationRemoved;
GO

PRINT 'Alert Triggers have been removed. Stock Movements should now work without "Invalid object name Alert" errors.'
