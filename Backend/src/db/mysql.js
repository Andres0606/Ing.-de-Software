const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
// 🔥 USA SERVICE_ROLE_KEY para bypasear RLS
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Faltan las credenciales de Supabase');
}

console.log('✅ Supabase client conectado:', supabaseUrl);
console.log('🔑 Usando clave:', supabaseKey === process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE' : 'ANON');

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

module.exports = { supabase };