import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mnxzvpjgcsuwykywhdwb.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ueHp2cGpnY3N1d3lreXdoZHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDIxMDcsImV4cCI6MjA1NzY3ODEwN30.8wG7zwqVTPJM-e4r64dHEyMTFbaoZlRqIh2OGYNteq0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
