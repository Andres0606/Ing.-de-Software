const { createClient } = require('@supabase/supabase-js');

// Singleton global para evitar crear múltiples instancias del cliente
function getGlobalSupabaseClient() {
  if (!global.__supabaseClient) {
    global.__supabaseClient = createSupabaseClient();
  }
  return global.__supabaseClient;
}

function createSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('❌ Faltan las credenciales de Supabase (SUPABASE_URL y SUPABASE_ANON_KEY)');
  }

  console.log('✅ Supabase client conectado:', supabaseUrl);

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
}

// Obtener cliente de Supabase
function getClient() {
  return getGlobalSupabaseClient();
}

// Función query adaptada para Supabase (compatibilidad con código legacy)
async function query(sql, params) {
  console.warn('⚠️ La función query() con SQL directo no es compatible con Supabase.');
  console.warn('💡 Usa el cliente de Supabase directamente: getClient().from("tabla").select()');
  throw new Error('Método query() no soportado. Usa el cliente de Supabase.');
}

// Cierre del cliente
async function closeClient() {
  if (global.__supabaseClient) {
    global.__supabaseClient = null;
    console.log('✅ Cliente de Supabase cerrado');
  }
}

// Cierre ordenado en parada del proceso
process.on('SIGINT', async () => { 
  await closeClient(); 
  process.exit(0); 
});

process.on('SIGTERM', async () => { 
  await closeClient(); 
  process.exit(0); 
});

// Exportar tanto el cliente como funciones de compatibilidad
module.exports = { 
  getClient,
  getPool: getClient,
  query,
  closeClient,
  closePool: closeClient,
  supabase: getGlobalSupabaseClient()
};