-- Migration: Add stock_status field to products table
-- Date: 2025-11-26
-- Description: Add stock_status field to track product availability

-- Step 1: Add stock_status column with default value
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock_status VARCHAR(20) DEFAULT 'available';

-- Step 2: Add CHECK constraint to ensure valid values
ALTER TABLE products
ADD CONSTRAINT check_stock_status 
CHECK (stock_status IN ('available', 'low_stock', 'sold_out'));

-- Step 3: Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_stock_status 
ON products(stock_status);

-- Step 4: Update existing products based on stock value
-- Set to sold_out if stock is 0
UPDATE products 
SET stock_status = 'sold_out' 
WHERE stock = 0;

-- Set to low_stock if stock is between 1 and 3
UPDATE products 
SET stock_status = 'low_stock' 
WHERE stock > 0 AND stock <= 3;

-- Set to available if stock is more than 3
UPDATE products 
SET stock_status = 'available' 
WHERE stock > 3;

-- Step 5: Create or replace function to auto-update stock_status when stock changes
CREATE OR REPLACE FUNCTION update_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock = 0 THEN
        NEW.stock_status = 'sold_out';
    ELSIF NEW.stock > 0 AND NEW.stock <= 3 THEN
        NEW.stock_status = 'low_stock';
    ELSE
        NEW.stock_status = 'available';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create trigger to automatically update stock_status
DROP TRIGGER IF EXISTS trigger_update_stock_status ON products;
CREATE TRIGGER trigger_update_stock_status
    BEFORE INSERT OR UPDATE OF stock ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_status();

-- Step 7: Add comment to column
COMMENT ON COLUMN products.stock_status IS 'Product stock status: available (stock > 3), low_stock (stock 1-3), sold_out (stock = 0)';
