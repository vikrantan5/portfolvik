import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fffgleifllmvpfzhmhbq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmZmdsZWlmbGxtdnBmemhtaGJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjQ0OTcsImV4cCI6MjA3ODE0MDQ5N30._UGnjDeA9MsFHXnD_ntOJMBnZNjTejTW70Ak0Zd0nAA';

const supabase = createClient(supabaseUrl, supabaseKey);

const email = 'admin@portfolio.com';
const password = 'Admin@123456';

console.log('\n🚀 Creating admin user...\n');

const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
});

if (error) {
  if (error.message.includes('already registered')) {
    console.log('✅ Admin user already exists!');
    console.log('\n📧 Login Credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('\n🔗 Login at: http://localhost:5173/admin\n');
  } else {
    console.error('❌ Error:', error.message);
  }
} else {
  console.log('✅ Admin user created successfully!');
  console.log('\n📧 Login Credentials:');
  console.log('   Email:', email);
  console.log('   Password:', password);
  console.log('\n🔗 Login at: http://localhost:5173/admin\n');
  if (data.user && !data.user.confirmed_at) {
    console.log('⚠️  Note: Please check your email to verify the account.\n');
  }
}
