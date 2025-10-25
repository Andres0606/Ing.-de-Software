require('dotenv').config();
const { supabase } = require('../src/db/mysql');

async function testSupabase() {
  console.log('🧪 Probando conexión a Supabase...\n');

  try {
    // Test 1: Leer categorías
    console.log('📋 Test 1: Obtener categorías');
    const { data: categorias, error: catError } = await supabase
      .from('categorias')
      .select('*')
      .limit(5);

    if (catError) throw catError;
    console.log('✅ Categorías encontradas:', categorias.length);
    console.log(categorias);

    // Test 2: Contar usuarios
    console.log('\n👥 Test 2: Contar usuarios');
    const { count, error: countError } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;
    console.log('✅ Total de usuarios:', count);

    console.log('\n✅ Todos los tests pasaron correctamente');
  } catch (error) {
    console.error('❌ Error en los tests:', error.message);
    process.exit(1);
  }
}

testSupabase();