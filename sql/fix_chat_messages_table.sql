-- Fix chat_messages table by adding missing columns
USE elms;

-- Add message_type column (for text/image/file messages)
ALTER TABLE chat_messages 
ADD COLUMN message_type ENUM('text', 'image', 'file') NOT NULL DEFAULT 'text' AFTER message;

-- Add file_url column (for storing file/image URLs)
ALTER TABLE chat_messages 
ADD COLUMN file_url VARCHAR(500) NULL AFTER message_type;

-- Verify the changes
DESCRIBE chat_messages;

SELECT 'Chat messages table updated successfully!' AS status;
