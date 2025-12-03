import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qgyevvpfgsfrmuexhxnz.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFneWV2dnBmZ3Nmcm11ZXhoeG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTI4OTYsImV4cCI6MjA4MDIyODg5Nn0.u_oOAM7d9N1npMeBQDosAylMS_FBLpXp-LbzZxoHios';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
