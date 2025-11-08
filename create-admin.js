import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fffgleifllmvpfzhmhbq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmZmdsZWlmbGxtdnBmemhtaGJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjQ0OTcsImV4cCI6MjA3ODE0MDQ5N30._UGnjDeA9MsFHXnD_ntOJMBnZNjTejTW70Ak0Zd0nAA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  const email = 'admin@portfolio.com';
  const password = 'Admin@123456';

  console.log('Creating admin user...');
  console.log('Email:', email);
  console.log('Password:', password);

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.error('Error creating admin:', error.message);
  } else {
    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('\n🔗 Login URL: http://localhost:5173/admin');
  }
}

createAdmin();
