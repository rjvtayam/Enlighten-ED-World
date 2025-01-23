-- Add is_completed column to assessments table
ALTER TABLE assessments 
ADD COLUMN is_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- Update existing records to set is_completed based on overall_score
UPDATE assessments 
SET is_completed = TRUE 
WHERE overall_score IS NOT NULL;
