
-- Adiciona 'compatibility' ao enum test_type em transação separada
ALTER TYPE public.test_type ADD VALUE IF NOT EXISTS 'compatibility';
