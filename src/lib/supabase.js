import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uqkfdowrsvnbacmaeirh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxa2Zkb3dyc3ZuYmFjbWFlaXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1Mjg2ODgsImV4cCI6MjA5NDEwNDY4OH0.Hqk_tgYhXKSzye3MYlAu8EtbIkul2JqwBpY1ybk_DXI';

export const supabase = createClient(supabaseUrl, supabaseKey);
