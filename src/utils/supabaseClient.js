import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://ifeogtxgiqrlllqyjvze.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZW9ndHhnaXFybGxscXlqdnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0OTY4NzIsImV4cCI6MjA3OTA3Mjg3Mn0.UiJbMA5i3GsmNspv4R_12WcmJhJ68UJBVnF6cVp7GQc';

export const supabase = createClient(supabaseUrl, supabaseKey);
        